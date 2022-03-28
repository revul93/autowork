const express = require('express');
const { Op } = require('sequelize');
const { auth } = require('../../../middleware/auth.middleware');
const {
  validateId,
  validate,
  validateValuesArray,
  validateOptionalId,
  validateBoolean,
} = require('../../../middleware/validation.middleware');
const {
  HandleErrors,
  GetConstants,
  ExtendApprovalSequence,
} = require('../../../utils');
const {
  Document,
  Workflow,
  WorkflowTransaction,
  WorkflowData,
  DocumentTransaction,
  DocumentData,
  RolesGroups,
  Employee,
} = require('../../../db/models');
const router = express.Router();

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
        ? Document.findByPk(req.body.document_id)
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
          const previous_document_transaction = DocumentTransaction.findOne({
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

// METHOD: PUT
// URI: /api/user/document/update_approval
// ACCESS: Logged in users who are in approval sequence
// DESCRIPTION: Approve or Reject a document
// PARAMETERS:
//   REQUIRED: FOR CREATE: document_id <uuid>, is_approved <boolean>
//   REQIORED if is_approved = false: note <string>
// RETURN: document <object>
router.put(
  '/api/user/document/update_approval',
  [
    ...validateId('document_id'),
    ...validateBoolean('is_approved'),
    validate,
    auth,
  ],
  async (req, res) => {
    try {
      const document = await Document.findOne({
        where: {
          id: req.body.document_id,
          status: {
            [Op.or]: [STATUS.STARTED, STATUS.PENDING],
          },
        },
      });
      if (!document) {
        return res.status(401).json({
          message: 'No documents awaiting for approvals found',
        });
      }
      if (!req.body.is_approved && !req.body.note) {
        return res.status(400).json({
          message: 'Note is required if document rejected',
        });
      }

      const approvals = JSON.parse(document.approvals);

      // check if approvals required
      if (approvals.length === 0) {
        return res.status(401).json({
          message: 'No approval required for this document',
        });
      }
      // check if document rejected
      approvals.forEach((approval) => {
        if (approval.status === STATUS.REJECTED) {
          return res.status(401).json({
            message: 'Document rejected',
            payload: {
              document_id: document.id,
              who_reject: approval.author,
              rejection_reason: approval.note,
              date: approval.date,
            },
          });
        }
      });

      // construct approval
      const user_approval = {
        role_id: req.user.role_id,
        author: req.user.employee_id,
        status: req.body.is_approved ? STATUS.APPROVED : STATUS.REJECTED,
        note: req.body.note,
        date: new Date().toLocaleString(),
      };

      // check if user role is in approval sequence and
      //  approval is in pending state
      const approval_index = approvals.findIndex(
        (approval) =>
          approval.role_id === req.user.role_id &&
          approval.status === STATUS.PENDING,
      );
      // if user not found in approval sequence
      //  or if user has approved
      if (approval_index === -1) {
        return res.status(401).json({
          message: 'You are not allowed to approve or reject this document',
        });
      }
      // if user is the first in approval sequence
      else if (approval_index === 0) {
        approvals[approval_index] = user_approval;
        document.status = req.body.is_approved
          ? approvals.length - 1 === approval_index
            ? STATUS.APPROVED
            : STATUS.PENDING
          : STATUS.REJECTED;
      } else {
        // if user not the first check if previous user has approved
        if (approvals[approval_index - 1].status !== STATUS.APPROVED) {
          return res.status(401).json({
            message: 'Previous approval in approval sequence not granted yet',
          });
        } else {
          approvals[approval_index] = user_approval;
          if (!req.body.is_approved) {
            document.status = STATUS.REJECTED;
          }
          // if user is the last one in approval sequence
          if (approval_index === approvals.length - 1 && req.body.is_approved) {
            document.status = STATUS.APPROVED;
          }
        }
      }

      document.approvals = JSON.stringify(approvals);
      await document.save();
      return res.json({
        message: 'Success',
        payload: { document },
      });
    } catch (error) {
      console.log(error);
      HandleErrors(error, res);
    }
  },
);

// METHOD: GET
// URI: /api/user/document/read_all_approvals_of_auth_user
// ACCESS: Logged in users who has access to document
// DESCRIPTION: Get documents that awaiting for approval from auth user
// RETURN: documents <array of objects>
router.get(
  '/api/user/document/read_all_approvals_of_auth_user',
  auth,
  async (req, res) => {
    try {
      // get all documents
      const documents = await Document.findAll({
        include: [{ model: Employee }, { model: Workflow }],
        order: [
          ['created_at', 'DESC'],
          ['status', 'ASC'],
        ],
      });

      const approvalDocuments = [];
      for (const document of documents) {
        const approvals = JSON.parse(document.approvals);
        // check if user in approval sequence and approval status is pending
        const approval_index = approvals.findIndex(
          (approval) =>
            approval.role_id === req.user.role_id &&
            approval.status !== STATUS.PENDING,
        );
        if (approval_index === -1) {
          continue;
        } else {
          approvalDocuments.push(document);
        }
      }
      if (approvalDocuments.length === 0) {
        return res.status(404).json({ message: 'No documents found' });
      }

      return res.json({
        message: 'Success',
        payload: {
          documents: approvalDocuments,
        },
      });
    } catch (error) {
      HandleErrors(error, res);
    }
  },
);

// METHOD: GET
// URI: /api/user/document/read_awaiting_approvals_from_auth_user
// ACCESS: Logged in users who has access to document
// DESCRIPTION: Get documents that awaiting for approval from auth user
// RETURN: documents <array of objects>
router.get(
  '/api/user/document/read_awaiting_approvals_from_auth_user',
  auth,
  async (req, res) => {
    try {
      // get all documents with started or pending status
      const documents = await Document.findAll({
        where: {
          status: {
            [Op.or]: [STATUS.STARTED, STATUS.PENDING],
          },
        },
        include: [{ model: Employee }, { model: Workflow }],
        order: [
          ['created_at', 'DESC'],
          ['status', 'ASC'],
        ],
      });

      const awaiting_documents = [];
      for (const document of documents) {
        const approvals = JSON.parse(document.approvals);
        // check if user in approval sequence and approval status is pending
        const approval_index = approvals.findIndex(
          (approval) =>
            approval.role_id === req.user.role_id &&
            approval.status === STATUS.PENDING,
        );
        if (approval_index === -1) {
          continue;
        } else if (approval_index === 0) {
          awaiting_documents.push(document);
        } else {
          if (approvals[approval_index - 1].status === STATUS.APPROVED) {
            awaiting_documents.push(document);
          }
        }
      }

      if (awaiting_documents.length === 0) {
        return res
          .status(404)
          .json({ message: 'No documents awaiting approvals found' });
      }

      return res.json({
        message: 'Success',
        payload: {
          documents: awaiting_documents,
        },
      });
    } catch (error) {
      HandleErrors(error, res);
    }
  },
);

// METHOD: GET
// URI: /api/user/document/read_awaiting_actions_from_auth_user
// ACCESS: Logged in users who has access to document
// DESCRIPTION: Get documents that awaiting for actions from auth user
//      i.e.: user role is assigned to one of document workflow transaction
//          and document workflow transaction is first one in sequence
//            or previous document workflow transaction status is completed
// RETURN: documents <array of objects>
router.get(
  '/api/user/document/read_awaiting_actions_from_auth_user',
  auth,
  async (req, res) => {
    try {
      // get all documents with approved or processing status
      const documents = await Document.findAll({
        where: {
          status: {
            [Op.or]: [STATUS.APPROVED, STATUS.PROCESSING],
          },
        },
        order: [
          ['created_at', 'DESC'],
          ['status', 'ASC'],
        ],
      });

      // check if no documents found
      if (!documents || documents.length === 0) {
        return res.status(404).json({
          message: 'No documents awaiting for actions found',
        });
      }

      const awaiting_documents = [];
      for (const document of documents) {
        // get workflow that corresponds with document
        const workflow = await Workflow.findByPk(document.workflow_id);
        // get workflow transaction that corresponds with document and is assigned to user
        const workflow_transaction = await WorkflowTransaction.findOne({
          where: {
            workflow_id: workflow.id,
            assigned_to: req.user.role_id,
          },
        });

        // check if no workflow transaction is found
        if (!workflow_transaction) {
          return res.status(404).json({
            message: 'No workflow transaction assigned to user found',
          });
        }

        // if workflow transaction order is not the first transaction
        //  check that previous transaction is completed
        if (workflow_transaction.order > 1) {
          const previous_workflow_transaction =
            await WorkflowTransaction.findOne({
              where: {
                workflow_id: workflow.id,
                order: workflow_transaction.order - 1,
              },
            });
          if (previous_workflow_transaction.status === STATUS.COMPLETED) {
            awaiting_documents.push({
              ...document.dataValues,
              workflow_transaction_id: workflow_transaction.id,
              workflow_transaction_order: workflow_transaction.order,
            });
          }
        } else if (workflow_transaction.order === 1) {
          awaiting_documents.push({
            ...document.dataValues,
            workflow_transaction_id: workflow_transaction.id,
            workflow_transaction_order: workflow_transaction.order,
          });
        }
      }

      if (awaiting_documents.length === 0) {
        return res
          .status(404)
          .json({ message: 'No documents awaiting actions found' });
      }

      return res.json({
        message: 'Success',
        payload: {
          documents: awaiting_documents,
        },
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

module.exports = router;
