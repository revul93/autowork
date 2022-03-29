const express = require('express');
const router = express.Router();

const departmentRouter = require('./department');
const roleRouter = require('./role');
const employeeRouter = require('./employee');
const workflowRouter = require('./workflow');

router.use(departmentRouter);
router.use(roleRouter);
router.use(employeeRouter);
router.use(workflowRouter);

module.exports = router;
