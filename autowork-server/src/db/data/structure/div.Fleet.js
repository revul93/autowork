const InitializeFleetDivision = async () => {
  const { Division, Role, Employee, User } = require('../../models');
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // division
  const Fleet = await Division.create({
    name: 'Fleet Division',
  });

  // roles
  // --> Manager
  const FleetManager = await Role.create({
    title: 'Fleet Manager',
    division_id: Fleet.id,
    reports_to: GM.id,
  });
  // --> Officers
  const MaintenanceOfficer = await Role.create({
    title: 'Maintenance Officer',
    division_id: Fleet.id,
    reports_to: FleetManager.id,
  });
  const AccidentOfficer = await Role.create({
    title: 'Accident Officer',
    division_id: Fleet.id,
    reports_to: FleetManager.id,
  });
  const AutomobileTrackingOfficer = await Role.create({
    title: 'Automobile Tracking Officer',
    division_id: Fleet.id,
    reports_to: FleetManager.id,
  });
  const InsuranceOfficer = await Role.create({
    title: 'Insurance Officer',
    division_id: Fleet.id,
    reports_to: FleetManager.id,
  });

  // Employees
  const ImadNour = await Employee.create({
    name: 'Imad Nour',
    staff_id: 102118,
    email: 'imad.nour@example.com',
    role_id: FleetManager.id,
  });
  const JamalMorad = await Employee.create({
    name: 'Jamal Morad',
    staff_id: 102120,
    email: 'jamal.morad@example.com',
    role_id: MaintenanceOfficer.id,
  });
  const MaisaraRais = await Employee.create({
    name: 'Maisara Rais',
    staff_id: 102121,
    email: 'maisara.rais@example.com',
    role_id: AccidentOfficer.id,
  });
  const RabeeaAmir = await Employee.create({
    name: 'Rabeea Amir',
    staff_id: 102122,
    email: 'rabeea.amir@example.com',
    role_id: AutomobileTrackingOfficer.id,
  });
  const ImadDib = await Employee.create({
    name: 'Imad Dib',
    staff_id: 102123,
    email: 'imad.dib@example.com',
    role_id: InsuranceOfficer.id,
  });

  await User.bulkCreate([
    {
      username: 'imad.nour',
      password: 'autowork',
      employee_id: ImadNour.id,
    },
    {
      username: 'jamal.morad',
      password: 'VGIv5-5N8F8',
      employee_id: JamalMorad.id,
    },
    {
      username: 'maisara.rais',
      password: 'autowork',
      employee_id: MaisaraRais.id,
    },
    {
      username: 'rabeea.amir',
      password: 'autowork',
      employee_id: RabeeaAmir.id,
    },
    {
      username: 'imad.dib',
      password: 'autowork',
      employee_id: ImadDib.id,
    },
  ]);
};

module.exports = InitializeFleetDivision;
