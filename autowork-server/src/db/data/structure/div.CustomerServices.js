const InitializeCustomerServicesDivision = async () => {
  const { Division, Role, Employee, User } = require('../../models');
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // division
  const CustomerServices = await Division.create({
    name: 'Customer Services Division',
  });

  // roles
  // --> Manager
  const CustomerServicesManager = await Role.create({
    title: 'Customer Services Manager',
    division_id: CustomerServices.id,
    reports_to: GM.id,
  });
  // --> Officers
  const CustomerServicesOfficer = await Role.create({
    title: 'Customer Services Officer',
    division_id: CustomerServices.id,
    reports_to: CustomerServicesManager.id,
  });

  // Employees
  const UbabRizk = await Employee.create({
    name: 'Ubab Rizk',
    staff_id: 102128,
    email: 'ubab.rizk@example.com',
    role_id: CustomerServicesManager.id,
  });
  const ZukhrufKarim = await Employee.create({
    name: 'Zukhruf Karim',
    staff_id: 102129,
    email: 'zukhruf.karim@example.com',
    role_id: CustomerServicesOfficer.id,
  });
  const RawhiyahSadiq = await Employee.create({
    name: 'Rawhiyah Sadiq',
    staff_id: 102215,
    email: 'rawhiyah.sadiq@example.com',
    role_id: CustomerServicesOfficer.id,
  });
  const ReyhanAssaf = await Employee.create({
    name: 'Reyhan Assaf',
    staff_id: 102216,
    email: 'reyhan.assaf@example.com',
    role_id: CustomerServicesOfficer.id,
  });

  await User.bulkCreate([
    {
      username: 'ubab.rizk',
      password: 'BvDt0bnNMQo',
      employee_id: UbabRizk.id,
    },
    {
      username: 'zukhruf.karim',
      password: 'DlHSHm4WEiY',
      employee_id: ZukhrufKarim.id,
    },
    {
      username: 'rawhiyah.sadiq',
      password: 'VmWyB1PKkeY',
      employee_id: RawhiyahSadiq.id,
    },
    {
      username: 'reyhan.assaf',
      password: 'EftCJgOtYmg',
      employee_id: ReyhanAssaf.id,
    },
  ]);
};

module.exports = InitializeCustomerServicesDivision;
