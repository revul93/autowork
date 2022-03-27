const express = require('express');
const router = express.Router();
const {
  validate,
  validateId,
  validateParameter,
  validateUniqueness,
  validateOptionalId,
} = require('../../middleware/validation.middleware');
const { handleErrors } = require('../../utils');
const { Role, Section, Department } = require('../../db');

router.post(
  '/api/role/create',
  [
    ...validateParameter('role_title'),
    ...validateUniqueness('role_title', Role),
    ...validateOptionalId('department_id'),
    ...validateOptionalId('section_id'),
    ...validateOptionalId('reports_to'),
    validate,
  ],
  async (req, res) => {
    const { role_title, department_id, section_id, reports_to } = req.body;
    try {
      let section;
      if (section_id) {
        section = await Section.findByPk(section_id);
        if (!section) {
          return res.status(404).json({
            message: 'Section not found',
          });
        }
      }

      let department;
      if (department_id) {
        department = await Department.findByPk(department_id);
        if (!department) {
          return res.status(404).json({
            message: 'Department not found',
          });
        }
      }

      if (department && section && department.id !== section.department_id) {
        return res.status(400).json({
          message: `Section ${section.name} doesn't belong to department ${department.name}`,
        });
      }

      let reports_to_role;
      if (reports_to) {
        reports_to_role = await Role.findByPk(reports_to);
        if (!reports_to_role) {
          return res.status(404).json({ message: 'Reports to role not found' });
        }
      }

      const role = await Role.create({
        title: role_title,
        section_id: section ? section.id : null,
        department_id: department ? department.id : null,
        reports_to: reports_to_role ? reports_to_role.id : null,
      });

      await role.save();
      return res.json({
        message: 'Success',
        data: { role },
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
        data: { role },
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
        data: { role },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/role/read_all_in_section',
  [...validateId('section_id'), validate],
  async (req, res) => {
    const { section_id } = req.body;
    try {
      const section = await Section.findByPk(section_id);
      if (!section) {
        return res.status(404).json({
          message: 'Section not found',
        });
      }
      const roles = await Role.findAll({
        where: { section_id },
      });
      if (roles && roles.length < 1) {
        return res.status(404).json({
          message: 'Roles not found',
        });
      }
      return res.json({
        message: 'Success',
        data: { roles },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/role/read_all_in_department',
  [...validateId('department_id'), validate],
  async (req, res) => {
    const { department_id } = req.body;
    try {
      const department = await Department.findByPk(department_id);
      if (!department) {
        return res.status(404).json({
          message: 'Department not found',
        });
      }
      const roles = await Role.findAll({
        where: { department_id },
      });
      if (roles && roles.length < 1) {
        return res.status(404).json({
          message: 'Roles not found',
        });
      }
      return res.json({
        message: 'Success',
        data: { roles },
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
      data: { roles },
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
    ...validateOptionalId('department_id'),
    ...validateOptionalId('section_id'),
    ...validateOptionalId('reports_to'),
    validate,
  ],
  async (req, res) => {
    const { role_id, role_title, department_id, section_id, reports_to } =
      req.body;
    try {
      const role = await Role.findByPk(role_id);
      if (!role) {
        return res.status(404).json({
          message: 'Role not found',
        });
      }

      let department;
      if (department_id) {
        department = await Department.findByPk(department_id);
        if (!department) {
          return res.status(404).json({
            message: 'Department not found',
          });
        }
      }

      let section;
      if (section_id) {
        section = await Section.findByPk(section_id);
        if (!section) {
          return res.status(404).json({
            message: 'Section not found',
          });
        }
      }

      let reports_to_role;
      if (reports_to) {
        reports_to_role = await Role.findByPk(reports_to);
        if (!reports_to_role) {
          return res.status(404).json({ message: 'Reports to role not found' });
        }
      }

      if (department && section && department.id !== section.department_id) {
        return res.status(400).json({
          message: `Section ${section.name} doesn't belong to department ${department.name}`,
        });
      }

      role.title = role_title;
      role.department_id = department ? department.id : role.department_id;
      role.section_id = section ? section.id : role.section_id;
      role.reports_to = reports_to_role ? reports_to_role.id : role.reports_to;
      await role.save();
      return res.json({
        message: 'Success',
        data: { role },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.delete(
  '/api/role/delete',
  [...validateId('role_id'), validate],
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
