const { body } = require('express-validator');
const { validationResult } = require('express-validator');

// DESCRIPTION: Look up for errors in request, flush them if any
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: 'Request failed', errors: errors.array() });
  }

  return next();
};

const validateId = (id) => [body(id, 'Parameter is not UUID').isUUID()];

const validateOptionalId = (id) => [
  body(id, `Parameter is not UUID`).optional().isUUID(),
];

const validateParameter = (parameter) => [
  body(parameter, 'Parameter not found').notEmpty(),
  body(parameter, 'Maximum length exceeded').isLength({
    max: 255,
  }),
];

// DESCRIPTION: Search for query in given MODEL
//  if found then throw an error
// USEAGE: used to verify that a query is uniqe among MODEL
// PARAMETERS: query <string> (e.g. user id, user email...etc), Model <Sequelize.Model> (e.g. User...etc)
const validateUniqueness = (query, Model) => [
  body(query, 'Parameter must be unique').custom(async (value) => {
    if (
      await Model.findOne({
        where: { [query.split('_')[1]]: value },
      })
    ) {
      throw new Error();
    }
  }),
];

// DESCRIPTION: Check if any object exist in model with certain query
// PARAMETERS: query <string> (e.g. user id, user email...etc), Model <Sequelize.Model> (e.g. User...etc)
const validateExistance = (query, Model) => [
  body(id, `${{ Model }} not found`).custom(async (value) => {
    if (!(await Model.findOne({ where: { [query]: value } }))) {
      throw new Error();
    }
  }),
];

const validateStaffId = (id) => [
  body(id, 'Staff id must be 6 integers, starting with 1').custom((value) =>
    RegExp(/1[0-9]{5}/).test(value) ? Promise.resolve() : Promise.reject(),
  ),
];

const validateEmail = (email) => [body(email, 'Not a valid email').isEmail()];

module.exports = {
  validate,
  validateId,
  validateParameter,
  validateUniqueness,
  validateOptionalId,
  validateStaffId,
  validateEmail,
  validateExistance,
};
