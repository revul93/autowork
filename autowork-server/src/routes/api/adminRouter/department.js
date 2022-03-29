const express = require('express');
const router = express.Router();
const { auth, authAdmin } = require('../../../middleware/auth.middleware');
const {
  validate,
  validateId,
  validateParameter,
  validateUniqueness,
} = require('../../../middleware/validation.middleware');
const { handleErrors } = require('../../../utils');
const { Division } = require('../../../db/models');

router.post(
  '/api/division/create',
  [
    ...validateParameter('division_name'),
    ...validateUniqueness('division_name', Division),
    validate,
    auth,
    authAdmin,
  ],
  async (req, res) => {
    const { division_name } = req.body;
    try {
      const division = await Division.create({
        name: division_name,
      });
      return res.json({
        message: 'Success',
        payload: { division },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/division/read_one_by_id',
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
      return res.json({
        message: 'Success',
        payload: { division },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get(
  '/api/division/read_one_by_name',
  [...validateParameter('division_name'), validate],
  async (req, res) => {
    const { division_name } = req.body;
    try {
      const division = await Division.findOne({
        where: { name: division_name },
      });
      if (!division) {
        return res.status(404).json({
          message: 'Division not found',
        });
      }
      return res.json({
        message: 'Success',
        payload: { division },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.get('/api/division/read_all', async (req, res) => {
  try {
    const divisions = await Division.findAll();
    if (divisions && divisions.length < 1) {
      return res.status(404).json({
        message: 'Division not found',
      });
    }
    return res.json({
      message: 'Success',
      payload: { divisions },
    });
  } catch (error) {
    handleErrors(error, res);
  }
});

router.put(
  '/api/division/update',
  [
    ...validateId('division_id'),
    ...validateParameter('division_name'),
    ...validateUniqueness('division_name', Division),
    validate,
    auth,
    authAdmin,
  ],
  async (req, res) => {
    const { division_id, division_name } = req.body;
    try {
      const division = await Division.findByPk(division_id);
      if (!division) {
        return res.status(404).json({
          message: 'Division not found',
        });
      }

      division.name = division_name;
      await division.save();
      return res.json({
        message: 'Success',
        payload: { division },
      });
    } catch (error) {
      handleErrors(error, res);
    }
  },
);

router.delete(
  '/api/division/delete',
  [...validateId('division_id'), validate, auth, authAdmin],
  async (req, res) => {
    const { division_id } = req.body;

    try {
      const numDeleted = await Division.destroy({
        where: { id: division_id },
      });
      if (numDeleted === 0) {
        return res.status(404).json({
          message: 'Division not found',
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
