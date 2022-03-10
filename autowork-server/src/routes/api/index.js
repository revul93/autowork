const express = require('express');
const router = express.Router();

router.use(require('./auth'));
// router.use(require('./department'));
// router.use(require('./section'));
// router.use(require('./role'));
// router.use(require('./employee'));
// router.use(require('./workflow'));

module.exports = router;
