const getToken = (user) => {
  const JWT_KEY =
    process.env.JWT_KEY || require('crypto').randomBytes(64).toString('Hex');
  const TOKEN_TTL = parseInt(process.env.TOKEN_TTL) || 172800;
  const jwt = require('jsonwebtoken');
  return jwt.sign({ user_id: user.id }, JWT_KEY, {
    expiresIn: TOKEN_TTL,
  });
};

module.exports = { getToken };
