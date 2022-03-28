const initializeOperationDivision = async () => {
  const { Division, Role, Employee, User } = require('../../models');
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // division
  const Operation = await Division.create({
    name: 'Rental Operation Division',
  });

  // roles
  // --> Manager
  const OperationManager = await Role.create({
    title: 'Operation Manager',
    division_id: Operation.id,
    reports_to: GM.id,
  });
  // --> Officers
  const RentalServicesOfficer = await Role.create({
    title: 'Rental Services Officer',
    division_id: Operation.id,
    reports_to: OperationManager.id,
  });

  // Employees
  const FaridNaaji = await Employee.create({
    name: 'Farid Naaji',
    staff_id: '101212',
    email: 'farid.naaji@example.com',
    role_id: OperationManager.id,
  });
  const RuqayyahElghazzawy = await Employee.create({
    name: 'Ruqayyah Elghazzawy',
    staff_id: '101213',
    email: 'ruqayyah.elghazzawy@example.com',
    role_id: RentalServicesOfficer.id,
  });
  const MyrandaMark = await Employee.create({
    name: 'Myranda Mark',
    staff_id: '101223',
    email: 'myranda.mark@example.com',
    role_id: RentalServicesOfficer.id,
  });
  const ChynaWatts = await Employee.create({
    name: 'Chyna Watts',
    staff_id: '101224',
    email: 'chyna.watts@example.com',
    role_id: RentalServicesOfficer.id,
  });
  const ShahdWinslow = await Employee.create({
    name: 'Shahd Winslow',
    staff_id: '101225',
    email: 'shahd.winslow@example.com',
    role_id: RentalServicesOfficer.id,
  });

  // users
  await User.bulkCreate([
    {
      username: 'faris.naaji',
      password: 'autowork',
      employee_id: FaridNaaji.id,
    },
    {
      username: 'ruqayyah.elghazzawy',
      password: 'autowork',
      employee_id: RuqayyahElghazzawy.id,
    },
    {
      username: 'myranda.mark',
      password: 'autowork',
      employee_id: MyrandaMark.id,
    },
    {
      username: 'chyna.watts',
      password: 'autowork',
      employee_id: ChynaWatts.id,
    },
    {
      username: 'shahd.winslow',
      password: 'autowork',
      employee_id: ShahdWinslow.id,
    },
  ]);
};

module.exports = initializeOperationDivision;
