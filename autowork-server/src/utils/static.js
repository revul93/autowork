const get_data_field_types = () => ({
  TEXTBLOCK: 'TEXTBLOCK',
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  DATE: 'DATE',
  FILE: 'FILE',
  CHECKBOX: 'CHECKBOX',
  OPTION: 'OPTION',
  DROPDOWN: 'DROPDOWN',
});

const get_approval_levels = () => ({
  NO_APPROVAL_REQUIRED: 'NO_APPROVAL_REQUIRED',
  DIRECT_MANAGER: 'DIRECT_MANAGER',
  DEPARTMENT_MANAGER: 'DEPARTMENT_MANAGER',
  GENERAL_MANAGER: 'GENERAL_MANAGER',
  FINANCE_MANAGER: 'FINANCE_MANAGER',
  HR_MANAGER: 'HR_MANAGER',
  IT_MANAGER: 'IT_MANAGER',
});

const get_document_statuses = () => ({
  STARTED: 'STARTED',
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  REJECTED: 'REJECTED',
  TERMINATED: 'TERMINATED',
  DONE: 'DONE',
});

module.exports = {
  get_approval_levels,
  get_data_field_types,
  get_document_statuses,
};
