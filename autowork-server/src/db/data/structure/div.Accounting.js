const InitializeAccountingDivision = async () => {
  const { Division, Role, Employee, User } = require('../../models');
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // division
  const Accounting = await Division.create({
    name: 'Accounting Division',
  });

  // roles
  // --> Manager
  const AccountingManager = await Role.create({
    title: 'Accounting Manager',
    division_id: Accounting.id,
    reports_to: GM.id,
  });
  // --> Officers
  const PayrollAccountant = await Role.create({
    title: 'Payroll Accountant',
    division_id: Accounting.id,
    reports_to: AccountingManager.id,
  });
  const BankCoordinator = await Role.create({
    title: 'Bank Coordinator',
    division_id: Accounting.id,
    reports_to: AccountingManager.id,
  });
  const Accountant = await Role.create({
    title: 'Accountant',
    division_id: Accounting.id,
    reports_to: AccountingManager.id,
  });

  // Employees
  const MaridHanif = await Employee.create({
    name: 'Marid Hanif',
    staff_id: 102210,
    email: 'marid.hanif@example.com',
    role_id: AccountingManager.id,
  });
  const NazihIsmael = await Employee.create({
    name: 'Nazih Ismael',
    staff_id: 102211,
    email: 'nazih.ismael@example.com',
    role_id: PayrollAccountant.id,
  });
  const TarneemGhazi = await Employee.create({
    name: 'Tarneem Ghazi',
    staff_id: 102212,
    email: 'tarneem.ghazi@example.com',
    role_id: BankCoordinator.id,
  });
  const ShakeebaSalahuddin = await Employee.create({
    name: 'Shakeeba Salahuddin',
    staff_id: 102213,
    email: 'shakeeba.salahuddin@example.com',
    role_id: Accountant.id,
  });
  const HaemahZahra = await Employee.create({
    name: 'Haemah Zahra',
    staff_id: 102214,
    email: 'haemah.zahra@example.com',
    role_id: Accountant.id,
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
  ]);
};

module.exports = InitializeAccountingDivision;
