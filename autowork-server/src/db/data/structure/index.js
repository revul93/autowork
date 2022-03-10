const { Role } = require('../../models');
const initializeGroups = require('./Groups');
const initializeHRDepartment = require('./dep.HR.js');
const initializeITDepartment = require('./dep.IT.js');
const initializeFinancialAccountingDepartment = require('./dep.finance');

const initializeStructure = async () => {
  try {
    await Role.create({ title: 'General Manager' });
    await Role.create({ title: 'DIRECT SUPERVISOR' });
    await Role.create({ title: 'DIRECT MANAGER' });
    await initializeITDepartment();
    await initializeHRDepartment();
    await initializeFinancialAccountingDepartment();
    await initializeGroups();

    console.log('Corporate structure loaded successfully');
  } catch (error) {
    console.error(error);
  }
};

module.exports = initializeStructure;
