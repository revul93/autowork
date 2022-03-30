const express = require('express');
const { Op } = require('sequelize');
const { auth } = require('../../../../middleware/auth.middleware');
const {
  validate,
  validateId,
  validateBoolean,
} = require('../../../../middleware/validation.middleware');
const { HandleErrors, GetConstants } = require('../../../../utils');
const { Document, Workflow, Employee } = require('../../../../db/models');
const router = express.Router();

const CONSTANTS = GetConstants();
const STATUS = CONSTANTS.STATUS;

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

module.exports = router;
