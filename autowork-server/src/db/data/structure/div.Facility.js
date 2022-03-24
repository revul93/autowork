const InitializeFacilityDivision = async () => {
  const { Division, Role, Employee, User } = require('../../models');
  const GM = await Role.findOne({
    where: { title: 'General Manager' },
  });

  // division
  const Facility = await Division.create({
    name: 'Facility Management Division',
  });

  // roles
  // --> Manager
  const FacilityManager = await Role.create({
    title: 'Facility Manager',
    division_id: Facility.id,
    reports_to: GM.id,
  });
  // --> Officers
  const BuildingOfficer = await Role.create({
    title: 'SocialMediaOfficer',
    division_id: Facility.id,
    reports_to: FacilityManager.id,
  });
  const PostmailOfficer = await Role.create({
    title: 'Traditional Facility Officer',
    division_id: Facility.id,
    reports_to: FacilityManager.id,
  });

  // Employees
  const KadarSafi = await Employee.create({
    name: 'Kadar Safi',
    staff_id: 102115,
    email: 'kadar.safi@example.com',
    role_id: FacilityManager.id,
  });
  const RashidHaidar = await Employee.create({
    name: 'Rashid Haidar',
    staff_id: 102116,
    email: 'rashid.haidar@example.com',
    role_id: BuildingOfficer.id,
  });
  const HusseinLatif = await Employee.create({
    name: 'Hussein Latif',
    staff_id: 102117,
    email: 'hussein.latif@example.com',
    role_id: PostmailOfficer.id,
  });

  await User.bulkCreate([
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
  ]);
};

module.exports = InitializeFacilityDivision;
