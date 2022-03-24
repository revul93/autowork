const InitializeStructure = async () => {
  const { Role, Employee, User } = require('../../models');
  const InitializeAccountingDivision = require('./div.Accounting');
  const InitializeCustomerServicesDivision = require('./div.CustomerServices');
  const InitializeFacilityDivision = require('./div.Facility');
  const InitializeFleetDivision = require('./div.Fleet');
  const InitializeHRDivision = require('./div.HR');
  const InitializeITDivision = require('./div.IT');
  const InitializeMarketingDivision = require('./div.Marketing');
  const initializeOperationDivision = require('./div.Operation');
  const InitializeProcurementDivision = require('./div.Procurement');
  const InitializeGroups = require('./Groups');

  try {
    const GeneralManagerRole = await Role.create({ title: 'General Manager' });
    const GeneralManagerEmployee = await Employee.create({
      name: 'Omar Jajah',
      staff_id: 101111,
      email: 'omar.jajah@example.com',
      role_id: GeneralManagerRole.id,
    });
    await User.create({
      username: 'omar.jajah',
      password: 'o1m9a9r3',
      employee_id: GeneralManagerEmployee.id,
    });
    await Role.create({ title: 'DIRECT MANAGER' });
    await InitializeAccountingDivision();
    await InitializeCustomerServicesDivision();
    await InitializeFacilityDivision();
    await InitializeFleetDivision();
    await InitializeHRDivision();
    await InitializeITDivision();
    await InitializeMarketingDivision();
    await initializeOperationDivision();
    await InitializeProcurementDivision();

    await InitializeGroups();

    console.log('Corporate structure loaded successfully');
  } catch (error) {
    console.error(error);
  }
};

module.exports = InitializeStructure;
