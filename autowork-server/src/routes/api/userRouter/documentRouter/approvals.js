const express = require('express');
const { Op } = require('sequelize');
const { auth } = require('../../../../middleware/auth.middleware');
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

module.exports = router;
