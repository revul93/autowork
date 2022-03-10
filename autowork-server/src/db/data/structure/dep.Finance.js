const { Department, Section, Role, Employee, User } = require('../../models');

const initializeFinancialAccountingDepartment = async () => {
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // department
  const FinancialAccounting = await Department.create({
    name: 'Financial Accounting',
  });

  // sections
  const FinancialPerformance = await Section.create({
    name: 'Financial Performance',
    department_id: FinancialAccounting.id,
  });
  const Accounting = await Section.create({
    name: 'Accounting',
    department_id: FinancialAccounting.id,
  });

  // roles
  // --> Manager
  const FinancialAccountingManager = await Role.create({
    title: 'Financial Accounting Manager',
    department_id: FinancialAccounting.id,
    reports_to: GM.id,
  });
  // --> Supervisors
  const FinancialPerformanceSupervisor = await Role.create({
    title: 'Financial Performance Supervisor',
    department_id: FinancialAccounting.id,
    section_id: FinancialPerformance.id,
    reports_to: FinancialAccountingManager.id,
  });
  const AccountingSupervisor = await Role.create({
    title: 'Accounting Supervisor',
    department_id: FinancialAccounting.id,
    section_id: Accounting.id,
    reports_to: FinancialAccountingManager.id,
  });
  // --> Officers and other roles
  const SeniorAccountant = await Role.create({
    title: 'Senior Accountant',
    department_id: FinancialAccounting.id,
    section_id: Accounting.id,
    reports_to: AccountingSupervisor.id,
  });
  const Accountant = await Role.create({
    title: 'Accountant',
    department_id: FinancialAccounting.id,
    section_id: Accounting.id,
    reports_to: AccountingSupervisor.id,
  });
  const PayrollAccountant = await Role.create({
    title: 'Payroll Accountant',
    department_id: FinancialAccounting.id,
    section_id: Accounting.id,
    reports_to: AccountingSupervisor.id,
  });
  const BankCoordinator = await Role.create({
    title: 'Bank Coordinator',
    department_id: FinancialAccounting.id,
    section_id: Accounting.id,
    reports_to: AccountingSupervisor.id,
  });
  const Cashier = await Role.create({
    title: 'Cashier',
    department_id: FinancialAccounting.id,
    section_id: Accounting.id,
    reports_to: AccountingSupervisor.id,
  });
  const TaxAccountingSpecialist = await Role.create({
    title: 'Tax Accounting Specialist',
    department_id: FinancialAccounting.id,
    section_id: Accounting.id,
    reports_to: AccountingSupervisor.id,
  });
  const FinancialAnalyst = await Role.create({
    title: 'Financial Analyst',
    department_id: FinancialAccounting.id,
    section_id: FinancialPerformance.id,
    reports_to: FinancialPerformanceSupervisor.id,
  });

  // Employees
  const MaridHanif = await Employee.create({
    name: 'Marid Hanif',
    staff_id: 102210,
    email: 'marid.hanif@example.com',
    role_id: FinancialAccountingManager.id,
  });
  const NazihIsmael = await Employee.create({
    name: 'Nazih Ismael',
    staff_id: 102211,
    email: 'nazih.ismael@example.com',
    role_id: FinancialPerformanceSupervisor.id,
  });
  const TarneemGhazi = await Employee.create({
    name: 'Tarneem Ghazi',
    staff_id: 102212,
    email: 'tarneem.ghazi@example.com',
    role_id: AccountingSupervisor.id,
  });
  const ShakeebaSalahuddin = await Employee.create({
    name: 'Shakeeba Salahuddin',
    staff_id: 102213,
    email: 'shakeeba.salahuddin@example.com',
    role_id: SeniorAccountant.id,
  });
  const HaemahZahra = await Employee.create({
    name: 'Haemah Zahra',
    staff_id: 102214,
    email: 'haemah.zahra@example.com',
    role_id: SeniorAccountant.id,
  });
  const RawhiyahSadiq = await Employee.create({
    name: 'Rawhiyah Sadiq',
    staff_id: 102215,
    email: 'rawhiyah.sadiq@example.com',
    role_id: Accountant.id,
  });
  const ReyhanAssaf = await Employee.create({
    name: 'Reyhan Assaf',
    staff_id: 102216,
    email: 'reyhan.assaf@example.com',
    role_id: Accountant.id,
  });
  const ShumailaSrour = await Employee.create({
    name: 'Shumaila Srour',
    staff_id: 102217,
    email: 'shumaila.srour@example.com',
    role_id: PayrollAccountant.id,
  });
  const RukanAyoob = await Employee.create({
    name: 'Rukan Ayoob',
    staff_id: 102218,
    email: 'rukan.ayoob@example.com',
    role_id: BankCoordinator.id,
  });
  const HasanNasser = await Employee.create({
    name: 'Hasan Nasser',
    staff_id: 102219,
    email: 'hasan.nasser@example.com',
    role_id: Cashier.id,
  });
  const SirajRauf = await Employee.create({
    name: 'Siraj Rauf',
    staff_id: 102220,
    email: 'siraj.rauf@example.com',
    role_id: Cashier.id,
  });
  const SohaliHashmi = await Employee.create({
    name: 'Sohali Hashmi',
    staff_id: 102221,
    email: 'sohali.hashmi@example.com',
    role_id: Cashier.id,
  });
  const JimellAmin = await Employee.create({
    name: 'Jimell Amin',
    staff_id: 102222,
    email: 'jimell.amin@example.com',
    role_id: TaxAccountingSpecialist.id,
  });
  const JalalAbdulhai = await Employee.create({
    name: 'Jalal Abdulhai',
    staff_id: 102223,
    email: 'jalal.abdulhai@example.com',
    role_id: FinancialAnalyst.id,
  });

  await User.bulkCreate([
    {
      username: 'marid.hanif',
      password: 'LklkxQpvc1o',
      employee_id: MaridHanif.id,
    },
    {
      username: 'nazih.ismael',
      password: 'OP2ZVdgUPu8',
      employee_id: NazihIsmael.id,
    },
    {
      username: 'tarneem.ghazi',
      password: 'IoNEt2fvOoo',
      employee_id: TarneemGhazi.id,
    },
    {
      username: 'shakeeba.salahuddin',
      password: 'v5klHw7h7dE',
      employee_id: ShakeebaSalahuddin.id,
    },
    {
      username: 'haemah.zahra',
      password: 'oG_H2I26LV4',
      employee_id: HaemahZahra.id,
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
    {
      username: 'shumaila.srour',
      password: 'glf23JHc3rY',
      employee_id: ShumailaSrour.id,
    },
    {
      username: 'rukan.ayoob',
      password: 'LjXMfc_yDqA',
      employee_id: RukanAyoob.id,
    },
    {
      username: 'hasan.nasser',
      password: 'JgBVRJb9Yng',
      employee_id: HasanNasser.id,
    },
    {
      username: 'siraj.rauf',
      password: 'A3WTCfpyHpM',
      employee_id: SirajRauf.id,
    },
    {
      username: 'sohali.hashmi',
      password: 'r-XHE_bm4lo',
      employee_id: SohaliHashmi.id,
    },
    {
      username: 'jimell.amin',
      password: 'nTKmbNvnuNk',
      employee_id: JimellAmin.id,
    },
    {
      username: 'jalal.abdulhai',
      password: '2lYXieGR6a4',
      employee_id: JalalAbdulhai.id,
    },
  ]);
};

module.exports = initializeFinancialAccountingDepartment;
