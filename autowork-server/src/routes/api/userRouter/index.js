const express = require('express');
const router = express.Router();

router.use(require('./userWorkflow'));
router.use(require('./documentRouter'));

module.exports = router;
