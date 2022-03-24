const InitializeProcuremnetsDivision = async () => {
  const { Division, Role, Employee, User } = require('../../models');
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // division
  const Procuremnets = await Division.create({
    name: 'Procuremnets Division',
  });

  // roles
  // --> Manager
  const ProcuremnetsManager = await Role.create({
    title: 'Procuremnets Manager',
    division_id: Procuremnets.id,
    reports_to: GM.id,
  });
  // --> Officers
  const AutomobilesProcurementsOfficer = await Role.create({
    title: 'Automobiles Procurements Officer',
    division_id: Procuremnets.id,
    reports_to: ProcuremnetsManager.id,
  });
  const GeneralProcurementsOfficer = await Role.create({
    title: 'General Procurements Officer',
    division_id: Procuremnets.id,
    reports_to: ProcuremnetsManager.id,
  });

  // Employees
  const AfraAmir = await Employee.create({
    name: 'Afra Amir',
    staff_id: 102124,
    email: 'afra.amir@example.com',
    role_id: ProcuremnetsManager.id,
  });
  const AminatShafi = await Employee.create({
    name: 'Aminat Shafi',
    staff_id: 102126,
    email: 'aminat.shafi@example.com',
    role_id: AutomobilesProcurementsOfficer.id,
  });
  const IslamAbdella = await Employee.create({
    name: 'Islam Abdella',
    staff_id: 102127,
    email: 'islam.abdella@example.com',
    role_id: GeneralProcurementsOfficer.id,
  });

  await User.bulkCreate([
    {
      username: 'afra.amir',
      password: 'x4bmX8ByIcg',
      employee_id: AfraAmir.id,
    },
    {
      username: 'aminat.shafi',
      password: 'Xosjz_3J_60',
      employee_id: AminatShafi.id,
    },
    {
      username: 'islam.abdella',
      password: 'c3YKr6aYJWg',
      employee_id: IslamAbdella.id,
    },
  ]);
};

module.exports = InitializeProcuremnetsDivision;
