const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
const { auth } = require('../../../../middleware/auth.middleware');
const {
  validateId,
  validate,
  validateValuesArray,
  validateOptionalId,
} = require('../../../../middleware/validation.middleware');
const {
  HandleErrors,
  GetConstants,
  ExtendApprovalSequence,
} = require('../../../../utils');
const {
  Document,
  Workflow,
  WorkflowTransaction,
  WorkflowData,
  DocumentTransaction,
  DocumentData,
  RolesGroups,
  Employee,
  User,
} = require('../../../../db/models');

const CONSTANTS = GetConstants();
const STATUS = CONSTANTS.STATUS;

// METHOD: POST
// URI: /api/user/document/create_or_update
// ACCESS: Logged in users
//      for creation: only allowed for users who have access to worklow
//      for update: only allowed when document approved, and user has access to workflow transaction
// DESCRIPTION: Create new document or update current one
// PARAMETERS:
//   REQUIRED: FOR CREATE: workflow_id <uuid>, workflow_transaction_id <uuid>
//   REQUIRED: FOR UPDATE: workflow_id <uuid>, workflow_transaction_id <uuid>, document_id <uuid>
// RETURN: document <object>
router.post(
  '/api/user/document/create_or_update',
  [
    ...validateId('workflow_id'),
    ...validateId('workflow_transaction_id'),
    ...validateOptionalId('document_id'),
    ...validateValuesArray('data_values'),
    validate,
    auth,
  ],
  async (req, res) => {
    try {
      // find workflow that document belongs to
      const workflow = await Workflow.findByPk(req.body.workflow_id);

      // find workflow_transaction that user edit
      const workflow_transaction = await WorkflowTransaction.findByPk(
        req.body.workflow_transaction_id,
      );

      // yield if nothing found
      if (!workflow || !workflow_transaction) {
        return res
          .status(404)
          .json({ message: 'Workflow or Workflow Transaction not found' });
      }

      const document = req.body.document_id
        ? await Document.findByPk(req.body.document_id)
        : Document.build({
            workflow_id: workflow.id,
            status: STATUS.STARTED,
            creator: req.user.employee_id,
            approvals: JSON.stringify(
              await ExtendApprovalSequence(
                JSON.parse(workflow.approval_sequence),
                req.user.role_id,
              ),
            ),
          });

      if (!document) {
        return res.status(404).json({
          message: 'Document not found',
        });
      }

      // if it is create request, check for creation constraint to create
      if (workflow_transaction.order === 0) {
        // check for permission to create
        const allowed_workflows = await Workflow.findAll({
          where: {
            creators: {
              [Op.in]: (
                await RolesGroups.findAll({
                  where: { role_id: req.user.role_id },
                })
              ).map((role_group) => role_group.group_id),
            },
          },
        });
        if (!allowed_workflows || allowed_workflows.length === 0) {
          return res.status(401).json({
            message:
              'You are not authorized to create a document of provided workflow',
          });
        }

        if (
          !allowed_workflows
            .map((workflow) => workflow.id)
            .includes(workflow.id)
        ) {
          return res.status(401).json({
            message:
              'You are not authorized to create a document of provided workflow',
          });
        }

        // check if another document for the creater of selected workflow
        //  is in pending state
        const duplicate_document = await Document.findOne({
          where: {
            creator: req.user.employee_id,
            workflow_id: workflow.id,
            status: {
              [Op.or]: [STATUS.STARTED, STATUS.PENDING, STATUS.PROCESSING],
            },
          },
        });
        if (duplicate_document) {
          return res.status(401).json({
            message:
              'Another document of this workflow exists for current user',
          });
        }
      }

      // if it is update request, check update constraints
      if (workflow_transaction.order !== 0) {
        // check for user permission
        if (workflow_transaction.assigned_to !== req.user.role_id) {
          return res.status(401).json({
            message:
              'You are not authorized to edit provided workflow transaction',
          });
        }
        // if it is the first transaction check if document is in approved state
        if (
          workflow_transaction.order === 1 &&
          document.status !== STATUS.APPROVED
        ) {
          console.log(document);
          return res.status(404).json({
            message: 'Document is not approved yet',
          });
        }
        // if it is not the first transaction check the status of previous transaction
        else if (workflow_transaction.order > 1) {
          const previous_workflow_transaction =
            await WorkflowTransaction.findOne({
              where: {
                workflow_id: workflow.id,
                order: workflow_transaction.order - 1,
              },
            });
          const previous_document_transaction =
            await DocumentTransaction.findOne({
              where: {
                workflow_transaction_id: previous_workflow_transaction.id,
              },
            });

          if (previous_document_transaction.status !== STATUS.COMPLETED) {
            return res.status(401).json({
              message: 'Previous transaction is not yet completed',
            });
          }
        }
      }

      // get workflow data that corresponds to document
      const workflow_transaction_data = await WorkflowData.findAll({
        where: { workflow_transaction_id: workflow_transaction.id },
      });

      /* TODO: validate document data against workflow data constraints
      const data_values_error = [];
      req.body.data_values.forEach(async (data_value) => {
        const data_constraints = workflow_transaction_data.find(
          (item) => item.name === data_value.name,
        );
        // TODO - Check type for each datafield then apply constraints
      });
      if (data_values_error.length > 0) {
        return res.status(400).json({
          message: 'Failure',
          data_values_error,
        });
      }
      */

      // create document transaction and save data to DocumentData
      const document_transaction = DocumentTransaction.build({
        document_id: document.id,
        workflow_transaction_id: workflow_transaction.id,
        author: req.user.employee_id,
        status: STATUS.COMPLETED,
      });

      const document_data = DocumentData.bulkBuild(
        req.body.data_values.map((data) => ({
          name: data.name,
          value: data.value,
          document_transaction_id: document_transaction.id,
          workflow_data_id: workflow_transaction_data.find(
            (item) => item.name === data.name,
          ).id,
        })),
      );

      // TODO: implement document termination

      // if it is first transaction change document status to processing
      if (workflow_transaction.order === 1) {
        document.status = STATUS.PROCESSING;
      }
      // if it is update request, and it is the last transaction
      //  -> change document status to completed
      if (
        workflow_transaction.order ===
        (
          await WorkflowTransaction.findAll({
            where: {
              workflow_id: workflow.id,
            },
          })
        ).length -
          1
      ) {
        document.status = STATUS.COMPLETED;
      }

      await document.save();
      await document_transaction.save();
      for (const item of document_data) {
        await item.save();
      }
      return res.json({
        message: 'Success',
        payload: {
          document,
        },
      });
    } catch (error) {
      HandleErrors(error, res);
    }
  },
);

