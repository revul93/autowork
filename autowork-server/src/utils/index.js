const { handleErrors, isOptionsArray } = require('./misc.utils');
const { sendAuthCode, sendUserLoginInfo } = require('./sendEmail');
const { setAuthCode, isAuthCodeExpired } = require('./authCode.utils');
const { getToken } = require('./token.utils');
const { geAtttributeValueOfModel } = require('./db.utils');
const {
  get_data_field_types,
  get_approval_levels,
  get_document_statuses,
} = require('./static');

module.exports = {
  handleErrors,
  isOptionsArray,
  sendAuthCode,
  sendUserLoginInfo,
  setAuthCode,
  isAuthCodeExpired,
  getToken,
  geAtttributeValueOfModel,
  get_data_field_types,
  get_approval_levels,
  get_document_statuses,
};
