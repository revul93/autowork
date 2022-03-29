const { check } = require('express-validator');
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

const validateId = (id) => [
  check(id, 'Parameter is not UUID').isUUID() || query(),
];

const validateOptionalId = (id) => [
  check(id, `Parameter is not UUID`).optional().isUUID(),
];

const validateParameter = (parameter) => [
  check(parameter, 'Parameter not found').notEmpty(),
  check(parameter, 'Maximum length exceeded').isLength({
    max: 255,
  }),
];

const validatePassword = (password) => [
  check(password, 'Password must be at least 8 character').isLength({
    min: 8,
    max: 255,
  }),
];

// DESCRIPTION: Search for query in given MODEL
//  if found then throw an error
// USEAGE: used to verify that a query is uniqe among MODEL
// PARAMETERS: query <string> (e.g. user id, user email...etc), Model <Sequelize.Model> (e.g. User...etc)
const validateUniqueness = (query, Model) => [
  check(query, 'Parameter must be unique').custom(async (value) => {
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
  check(id, `${{ Model }} not found`).custom(async (value) => {
    if (!(await Model.findOne({ where: { [query]: value } }))) {
      throw new Error();
    }
  }),
];

const validateStaffId = (id) => [
  check(id, 'Staff id must be 6 integers, starting with 1').custom((value) =>
    RegExp(/1[0-9]{5}/).test(value) ? Promise.resolve() : Promise.reject(),
  ),
];

const validateEmail = (email) => [check(email, 'Not a valid email').isEmail()];

const validateValuesArray = (array) => [
  check(array, 'data_values array not exist or not well formatted').custom(
    (array) =>
      !Array.isArray(array) ||
      !array.every(
        (elem) =>
          typeof elem.value === 'string' || typeof elem.value === 'boolean',
      )
        ? Promise.reject()
        : Promise.resolve(),
  ),
];

const validateBoolean = (value) => [
  check(value, `${value} must be true or false`).isBoolean(),
];

module.exports = {
  validate,
  validateId,
  validateParameter,
  validatePassword,
  validateUniqueness,
  validateOptionalId,
  validateStaffId,
  validateEmail,
  validateExistance,
  validateValuesArray,
  validateBoolean,
};
