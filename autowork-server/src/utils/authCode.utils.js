// return epoch time in seconds
const GetEpochInSeconds = () => {
  return Math.floor(new Date().getTime() / 1000.0);
};

const GenerateAuthCode = () => {
  const AUTH_CODE_LENGTH = parseInt(process.env.AUTH_CODE_LENGTH) || 6;
  if (process.env.NODE_ENV === 'development') {
    return 'ABC123';
  }
  return Math.round(
    Math.pow(36, AUTH_CODE_LENGTH + 1) -
      Math.random() * Math.pow(36, AUTH_CODE_LENGTH),
  )
    .toString(36)
    .slice(1)
    .toUpperCase();
};

// DESCRIPTION: Generate and save auth code in database, then send it to user's email
const SetAuthCode = async (user) => {
  const { SendAuthCode } = require('./email.utils');

  // generate and save auth code
  user.auth_code = GenerateAuthCode();
  user.auth_code_creation_time = GetEpochInSeconds();
  await user.save();

  // send auth code to user's email
  await SendAuthCode(user);
};

const IsAuthCodeExpired = (user) => {
  const AUTH_CODE_TTL = parseInt(process.env.AUTH_CODE_TTL) || 900;
  return GetEpochInSeconds() - user.auth_code_creation_time > AUTH_CODE_TTL;
};

module.exports = {
  SetAuthCode,
  IsAuthCodeExpired,
};
