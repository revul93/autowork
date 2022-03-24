const IsOptionsArray = async (value) => {
  if (!value) return false;
  try {
    const options = await JSON.parse(value);
    const test_properties = options.every(
      (option) =>
        option.hasOwnProperty('name') && option.hasOwnProperty('value'),
    );

    const test_duplicates_keys =
      options.reduce(
        (acc, elem) => acc.add(elem['name'].toLowerCase()),
        new Set(),
      ).size === options.length;
    const test_duplicates_values =
      options.reduce(
        (acc, elem) => acc.add(elem['value'].toLowerCase()),
        new Set(),
      ).size === options.length;

    if (!(test_properties && test_duplicates_keys && test_duplicates_values)) {
      throw new Error(
        'Each option must have name and value field with no duplicates',
      );
    }
    return true;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Options must be formatted in JSON');
    } else {
      console.error(error.message);
    }
    return false;
  }
};

// Check if approval sequence is valid
//   Valid approval sequence is of type array, with no duplicate
//    formatted in JSON. Containing valid role ids
//  Example: JSON.stringify([id1, id2, id3])
const IsWorkflowApprovalSequence = async (value) => {
  const { Role } = require('../db/models');
  if (!value) return false;
  try {
    const sequence = await JSON.parse(value);
    if (!Array.isArray(sequence)) {
      throw new Error('Approval sequence must be array');
    }

    if (sequence.length !== new Set(sequence).size) {
      throw new Error('Approval sequence must not include duplicates');
    }

    if (
      !sequence.every(async (approval_role_id) => {
        const role = await Role.findByPk(approval_role_id);
        if (role) {
          return true;
        } else return false;
      })
    ) {
      throw new Error(
        'Not all ids in approval sequence relate to a valid role',
      );
    }

    return true;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Sequence must be formatted in JSON');
    } else {
      console.error(error.message);
    }
    return false;
  }
};

const IsDivisionName = (value) =>
  new RegExp(/^[a-zA-Z]+[a-zA-Z\s&]*$/).test(value);

const IsEmployeeName = (value) =>
  new RegExp(/^[a-zA-Z]+[a-zA-Z\s]*$/).test(value);

const IsStaffId = (value) => new RegExp(/1[0-9]{5}/).test(value);

const IsGroupName = (value) => new RegExp(/^[a-zA-Z\s]*$/).test(value);

const IsRoleTitle = (value) =>
  new RegExp(/^[a-zA-Z]+[a-zA-Z\s&]*$/).test(value);

const IsUsername = (value) =>
  new RegExp(/^[a-zA-Z]+[a-zA-Z0-9_]{5}[a-zA-Z0-9_]*/).test(value);

const IsPassword = (value) =>
  new RegExp(/^(?=.*[0-9])[a-zA-Z0-9]{6,32}$/).test(value);

const IsWorkflowName = (value) =>
  new RegExp(/^[a-zA-Z]+[a-zA-Z\s&]*$/).test(value);

const IsEmail = (value) => new RegExp().test(value);

const IsLongText = (value) => new RegExp().test(value);

const IsInputName = (value) =>
  new RegExp(/^[a-zA-Z_$][a-zA-Z0-9_]*$/).test(value);

const IsInputLabel = (value) => new RegExp(/^[a-zA-Z0-9_\s$/?]+$/).test(value);

module.exports = {
  validate: {
    IsOptionsArray,
    IsWorkflowApprovalSequence,
    IsDivisionName,
    IsEmployeeName,
    IsStaffId,
    IsGroupName,
    IsRoleTitle,
    IsUsername,
    IsPassword,
    IsWorkflowName,
    IsEmail,
    IsLongText,
    IsInputName,
    IsInputLabel,
  },
};
