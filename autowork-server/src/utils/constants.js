const CONSTANTS = {
  DATAFIELDTYPES: {
    TEXTAREA: 'textarea',
    TEXT: 'text',
    NUMBER: 'number',
    DATE: 'date',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    DROPDOWN: 'dropdown',
  },
  STATUS: {
    // Document started by creator user
    STARTED: 'STARTED',
    // Document pending for approvals
    PENDING: 'PENDING',
    // Document approved
    APPROVED: 'APPROVED',
    // Document rejected
    REJECTED: 'REJECTED',
    // Document in processing phase
    PROCESSING: 'PROCESSING',
    // Document terminated due to incomplete/invalid entries
    TERMINATED: 'TERMINATED',
    // Document completed and finished
    COMPLETED: 'COMPLETED',
  },
  MISC: {
    DIRECT_MANAGER: 'DIRECT MANAGER',
    SHORT_TEXT_MAXLENGTH: 255,
    LONG_TEXT_MAXLENGTH: 3000,
  },
};

const GetConstants = () => CONSTANTS;

module.exports = {
  GetConstants,
};
