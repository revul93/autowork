const express = require('express');
const router = express.Router();

router.use(require('./userWorkflow'));
router.use(require('./userDocument'));

module.exports = router;
