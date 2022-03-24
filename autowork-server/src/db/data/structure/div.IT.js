const initializeITDivision = async () => {
  const { Division, Role, Employee, User } = require('../../models');
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // division
  const IT = await Division.create({ name: 'Information Technology Division' });

  // roles
  // --> Manager
  const ITManager = await Role.create({
    title: 'IT Manager',
    division_id: IT.id,
    reports_to: GM.id,
  });
  // --> Officers
  const SystemAdministrator = await Role.create({
    title: 'System Administrator',
    division_id: IT.id,
    reports_to: ITManager.id,
  });
  const TechnicalSupportSpecialist = await Role.create({
    title: 'Technical Support Specialist',
    division_id: IT.id,
    reports_to: ITManager.id,
  });
  const SoftwareDeveloper = await Role.create({
    title: 'Software Developer',
    division_id: IT.id,
    reports_to: ITManager.id,
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
    role_id: SystemAdministrator.id,
  });
  const FarisKader = await Employee.create({
    name: 'Faris Kader',
    staff_id: '101261',
    email: 'faris.kader@example.com',
    role_id: TechnicalSupportSpecialist.id,
  });
  const AfifElhashem = await Employee.create({
    name: 'Afif Elhashem',
    staff_id: '101271',
    email: 'afif.elhashem@example.com',
    role_id: TechnicalSupportSpecialist.id,
  });
  const KhayratSaqqaf = await Employee.create({
    name: 'Khayrat Saqqaf',
    staff_id: '101281',
    email: 'khayrat.saqqaf@example.com',
    role_id: SoftwareDeveloper.id,
  });
  const NuraddinAlfarsi = await Employee.create({
    name: 'Nuraddin Alfarsi',
    staff_id: '101291',
    email: 'nuraddin.alfarsi@example.com',
    role_id: SoftwareDeveloper.id,
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
  ]);
};

module.exports = initializeITDivision;