// METHOD: GET
// URI: /api/user/document/read_one_by_id
// ACCESS: Logged in users
// DESCRIPTION: Get one document by id
// RETURN: document
router.get(
  '/api/user/document/read_one_by_id',
  [...validateId('document_id'), validate, auth],
  async (req, res) => {
    try {
      let result;
      const document = await Document.findByPk(req.query.document_id, {
        include: [{ model: Workflow }, { model: Employee }],
      });

      const document_transactions = await DocumentTransaction.findAll({
        where: { document_id: document.id },
        include: [{ model: Employee }, { model: WorkflowTransaction }],
      });

      const transactions_and_data = [];
      for (const document_transaction of document_transactions) {
        const document_transaction_data = await DocumentData.findOne({
          where: { document_transaction_id: document_transaction.id },
          include: [{ model: WorkflowData }],
        });
        transactions_and_data.push({});
      }

      if (!document) {
        return res.status(404).json({
          message: 'No document found',
        });
      }

      return res.json({
        message: 'Success',
        payload: { document: { ...document, ...transactions_and_data } },
      });
    } catch (error) {
      HandleErrors(error, res);
    }
  },
);

// METHOD: GET
// URI: /api/user/document/read_all
// ACCESS: Logged in users
// DESCRIPTION: Get all documents created by user
// RETURN: documents <array of objects>
router.get('/api/user/document/read_all', auth, async (req, res) => {
  try {
    const documents = await Document.findAll({
      where: { creator: req.user.employee_id },
      order: [
        ['created_at', 'DESC'],
        ['status', 'ASC'],
      ],
      include: Workflow,
    });

    if (!documents || documents.length === 0) {
      return res.status(404).json({
        message: 'No documents found',
      });
    }

    return res.json({
      message: 'Success',
      payload: { documents },
    });
  } catch (error) {
    HandleErrors(error, res);
  }
});

router.use(require('./actions'));
router.use(require('./approvals'));

module.exports = router;
