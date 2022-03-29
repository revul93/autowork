const express = require('express');
const router = express.Router();
const {
  validate,
  validateId,
  validateParameter,
  validateUniqueness,
  validateOptionalId,
} = require('../../../middleware/validation.middleware');
const { Op } = require('sequelize');
const { handleErrors } = require('../../../utils');
const {
  Workflow,
  WorkflowHeader,
  WorkflowTransaction,
  Group,
  WorkflowDataField,
} = require('../../../db/models');

router.get(
  '/api/workflow/read_one_by_id',
  [...validateId('workflow_id'), validate],
  async (req, res) => {
    try {
      const workflow = await Workflow.findByPk(req.body.workflow_id);
      const workflow_header = await WorkflowHeader.findOne({
        where: { workflow_id: workflow.id },
      });
      const initiators = await Group.findByPk(workflow_header.initiators);
      const header_data_field = await WorkflowDataField.findAll({
        where: { workflow_header_id: workflow_header.id },
      });
      const workflowTransactions = await WorkflowTransaction.findAll({
        where: { workflow_id: workflow.id },
        order: ['order'],
      });
      const transactions = await Promise.all(
        workflowTransactions.map(async (workflowTransaction) => ({
          id: workflowTransaction.id,
          order: workflowTransaction.order,
          workflow_id: workflowTransaction.workflow_id,
          assigned_to: workflowTransaction.assigned_to,
          transaction_data_field: await WorkflowDataField.findAll({
            where: { workflow_transaction_id: workflowTransaction.id },
            order: ['createdAt'],
          }),
        })),
      );

      return res.json({
        message: 'Success',
        payload: {
          workflow_name: workflow.name,
          initiators: initiators.name,
          header_data_field,
          transactions,
        },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

module.exports = router;
