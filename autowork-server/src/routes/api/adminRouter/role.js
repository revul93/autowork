const express = require('express');
const router = express.Router();
const { auth, authAdmin } = require('../../../middleware/auth.middleware');
const {
  validate,
  validateId,
  validateParameter,
  validateUniqueness,
  validateOptionalId,
} = require('../../../middleware/validation.middleware');
const { handleErrors } = require('../../../utils');
const { Role, Section, Division } = require('../../../db/models');

router.post(
  '/api/role/create',
  [
    ...validateParameter('role_title'),
    ...validateUniqueness('role_title', Role),
    ...validateOptionalId('division_id'),
    ...validateOptionalId('reports_to'),
    validate,
    auth,
    authAdmin,
  ],
  async (req, res) => {
    const { role_title, division_id, reports_to } = req.body;
    try {
      const division = await Division.findByPk(division_id);
      if (!division) {
        return res.status(404).json({
          message: 'Division not found',
        });
      }

      const reports_to_role = await Role.findByPk(reports_to);
      if (!reports_to_role) {
        return res.status(404).json({ message: 'Reports to role not found' });
      }

      const role = await Role.create({
        title: role_title,
        division_id: division ? division.id : null,
        reports_to: reports_to_role ? reports_to_role.id : null,
      });

      await role.save();
      return res.json({
        message: 'Success',
        payload: { role },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/role/read_one_by_id',
  [...validateId('role_id'), validate],
  async (req, res) => {
    const { role_id } = req.body;
    try {
      const role = await Role.findByPk(role_id);
      if (!role) {
        return res.status(404).json({
          message: 'Role not found',
        });
      }
      return res.json({
        message: 'Success',
        payload: { role },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/role/read_one_by_name',
  [...validateParameter('role_title'), validate],
  async (req, res) => {
    const { role_title } = req.body;
    try {
      const role = await Role.findOne({
        where: { title: role_title },
      });
      if (!role) {
        return res.status(404).json({
          message: 'Roles not found',
        });
      }
      return res.json({
        message: 'Success',
        payload: { role },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/role/read_all_in_division',
  [...validateId('division_id'), validate],
  async (req, res) => {
    const { division_id } = req.body;
    try {
      const division = await Division.findByPk(division_id);
      if (!division) {
        return res.status(404).json({
          message: 'Division not found',
        });
      }
      const roles = await Role.findAll({
        where: { division_id },
      });
      if (roles && roles.length < 1) {
        return res.status(404).json({
          message: 'Roles not found',
        });
      }
      return res.json({
        message: 'Success',
        payload: { roles },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get('/api/role/read_all', async (req, res) => {
  try {
    const roles = await Role.findAll();
    if (roles && roles.length < 1) {
      return res.status(404).json({
        message: 'Roles not found',
      });
    }
    return res.json({
      message: 'Success',
      payload: { roles },
    });
  } catch (error) {
    handleErrors(error, res);
  }
});

router.put(
  '/api/role/update',
  [
    ...validateId('role_id'),
    ...validateParameter('role_title'),
    ...validateUniqueness('role_title', Role),
    ...validateOptionalId('division_id'),
    ...validateOptionalId('reports_to'),
    validate,
    auth,
    authAdmin,
  ],
  async (req, res) => {
    const { role_id, role_title, division_id, reports_to } = req.body;
    try {
      const role = await Role.findByPk(role_id);
      if (!role) {
        return res.status(404).json({
          message: 'Role not found',
        });
      }

      const division = await Division.findByPk(division_id);
      if (!division) {
        return res.status(404).json({
          message: 'Division not found',
        });
      }

      const reports_to_role = await Role.findByPk(reports_to);
      if (!reports_to_role) {
        return res.status(404).json({ message: 'Reports to role not found' });
      }

      role.title = role_title;
      role.division_id = division ? division.id : role.division_id;
      role.reports_to = reports_to_role ? reports_to_role.id : role.reports_to;
      await role.save();
      return res.json({
        message: 'Success',
        payload: { role },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.delete(
  '/api/role/delete',
  [...validateId('role_id'), validate, auth, authAdmin],
  async (req, res) => {
    const { role_id } = req.body;
    try {
      const numDeleted = await Role.destroy({
        where: { id: role_id },
      });
      if (numDeleted === 0) {
        return res.status(404).json({
          message: 'Role not found',
        });
      }
      return res.json({
        message: 'Success',
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

module.exports = router;
