const initializeHRDivision = async () => {
  const { Division, Role, Employee, User } = require('../../models');
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // division
  const HR = await Division.create({ name: 'Human Resource Division' });

  // roles
  // --> Manager
  const HRManager = await Role.create({
    title: 'HR Manager',
    division_id: HR.id,
    reports_to: GM.id,
  });
  // --> Officers
  const GovernmentalRelationsOfficer = await Role.create({
    title: 'Governmental Relations Officer',
    division_id: HR.id,
    reports_to: HRManager.id,
  });
  const EmployeesRelationsOfficer = await Role.create({
    title: 'Employees Relations Officer',
    division_id: HR.id,
    reports_to: HRManager.id,
  });
  const RecruitmentDevelopmentOfficer = await Role.create({
    title: 'Recruitment & Development Officer',
    division_id: HR.id,
    reports_to: HRManager.id,
  });

  // Employees
  const HusamZahra = await Employee.create({
    name: 'Husam Zahra',
    staff_id: 102110,
    email: 'husam.zahra@example.com',
    role_id: HRManager.id,
  });
  const TaherAhmad = await Employee.create({
    name: 'Taher Ahmad',
    staff_id: 102111,
    email: 'taher.ahmad@example.com',
    role_id: GovernmentalRelationsOfficer.id,
  });
  const ArfaYassin = await Employee.create({
    name: 'Arfa Yassin',
    staff_id: 102112,
    email: 'arfa.yassin@example.com',
    role_id: EmployeesRelationsOfficer.id,
  });
  const GhasnaAzer = await Employee.create({
    name: 'Ghasna Azer',
    staff_id: 102113,
    email: 'ghasna.azer@example.com',
    role_id: RecruitmentDevelopmentOfficer.id,
  });

  await User.bulkCreate([
    {
      username: 'husam.zahra',
      password: 'autowork',
      employee_id: HusamZahra.id,
    },
    {
      username: 'taher.ahmad',
      password: 'tTDk77kn1_g',
      employee_id: TaherAhmad.id,
    },
    {
      username: 'arfa.yassin',
      password: 'autowork',
      employee_id: ArfaYassin.id,
    },
    {
      username: 'ghasna.azer',
      password: 'H92vLuv7-0g',
      employee_id: GhasnaAzer.id,
    },
  ]);
};

module.exports = initializeHRDivision;
