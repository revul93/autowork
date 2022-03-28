const InitializeMarketingDivision = async () => {
  const { Division, Role, Employee, User } = require('../../models');
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // division
  const Marketing = await Division.create({
    name: 'Marketing Division',
  });

  // roles
  // --> Manager
  const MarketingManager = await Role.create({
    title: 'Marketing Manager',
    division_id: Marketing.id,
    reports_to: GM.id,
  });
  // --> Officers
  const SocialMediaOfficer = await Role.create({
    title: 'Social Media Officer',
    division_id: Marketing.id,
    reports_to: MarketingManager.id,
  });
  const TraditionalMarketingOfficer = await Role.create({
    title: 'Traditional Marketing Officer',
    division_id: Marketing.id,
    reports_to: MarketingManager.id,
  });

  // Employees
  const ZaynHambleton = await Employee.create({
    name: 'Zayn Hambleton',
    staff_id: '101226',
    email: 'zayn.hambleton@example.com',
    role_id: MarketingManager.id,
  });
  const JanenePhillips = await Employee.create({
    name: 'Janene Phillips',
    staff_id: '101227',
    email: 'janene.phillips@example.com',
    role_id: SocialMediaOfficer.id,
  });
  const SaidJamail = await Employee.create({
    name: 'Said Jamail',
    staff_id: 102114,
    email: 'said.jamail@example.com',
    role_id: TraditionalMarketingOfficer.id,
  });

  await User.bulkCreate([
    {
      username: 'zayn.hambleton',
      password: 'autowork',
      employee_id: ZaynHambleton.id,
    },
    {
      username: 'janene.phillips',
      password: 'autowork',
      employee_id: JanenePhillips.id,
    },
    {
      username: 'said.jamail',
      password: 'autowork',
      employee_id: SaidJamail.id,
    },
  ]);
};

module.exports = InitializeMarketingDivision;
