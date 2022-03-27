const express = require('express');
const { Op } = require('sequelize');
const {
  RolesGroups,
  Workflow,
  WorkflowTransaction,
  WorkflowData,
} = require('../../../db/models');
const router = express.Router();
const { auth } = require('../../../middleware/auth.middleware');
const {
  validateId,
  validate,
} = require('../../../middleware/validation.middleware');
const { HandleErrors } = require('../../../utils');

// METHOD: GET
// URI: /api/user/workflow/read_all_of_auth_user,
// ACCESS: Logged in users
// DESCRIPTION: Get workflows by the role of logged in user
// RETURN: workflow_of_role <array>
router.get(
  '/api/user/workflow/read_all_of_auth_user',
  auth,
  async (req, res) => {
    try {
      // get all groups that user role is in them
      const role_groups = await RolesGroups.findAll({
        where: { role_id: req.user.role_id },
      });

      // convert role_groups to an array to be used in query
      const role_groups_array = role_groups.map(
        (role_group) => role_group.group_id,
      );

      // find all workflows that initiated by any group that contains user
      const workflows = await Workflow.findAll({
        where: {
          creators: { [Op.in]: role_groups_array },
        },
      });

      if (!workflows || workflows.length === 0) {
        return res.status(404).json({
          message: 'No workflow found for given employee',
        });
      }
      return res.json({
        message: 'Success',
        payload: { workflows },
      });
    } catch (error) {
      HandleErrors(error, res);
    }
  },
);

// METHOD: GET
// URI: /api/user/workflow/read_one_by_id
// ACCESS: Logged in users, only allowed for users who have access to worklow
// DESCRIPTION: Get workflow by workflow_id
// PARAMETERS:
//   REQUIRED: workflow_id <uuid>
// RETURN: workflow with workflow transactions and data fields <object>
router.get(
  '/api/user/workflow/read_one_by_id',
  [...validateId('workflow_id'), validate, auth],
  async (req, res) => {
    try {
      const workflow = await Workflow.findByPk(req.query.workflow_id);
      if (!workflow) {
        return res.status(404).json({ message: 'Workflow not found' });
      }

      // check if user role has access to workflow
      if (
        !(
          await Workflow.findAll({
            where: {
              creators: {
                [Op.in]: (
                  await RolesGroups.findAll({
                    where: { role_id: req.user.role_id },
                  })
                ).map((role_group) => role_group.group_id),
              },
            },
          })
        )
          .map((workflow) => workflow.id)
          .includes(workflow.id)
      ) {
        return res
          .status(401)
          .json({ message: 'You are not authorized to access this workflow' });
      }

      // get all workflow transactions
      const workflowTransactions = await WorkflowTransaction.findAll({
        where: { workflow_id: workflow.id },
      });

      // get all workflow data
      const workflowData = await WorkflowData.findAll({
        where: {
          workflow_transaction_id: {
            [Op.in]: workflowTransactions.map(
              (workflowTransaction) => workflowTransaction.id,
            ),
          },
        },
      });
      const result = {
        ...workflow.dataValues,
        workflow_transactions: workflowTransactions.map(
          (workflowTransaction) => ({
            ...workflowTransaction.dataValues,
            workflow_transaction_data: workflowData.filter(
              (item) => item.workflow_transaction_id === workflowTransaction.id,
            ),
          }),
        ),
      };

      return res.json({
        message: 'Success',
        payload: {
          workflow: result,
        },
      });
    } catch (error) {
      HandleErrors(error, res);
    }
  },
);

module.exports = router;
