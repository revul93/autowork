const exoress = require('express');
const { auth, authAdmin } = require('../middleware/auth.middleware');
const router = exoress.Router();
const apiRouter = require('./api');

if (process.env.NODE_ENV === 'development') {
  router.get('/ping', (req, res) => {
    res.json('PONG');
  });

  router.get('/ping_user', auth, (req, res) => {
    res.json('PONG');
  });

  router.get('/ping_admin', [auth, authAdmin], (req, res) => {
    res.json('PONG');
  });
}

router.use(apiRouter);

module.exports = router;
