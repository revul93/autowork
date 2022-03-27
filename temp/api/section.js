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
const { Section, Department } = require('../../db');

router.post(
  '/api/section/create',
  [
    ...validateParameter('section_name'),
    ...validateId('department_id'),
    ...validateUniqueness('section_name', Section),
    validate,
  ],
  async (req, res) => {
    const { section_name, department_id } = req.body;
    try {
      const department = await Department.findByPk(department_id);
      if (!department) {
        return res.status(404).json({
          message: 'Department not found',
        });
      }

      const section = await Section.create({
        name: section_name,
        department_id: department.id,
      });
      return res.json({
        message: 'Success',
        data: { section },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/section/read_one_by_id',
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
      return res.json({
        message: 'Success',
        data: { section },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/section/read_one_by_name',
  [...validateParameter('section_name'), validate],
  async (req, res) => {
    const { section_name } = req.body;

    try {
      const section = await Section.findOne({
        where: { name: section_name },
      });
      if (!section) {
        return res.status(404).json({
          message: 'Sections not found',
        });
      }
      return res.json({
        message: 'Success',
        data: { section },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get('/api/section/read_all', async (req, res) => {
  try {
    const sections = await Section.findAll();
    if (sections && sections.length < 1) {
      return res.status(404).json({
        message: 'Sections not found',
      });
    }
    return res.json({
      message: 'Success',
      data: { sections },
    });
  } catch (error) {
    handleErrors(error, res);
  }
});

router.put(
  '/api/section/update',
  [
    ...validateId('section_id'),
    ...validateOptionalId('department_id'),
    ...validateParameter('section_name'),
    ...validateUniqueness('section_name', Section),
    validate,
  ],
  async (req, res) => {
    const { section_id, section_name, department_id } = req.body;

    try {
      const section = await Section.findByPk(section_id);
      if (!section) {
        return res.status(404).json({
          message: 'Section not found',
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

      section.name = section_name;
      if (department) {
        section.department_id = department.id;
      }
      await section.save();
      return res.json({
        message: 'Success',
        data: { section },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.delete(
  '/api/section/delete',
  [...validateId('section_id'), validate],
  async (req, res) => {
    const { section_id } = req.body;
    try {
      const numDeleted = await Section.destroy({
        where: { id: section_id },
      });
      if (numDeleted === 0) {
        return res.status(404).json({
          message: 'Section not found',
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
