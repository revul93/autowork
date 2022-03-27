const express = require('express');
const router = express.Router();
const {
  validate,
  validateId,
  validateParameter,
  validateUniqueness,
} = require('../../middleware/validation.middleware');
const { handleErrors } = require('../../utils');
const { Department } = require('../../db');

router.post(
  '/api/department/create',
  [
    ...validateParameter('department_name'),
    ...validateUniqueness('department_name', Department),
    validate,
  ],
  async (req, res) => {
    const { department_name } = req.body;
    try {
      const department = await Department.create({
        name: department_name,
      });
      return res.json({
        message: 'Success',
        data: { department },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/department/read_one_by_id',
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
      return res.json({
        message: 'Success',
        data: { department },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/department/read_one_by_name',
  [...validateParameter('department_name'), validate],
  async (req, res) => {
    const { department_name } = req.body;
    try {
      const department = await Department.findOne({
        where: { name: department_name },
      });
      if (!department) {
        return res.status(404).json({
          message: 'Department not found',
        });
      }
      return res.json({
        message: 'Success',
        data: { department },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get('/api/department/read_all', async (req, res) => {
  try {
    const departments = await Department.findAll();
    if (departments && departments.length < 1) {
      return res.status(404).json({
        message: 'Department not found',
      });
    }
    return res.json({
      message: 'Success',
      data: { departments },
    });
  } catch (error) {
    handleErrors(error, res);
  }
});

router.put(
  '/api/department/update',
  [
    ...validateId('department_id'),
    ...validateParameter('department_name'),
    ...validateUniqueness('department_name', Department),
    validate,
  ],
  async (req, res) => {
    const { department_id, department_name } = req.body;
    try {
      const department = await Department.findByPk(department_id);
      if (!department) {
        return res.status(404).json({
          message: 'Department not found',
        });
      }

      department.name = department_name;
      await department.save();
      return res.json({
        message: 'Success',
        data: { department },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.delete(
  '/api/department/delete',
  [...validateId('department_id'), validate],
  async (req, res) => {
    const { department_id } = req.body;

    try {
      const numDeleted = await Department.destroy({
        where: { id: department_id },
      });
      if (numDeleted === 0) {
        return res.status(404).json({
          message: 'Department not found',
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
