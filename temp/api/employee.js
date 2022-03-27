const express = require('express');
const router = express.Router();
const {
  validate,
  validateId,
  validateParameter,
  validateUniqueness,
  validateEmployeeCode,
  validateEmail,
} = require('../../middleware/validation.middleware');
const { handleErrors } = require('../../utils');
const { Employee, Role } = require('../../db');

router.post(
  '/api/employee/create',
  [
    ...validateEmployeeCode('employee_code'),
    ...validateUniqueness('employee_code', Employee),
    ...validateParameter('employee_name'),
    ...validateEmail('employee_email'),
    ...validateUniqueness('employee_email', Employee),
    ...validateId('role_id'),
    validate,
  ],
  async (req, res) => {
    const { employee_code, employee_name, employee_email, role_id } = req.body;
    try {
      const role = await Role.findByPk(role_id);
      if (!role) {
        return res.status(404).json({
          message: 'Role not found',
        });
      }

      const employee = await Employee.create({
        code: employee_code,
        name: employee_name,
        email: employee_email,
        role_id,
      });
      await employee.save();
      return res.json({
        message: 'Success',
        data: { employee },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/employee/read_one_by_id',
  [...validateId('employee_id'), validate],
  async (req, res) => {
    const { employee_id } = req.body;
    try {
      const employee = await Employee.findByPk(employee_id);
      if (!employee) {
        return res.status(404).json({
          message: 'Employee not found',
        });
      }
      return res.json({
        message: 'Success',
        data: { employee },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/employee/read_one_by_code',
  [...validateEmployeeCode('employee_code'), validate],
  async (req, res) => {
    const { employee_code } = req.body;
    try {
      const employee = await Employee.findOne({
        where: { code: employee_code },
      });
      if (!employee) {
        return res.status(404).json({
          message: 'Employee not found',
        });
      }
      return res.json({
        message: 'Success',
        data: { employee },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/employee/read_all_by_role',
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
      const employees = await Employee.findAll({
        where: { role_id },
      });
      if (employees && employees.length < 1) {
        return res.status(404).json({
          message: 'Employees not found',
        });
      }
      return res.json({
        message: 'Success',
        data: { employees },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get('/api/employee/read_all', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    if (employees && employees.length < 1) {
      return res.status(404).json({
        message: 'Employees not found',
      });
    }
    return res.json({
      message: 'Success',
      data: { employees },
    });
  } catch (error) {
    handleErrors(error, res);
  }
});

router.put(
  '/api/employee/update',
  [
    ...validateId('employee_id'),
    ...validateEmployeeCode('employee_code'),
    ...validateUniqueness('employee_code', Employee),
    ...validateParameter('employee_name'),
    ...validateEmail('employee_email'),
    ...validateUniqueness('employee_email', Employee),
    ...validateId('role_id'),
    validate,
  ],
  async (req, res) => {
    const {
      employee_id,
      employee_code,
      employee_name,
      employee_email,
      role_id,
    } = req.body;
    try {
      const employee = await Employee.findByPk(employee_id);
      if (!employee) {
        return res.status(404).json({
          message: 'Employee not found',
        });
      }
      employee.code = employee_code;
      employee.name = employee_name;
      employee.email = employee_email;
      const role = await Role.findByPk(role_id);
      if (!role) {
        return res.status(404).json({
          message: 'Role not found',
        });
      }
      employee.role_id = role_id;

      await employee.save();
      return res.json({
        message: 'Success',
        data: { employee },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.delete(
  '/api/employee/delete',
  [validateId('employee_id'), validate],
  async (req, res) => {
    const { employee_id } = req.body;

    try {
      const numDeleted = await Employee.destroy({
        where: { id: employee_id },
      });
      if (numDeleted === 0) {
        return res.status(401).json({
          message: 'Employee not found',
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
