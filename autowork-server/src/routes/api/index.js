const express = require('express');
const router = express.Router();

router.use(require('./authRouter'));
router.use(require('./userRouter'));
router.use(require('./adminRouter'));

module.exports = router;
