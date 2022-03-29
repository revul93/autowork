const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { auth } = require('../../../../middleware/auth.middleware');
const { HandleErrors, GetConstants } = require('../../../../utils');
const {
  Document,
  Workflow,
  WorkflowTransaction,
  WorkflowData,
  DocumentTransaction,
  Employee,
} = require('../../../../db/models');

const CONSTANTS = GetConstants();
const STATUS = CONSTANTS.STATUS;

// METHOD: GET
// URI: /api/user/document/read_all_actions_of_auth_user
// ACCESS: Logged in users who has access to document
// DESCRIPTION: Get all documents that has action from auth user
// RETURN: documents <array of objects>
router.get(
  '/api/user/document/read_all_actions_of_auth_user',
  auth,
  async (req, res) => {
    try {
      // get all documents with approved or processing status
      const documents = await Document.findAll({
        where: {
          status: {
            [Op.or]: [STATUS.PROCESSING, STATUS.COMPLETED, STATUS.TERMINATED],
          },
        },
        order: [
          ['created_at', 'DESC'],
          ['status', 'ASC'],
        ],
        include: [{ model: Employee }, { model: Workflow }],
      });

      // check if no documents found
      if (!documents || documents.length === 0) {
        return res.status(404).json({
          message: 'No documents found',
        });
      }

      const all_documents = [];
      for (const document of documents) {
        const document_transaction = await DocumentTransaction.findOne({
          where: {
            document_id: document.id,
            author: req.user.employee_id,
            status: {
              [Op.in]: [STATUS.COMPLETED, STATUS.TERMINATED],
            },
          },
        });

        if (!document_transaction) {
          continue;
        }

        const workflow_transaction = await WorkflowTransaction.findByPk(
          document_transaction.workflow_transaction_id,
        );

        if (workflow_transaction.order > 0 && document_transaction) {
          all_documents.push({
            ...document.dataValues,
            document_transaction,
          });
        }
      }

      if (all_documents.length === 0) {
        return res.status(404).json({ message: 'No documents found' });
      }

      return res.json({
        message: 'Success',
        payload: {
          documents: all_documents,
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
        include: [{ model: Employee }, { model: Workflow }],
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

        if (!workflow_transaction) {
          continue;
        }

        const document_transaction = await DocumentTransaction.findOne({
          where: {
            document_id: document.id,
            workflow_transaction_id: workflow_transaction.id,
          },
        });

        // check if no document transaction is found means transaction is waiting
        if (!document_transaction) {
          const workflow_transaction_data = await WorkflowData.findAll({
            where: { workflow_transaction_id: workflow_transaction.id },
          });
          // check if previous transaction
          if (workflow_transaction.order === 0) {
            awaiting_documents.push({
              ...document.dataValues,
              workflow_transaction,
              workflow_transaction_data,
            });
          } else {
            const previous_document_transaction =
              await DocumentTransaction.findOne({
                where: {
                  document_id: document.id,
                  workflow_transaction_id: (
                    await WorkflowTransaction.findOne({
                      where: {
                        workflow_id: workflow.id,
                        order: workflow_transaction.order - 1,
                      },
                    })
                  ).id,
                },
              });
            if (previous_document_transaction.status === STATUS.COMPLETED) {
              awaiting_documents.push({
                ...document.dataValues,
                workflow_transaction,
                workflow_transaction_data,
              });
            }
          }
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

module.exports = router;
