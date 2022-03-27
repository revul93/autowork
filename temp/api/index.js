const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const departmentRouter = require('./department');
const sectionRouter = require('./section');
const roleRouter = require('./role');
const employeeRouter = require('./employee');
const workflowRouter = require('./workflow');

router.use(authRouter);
router.use(departmentRouter);
router.use(sectionRouter);
router.use(roleRouter);
router.use(employeeRouter);
router.use(workflowRouter);

module.exports = router;
