const jwt = require('jsonwebtoken');
const nconf = require('nconf');
const JWT_KEY = process.env.JWT_KEY;

// DESCRIPTION: Check if jwt is existed in x-auth-token header and valid
//  if yes: decode jwt and store decoded payload in request
//  if no: return status 401
const auth = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({
      message: 'Failed to authenticate',
    });
  }

  try {
    const decoded_jwt = jwt.verify(token, JWT_KEY);
    req.user = decoded_jwt;
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: 'Failed to authenticate',
    });
  }
  next();
};

const authAdmin = async (req, res, next) => {
  if (
    req.user.user_id !== (await nconf.get('ADMIN_UUID')) ||
    !(await nconf.get('ADMIN_LOGGED_IN'))
  ) {
    return res.status(401).json({
      message: 'Not authorized',
    });
  }

  next();
};

module.exports = { auth, authAdmin };
