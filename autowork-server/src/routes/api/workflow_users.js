const express = require('express');
const { Op } = require('sequelize');
const { RolesGroups, Workflow } = require('../../db/models');
const router = express.Router();
const { auth } = require('../../middleware/auth.middleware');
const { handleErrors } = require('../../utils');
router.get('/api/workflow/get_workflow_of_employee', auth, async (req, res) => {
  try {
    const { role_id } = req.user;
    const role_groups = await RolesGroups.findAll({
      where: { role_id },
    });
    const role_groups_array = role_groups.map(
      (role_group) => role_group.group_id,
    );
    console.log(role_groups_array);
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
