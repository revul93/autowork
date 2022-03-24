const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const nconf = require('nconf');
const { auth, authAdmin } = require('../../middleware/auth.middleware');
const {
  validate,
  validateParameter,
  validateId,
  validateEmail,
} = require('../../middleware/validation.middleware');
const {
  HandleErrors,
  SetAuthCode,
  IsAuthCodeExpired,
  GetToken,
} = require('../../utils');
const { User } = require('../../db/models');

// METHOD: POST
// URI: /api/auth/login
// ACCESS: Everyone
// PARAMETERS:
//   REQUIRED: username <string>, password <string>
// DESCRIPTION: Authenticate a user against username and password
// RETURN: user_id, to use with next request (check_auth_code)
router.post(
  '/api/auth/login',
  [
    ...validateParameter('username'),
    ...validateParameter('password'),
    validate,
  ],
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({
        where: { username },
      });
      // check if user exists and password provided is correct
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(401)
          .json({ message: 'Incorrect username or password' });
      }

      // generate and save auth code
      await SetAuthCode(user);

      return res.json({
        message: 'Success',
        payload: { user_id: user.id },
      });
    } catch (error) {
      HandleErrors(error, res);
    }
  },
);

// METHOD: POST
// URI: /api/auth/verify_login
// ACCESS: Everyone
// PARAMETERS:
//   REQUIRED: user_id <string, UUID>, auth_code <string>
// DESCRIPTION: verify user login through checking auth code
//  auth code should be sent to user's email and stored in database
// RETURN: Signed JWT token
router.post(
  '/api/auth/verify_login',
  [...validateId('user_id'), ...validateParameter('auth_code'), validate],
  async (req, res) => {
    const { user_id, auth_code } = req.body;
    try {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      if (IsAuthCodeExpired(user)) {
        return res.status(401).json({
          message: 'Auth code timed out. Login again',
        });
      }

      if (user.auth_code !== auth_code) {
        return res.status(401).json({
          message: 'Incorrect auth code',
        });
      }

      user.is_logged_in = true;
      await user.save();
      return res.json({
        message: 'Success',
        payload: { token: await GetToken(user) },
      });
    } catch (error) {
      HandleErrors(error, res);
    }
  },
);

// METHOD: POST
// URI: /api/auth/send_auth_code
// ACCESS: EVERYONE
// PARAMETERS:
//  REQUIRED: email <string, email>
// DESCRIPTION: Generate and save auth code in database, then send it to user's email
router.post(
  '/api/auth/send_auth_code',
  [...validateEmail('email'), validate],
  async (req, res) => {
    try {
      const user = await User.findOne({ where: { email: req.email } });
      if (!user) {
        return res.status(404).json({
          message: 'No user linked with provided email',
        });
      }

      await SetAuthCode(user);
      return res.json({
        message: 'Success',
      });
    } catch (error) {
      HandleErrors(error);
    }
  },
);

// METHOD: POST
// URI: /api/auth/logout
// ACCESS: Logged in users
// DESCRIPTION: Logout a user by setting user.logged_in to false
router.post('/api/auth/logout', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (!user.is_logged_in) {
      return res.status(400).json({
        message: 'User not logged in',
      });
    }

    user.is_logged_in = false;
    await user.save();
    return res.json({
      message: 'Success',
    });
  } catch (error) {
    HandleErrors(error, res);
  }
});

// METHOD: POST
// URI: /api/auth/admin_login
// ACCESS: Everyone
// PARAMETERS:
//   REQUIRED: username <string>, password <string>
// DESCRIPTION: Authenticate an admin against username and password
// RETURN: token
router.post(
  '/api/auth/admin_login',
  [
    ...validateParameter('username'),
    ...validateParameter('password'),
    validate,
  ],
  async (req, res) => {
    try {
      const { username, password } = req.body;

      if (
        username !== (await nconf.get('ADMIN_USERNAME')) ||
        password !== (await nconf.get('ADMIN_PASSWORD'))
      ) {
        return res.status(401).json({
          message: 'Username or password incorrect',
        });
      }

      nconf.set('ADMIN_IS_LOGGED_IN', true);
      await nconf.save();
      return res.json({
        message: 'Success',
        payload: {
          token: await GetToken({ id: await nconf.get('ADMIN_UUID') }),
        },
      });
    } catch (error) {
      HandleErrors(error, res);
    }
  },
);

// METHOD: POST
// URI: /api/auth/admin_logout
// ACCESS: Logged in admin
// DESCRIPTION: Logout an admin
router.post('/api/auth/admin_logout', [auth, authAdmin], async (req, res) => {
  try {
    if (!(await nconf.get('ADMIN_IS_LOGGED_IN'))) {
      return res.status(400).json({
        message: 'Admin not logged in',
      });
    }

    nconf.set('ADMIN_IS_LOGGED_IN', false);
    await nconf.save();
    return res.json({
      message: 'Success',
    });
  } catch (error) {
    HandleErrors(error, res);
  }
});

module.exports = router;
