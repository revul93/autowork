// Convert Approval Sequence Declaration from Workflow
// To Approval Sequence Implementation to be saved in Document
// Accept: an array of role_ids
// Returns: an array of object {role_id, status}
const ExtendApprovalSequence = async (approval_sequence, employee_role_id) => {
  const { GetConstants } = require('./constants');
  const CONSTANTS = GetConstants();
  if (!Array.isArray(approval_sequence)) {
    throw new Error('Approval sequence is not array');
  }
  if (approval_sequence.length === 0) {
    return [];
  }
  const { Role } = require('../db/models');
  const employee_role = await Role.findByPk(employee_role_id);
  if (!employee_role) {
    throw new Error('Employee role not found');
  }

  const result = [];
  for (let i = 0; i < approval_sequence.length; i++) {
    const approval_role = await Role.findByPk(approval_sequence[i]);
    if (!approval_role) {
      throw new Error(`Approval role note found ${approval_sequence[i]}`);
    }
    if (
      approval_role.title === CONSTANTS.MISC.DIRECT_MANAGER &&
      employee_role.reports_to
    ) {
      result.push({
        role_id: employee_role.reports_to,
        author: null,
        status: CONSTANTS.STATUS.PENDING,
        note: '',
        date: null,
      });
    } else if (approval_role.title !== employee_role.title) {
      result.push({
        role_id: approval_role.id,
        author: null,
        status: CONSTANTS.STATUS.PENDING,
        note: '',
        date: null,
      });
    }
  }
  return result;
};

const HandleErrors = (error, res) => {
  console.error(error);
  return res.status(500).json({
    message: 'Server error',
  });
};

module.exports = {
  ExtendApprovalSequence,
  HandleErrors,
};
