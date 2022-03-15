const initializeITDepartment = async () => {
  const { Department, Section, Role, Employee, User } = require('../../models');
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // department
  const IT = await Department.create({ name: 'Information Technology' });

  // sections
  const ITinfrastructure = await Section.create({
    name: 'IT Infrastructure',
    department_id: IT.id,
  });
  const ITSupport = await Section.create({
    name: 'Support & Services',
    department_id: IT.id,
  });
  const BusinessDevelopment = await Section.create({
    name: 'Business Development',
    department_id: IT.id,
  });

  // roles
  // --> Manager
  const ITManager = await Role.create({
    title: 'IT Manager',
    department_id: IT.id,
    reports_to: GM.id,
  });
  // --> Supervisors
  const ITInfrastructureSupervisor = await Role.create({
    title: 'IT Infrastructure Supervisor',
    department_id: IT.id,
    section_id: ITinfrastructure.id,
    reports_to: ITManager.id,
  });
  const ITSupportSupervisor = await Role.create({
    title: 'Support & Services Supervisor',
    department_id: IT.id,
    section_id: ITSupport.id,
    reports_to: ITManager.id,
  });
  const BusinessDevelopmentSupervisor = await Role.create({
    title: 'Business Development Supervisor',
    department_id: IT.id,
    section_id: BusinessDevelopment.id,
    reports_to: ITManager.id,
  });
  // --> Officers and other roles
  const NetworkAdministrator = await Role.create({
    title: 'Network Administrator',
    department_id: IT.id,
    section_id: ITinfrastructure.id,
    reports_to: ITInfrastructureSupervisor.id,
  });
  const SystemAdministrator = await Role.create({
    title: 'System Administrator',
    department_id: IT.id,
    section_id: ITinfrastructure.id,
    reports_to: ITInfrastructureSupervisor.id,
  });
  const TechnicalSupportSpecialist = await Role.create({
    title: 'Technical Support Specialist',
    department_id: IT.id,
    section_id: ITSupport.id,
    reports_to: ITSupportSupervisor.id,
  });
  const LeadApplicationDeveloper = await Role.create({
    title: 'Lead Application Developer',
    department_id: IT.id,
    section_id: BusinessDevelopment.id,
    reports_to: BusinessDevelopmentSupervisor.id,
  });
  const LeadApplicationConsultant = await Role.create({
    title: 'Lead Application Consultant',
    department_id: IT.id,
    section_id: BusinessDevelopment.id,
    reports_to: BusinessDevelopmentSupervisor.id,
  });
  const WebDeveloper = await Role.create({
    title: 'Web Developer',
    department_id: IT.id,
    section_id: BusinessDevelopment.id,
    reports_to: BusinessDevelopmentSupervisor.id,
  });

  // Employees
  const ShamilAhmed = await Employee.create({
    name: 'Shamil Ahmed',
    staff_id: '101241',
    email: 'shamil.ahmed@example.com',
    role_id: ITManager.id,
  });
  const MahirNaaji = await Employee.create({
    name: 'Mahir Naaji',
    staff_id: '101251',
    email: 'mahir.naaji@example.com',
    role_id: ITInfrastructureSupervisor.id,
  });
  const FarisKader = await Employee.create({
    name: 'Faris Kader',
    staff_id: '101261',
    email: 'faris.kader@example.com',
    role_id: BusinessDevelopmentSupervisor.id,
  });
  const AfifElhashem = await Employee.create({
    name: 'Afif Elhashem',
    staff_id: '101271',
    email: 'afif.elhashem@example.com',
    role_id: NetworkAdministrator.id,
  });
  const KhayratSaqqaf = await Employee.create({
    name: 'Khayrat Saqqaf',
    staff_id: '101281',
    email: 'khayrat.saqqaf@example.com',
    role_id: SystemAdministrator.id,
  });
  const NuraddinAlfarsi = await Employee.create({
    name: 'Nuraddin Alfarsi',
    staff_id: '101291',
    email: 'nuraddin.alfarsi@example.com',
    role_id: TechnicalSupportSpecialist.id,
  });
  const FaridNaaji = await Employee.create({
    name: 'Farid Naaji',
    staff_id: '101212',
    email: 'farid.naaji@example.com',
    role_id: TechnicalSupportSpecialist.id,
  });
  const RuqayyahElghazzawy = await Employee.create({
    name: 'Ruqayyah Elghazzawy',
    staff_id: '101213',
    email: 'ruqayyah.elghazzawy@example.com',
    role_id: TechnicalSupportSpecialist.id,
  });
  const MyrandaMark = await Employee.create({
    name: 'Myranda Mark',
    staff_id: '101223',
    email: 'myranda.mark@example.com',
    role_id: LeadApplicationDeveloper.id,
  });
  const ChynaWatts = await Employee.create({
    name: 'Chyna Watts',
    staff_id: '101224',
    email: 'chyna.watts@example.com',
    role_id: LeadApplicationDeveloper.id,
  });
  const ShahdWinslow = await Employee.create({
    name: 'Shahd Winslow',
    staff_id: '101225',
    email: 'shahd.winslow@example.com',
    role_id: LeadApplicationConsultant.id,
  });
  const ZaynHambleton = await Employee.create({
    name: 'Zayn Hambleton',
    staff_id: '101226',
    email: 'zayn.hambleton@example.com',
    role_id: LeadApplicationConsultant.id,
  });
  const JanenePhillips = await Employee.create({
    name: 'Janene Phillips',
    staff_id: '101227',
    email: 'janene.phillips@example.com',
    role_id: WebDeveloper.id,
  });

  // users
  await User.bulkCreate([
    {
      username: 'shamil.ahmed',
      password: 'qX32Dn55',
      employee_id: ShamilAhmed.id,
    },
    {
      username: 'mahir.naaji',
      password: 'BO9Vta71',
      employee_id: MahirNaaji.id,
    },
    {
      username: 'faris.kader',
      password: 'fuz5xGMJ',
      employee_id: FarisKader.id,
    },
    {
      username: 'afif.elhashem',
      password: 'SzXJ6qm7',
      employee_id: AfifElhashem.id,
    },
    {
      username: 'khayrat.saqqaf',
      password: 'd8wBUlqk',
      employee_id: KhayratSaqqaf.id,
    },
    {
      username: 'nuraddin.alfarsi',
      password: 'Vk1AoPKo',
      employee_id: NuraddinAlfarsi.id,
    },
    {
      username: 'faris.naaji',
      password: 'p4zK7M1g',
      employee_id: FaridNaaji.id,
    },
    {
      username: 'ruqayyah.elghazzawy',
      password: 'Wfux3dt9',
      employee_id: RuqayyahElghazzawy.id,
    },
    {
      username: 'myranda.mark',
      password: 'y3Pciicv',
      employee_id: MyrandaMark.id,
    },
    {
      username: 'chyna.watts',
      password: 'y84wjnAS',
      employee_id: ChynaWatts.id,
    },
    {
      username: 'shahd.winslow',
      password: 'Veke7fBU',
      employee_id: ShahdWinslow.id,
    },
    {
      username: 'zayn.hambleton',
      password: 'Y07BP6ai',
      employee_id: ZaynHambleton.id,
    },
    {
      username: 'janene.phillips',
      password: 'zH5pl8iT',
      employee_id: JanenePhillips.id,
    },
  ]);
};

module.exports = initializeITDepartment;
