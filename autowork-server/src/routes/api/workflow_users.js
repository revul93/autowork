const express = require('express');
const { Op } = require('sequelize');
const { RolesGroups, Workflow } = require('../../db/models');
const router = express.Router();
const { auth } = require('../../middleware/auth.middleware');
const { handleErrors } = require('../../utils');

// METHOD: GET
// URI: /api/workflow/get_workflow_of_employee
// ACCESS: Logged in users
// DESCRIPTION: Get workflows that can be initiated by user
// RETURN: workflow_of_user <array>
router.get('/api/workflow/get_workflow_of_employee', auth, async (req, res) => {
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
    const workflows_of_employee = await Workflow.findAll({
      where: {
        initiators: { [Op.in]: role_groups_array },
      },
    });

    if (!workflows_of_employee) {
      return res.status(404).json({
        message: 'No workflow found for given employee',
      });
    }
    return res.json({
      workflows_of_employee,
    });
  } catch (error) {
    handleErrors(error, res);
  }
});

module.exports = router;
