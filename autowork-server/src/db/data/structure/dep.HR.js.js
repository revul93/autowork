const initializeHRDepartment = async () => {
  const { Department, Section, Role, Employee, User } = require('../../models');
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // department
  const HR = await Department.create({ name: 'Human Resource' });

  // sections
  const GovernmentalRelations = await Section.create({
    name: 'Governmental Relations',
    department_id: HR.id,
  });
  const EmployeesRelations = await Section.create({
    name: 'Employees Relations',
    department_id: HR.id,
  });
  const OccupationalSafety = await Section.create({
    name: 'Occupational Safety and Health Administration',
    department_id: HR.id,
  });
  const FacilityManagement = await Section.create({
    name: 'Facility Management',
    department_id: HR.id,
  });

  // roles
  // --> Manager
  const HRManager = await Role.create({
    title: 'HR Manager',
    department_id: HR.id,
    reports_to: GM.id,
  });
  // --> Supervisors
  const GovernmentalRelationsSupervisor = await Role.create({
    title: 'Governmental Relations Supervisor',
    department_id: HR.id,
    section_id: GovernmentalRelations.id,
    reports_to: HRManager.id,
  });
  const EmployeesRelationsSupervisor = await Role.create({
    title: 'Employees Relations Supervisor',
    department_id: HR.id,
    section_id: EmployeesRelations.id,
    reports_to: HRManager.id,
  });
  const OccupationalSafetySupervisor = await Role.create({
    title: 'Occupational Safety Supervisor',
    department_id: HR.id,
    section_id: OccupationalSafety.id,
    reports_to: HRManager.id,
  });
  const FacilityManagementSupervisor = await Role.create({
    title: 'Facility Management Supervisor',
    department_id: HR.id,
    section_id: FacilityManagement.id,
    reports_to: HRManager.id,
  });
  // --> Officers and other roles
  const GovernmentalExpeditor = await Role.create({
    title: 'Governmental Expeditor',
    department_id: HR.id,
    section_id: GovernmentalRelations.id,
    reports_to: GovernmentalRelationsSupervisor.id,
  });
  const EmployeeRecruitementOfficer = await Role.create({
    title: 'Employee Recruitment Officer',
    department_id: HR.id,
    section_id: EmployeesRelations.id,
    reports_to: EmployeesRelationsSupervisor.id,
  });
  const EmployeeDevelopmentOfficer = await Role.create({
    title: 'Employee Development Officer',
    department_id: HR.id,
    section_id: EmployeesRelations.id,
    reports_to: EmployeesRelationsSupervisor.id,
  });
  const HRISSpecialist = await Role.create({
    title: 'HRIS Specialist',
    department_id: HR.id,
    section_id: EmployeesRelations.id,
    reports_to: EmployeesRelationsSupervisor.id,
  });
  const SafetyOfficer = await Role.create({
    title: 'Safety Officer',
    department_id: HR.id,
    section_id: OccupationalSafety.id,
    reports_to: OccupationalSafetySupervisor.id,
  });
  const FacilityServicesOfficer = await Role.create({
    title: 'Facility Services Officer',
    department_id: HR.id,
    section_id: FacilityManagement.id,
    reports_to: FacilityManagementSupervisor.id,
  });
  const PostMailOfficer = await Role.create({
    title: 'Post Mail Officer ',
    department_id: HR.id,
    section_id: FacilityManagement.id,
    reports_to: FacilityManagementSupervisor.id,
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
    role_id: GovernmentalRelationsSupervisor.id,
  });
  const ArfaYassin = await Employee.create({
    name: 'Arfa Yassin',
    staff_id: 102112,
    email: 'arfa.yassin@example.com',
    role_id: EmployeesRelationsSupervisor.id,
  });
  const GhasnaAzer = await Employee.create({
    name: 'Ghasna Azer',
    staff_id: 102113,
    email: 'ghasna.azer@example.com',
    role_id: OccupationalSafetySupervisor.id,
  });
  const SaidJamail = await Employee.create({
    name: 'Said Jamail',
    staff_id: 102114,
    email: 'said.jamail@example.com',
    role_id: FacilityManagementSupervisor.id,
  });
  const KadarSafi = await Employee.create({
    name: 'Kadar Safi',
    staff_id: 102115,
    email: 'kadar.safi@example.com',
    role_id: GovernmentalExpeditor.id,
  });
  const RashidHaidar = await Employee.create({
    name: 'Rashid Haidar',
    staff_id: 102116,
    email: 'rashid.haidar@example.com',
    role_id: GovernmentalExpeditor.id,
  });
  const HusseinLatif = await Employee.create({
    name: 'Hussein Latif',
    staff_id: 102117,
    email: 'hussein.latif@example.com',
    role_id: GovernmentalExpeditor.id,
  });
  const ImadNour = await Employee.create({
    name: 'Imad Nour',
    staff_id: 102118,
    email: 'imad.nour@example.com',
    role_id: EmployeeRecruitementOfficer.id,
  });
  const JamalMorad = await Employee.create({
    name: 'Jamal Morad',
    staff_id: 102120,
    email: 'jamal.morad@example.com',
    role_id: EmployeeDevelopmentOfficer.id,
  });
  const MaisaraRais = await Employee.create({
    name: 'Maisara Rais',
    staff_id: 102121,
    email: 'maisara.rais@example.com',
    role_id: HRISSpecialist.id,
  });
  const RabeeaAmir = await Employee.create({
    name: 'Rabeea Amir',
    staff_id: 102122,
    email: 'rabeea.amir@example.com',
    role_id: SafetyOfficer.id,
  });
  const ImadDib = await Employee.create({
    name: 'Imad Dib',
    staff_id: 102123,
    email: 'imad.dib@example.com',
    role_id: SafetyOfficer.id,
  });
  const AfraAmir = await Employee.create({
    name: 'Afra Amir',
    staff_id: 102124,
    email: 'afra.amir@example.com',
    role_id: SafetyOfficer.id,
  });
  const AminatShafi = await Employee.create({
    name: 'Aminat Shafi',
    staff_id: 102126,
    email: 'aminat.shafi@example.com',
    role_id: FacilityServicesOfficer.id,
  });
  const IslamAbdella = await Employee.create({
    name: 'Islam Abdella',
    staff_id: 102127,
    email: 'islam.abdella@example.com',
    role_id: PostMailOfficer.id,
  });
  const UbabRizk = await Employee.create({
    name: 'Ubab Rizk',
    staff_id: 102128,
    email: 'ubab.rizk@example.com',
    role_id: PostMailOfficer.id,
  });
  const ZukhrufKarim = await Employee.create({
    name: 'Zukhruf Karim',
    staff_id: 102129,
    email: 'zukhruf.karim@example.com',
    role_id: PostMailOfficer.id,
  });

  await User.bulkCreate([
    {
      username: 'husam.zahra',
      password: 'hqKWcXumy7k',
      employee_id: HusamZahra.id,
    },
    {
      username: 'taher.ahmad',
      password: 'tTDk77kn1_g',
      employee_id: TaherAhmad.id,
    },
    {
      username: 'arfa.yassin',
      password: 'r5YOGBhKiok',
      employee_id: ArfaYassin.id,
    },
    {
      username: 'ghasna.azer',
      password: 'H92vLuv7-0g',
      employee_id: GhasnaAzer.id,
    },
    {
      username: 'said.jamail',
      password: 'tT2eRHjzGuE',
      employee_id: SaidJamail.id,
    },
    {
      username: 'kadar.safi',
      password: 'vIHBtwWs42s',
      employee_id: KadarSafi.id,
    },
    {
      username: 'rashid.haidar',
      password: 'God042NAsco',
      employee_id: RashidHaidar.id,
    },
    {
      username: 'hussein.latif',
      password: '0r9uIVJbvuo',
      employee_id: HusseinLatif.id,
    },
    {
      username: 'imad.nour',
      password: 'SaJ54nBCdHE',
      employee_id: ImadNour.id,
    },
    {
      username: 'jamal.morad',
      password: 'VGIv5-5N8F8',
      employee_id: JamalMorad.id,
    },
    {
      username: 'maisara.rais',
      password: 'o9aFDY208o4',
      employee_id: MaisaraRais.id,
    },
    {
      username: 'rabeea.amir',
      password: 'lXLYfqSt74M',
      employee_id: RabeeaAmir.id,
    },
    {
      username: 'imad.dib',
      password: '4CWfdTppquk',
      employee_id: ImadDib.id,
    },
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
  ]);
};

module.exports = initializeHRDepartment;
