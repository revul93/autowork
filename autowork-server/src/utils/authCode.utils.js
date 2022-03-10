const generateAuthCode = () => {
  const AUTH_CODE_LENGTH = parseInt(process.env.AUTH_CODE_LENGTH) || 6;
  return Math.round(
    Math.pow(36, AUTH_CODE_LENGTH + 1) -
      Math.random() * Math.pow(36, AUTH_CODE_LENGTH),
  )
    .toString(36)
    .slice(1)
    .toUpperCase();
};

// return epoch time in seconds
const getEpochInSeconds = () => {
  return Math.floor(new Date().getTime() / 1000.0);
};

// DESCRIPTION: Generate and save auth code in database, then send it to user's email
const setAuthCode = async (user) => {
  const { sendAuthCode } = require('./sendEmail');

  // generate and save auth code
  user.auth_code = generateAuthCode();
  user.auth_code_creation_time = getEpochInSeconds();
  await user.save();

  // send auth code to user's email
  await sendAuthCode(user);
};

const isAuthCodeExpired = (user) => {
  const AUTH_CODE_TTL = parseInt(process.env.AUTH_CODE_TTL) || 900;
  return getEpochInSeconds() - user.auth_code_creation_time > AUTH_CODE_TTL;
};

module.exports = {
  setAuthCode,
  isAuthCodeExpired,
};
