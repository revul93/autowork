const EveryRole = async () => {
  const { RolesGroups, Group, Role } = require('../../models');

  const group = await Group.create({
    name: 'Every role group',
    description: 'Every role in the corporate belongs to this group',
  });

  const roles = await Role.findAll();
  roles.forEach(async (role) => {
    await RolesGroups.create({
      group_id: group.id,
      role_id: role.id,
    });
  });
};

const EveryLevelOneRole = async () => {
  const { RolesGroups, Group, Role } = require('../../models');
  const { Op } = require('sequelize');

  const group = await Group.create({
    name: 'Every Level One Role',
    description: 'Every level one role in corporate belongs to this group',
  });

  const roles = await Role.findAll({
    where: {
      [Op.not]: [
        {
          title: {
            [Op.endsWith]: '%Manager',
          },
        },
      ],
    },
  });

  roles.forEach(async (role) => {
    await RolesGroups.create({
      group_id: group.id,
      role_id: role.id,
    });
  });
};

const EveryManagerExceptGM = async () => {
  const { RolesGroups, Group, Role } = require('../../models');
  const { Op } = require('sequelize');

  const group = await Group.create({
    name: 'Every manager group',
    description: 'Every manager role in the corporate belongs to this group',
  });

  const roles = await Role.findAll({
    where: {
      [Op.and]: [
        { title: { [Op.endsWith]: 'Manager' } },
        { division_id: { [Op.not]: null } },
      ],
    },
  });

  roles.forEach(async (role) => {
    await RolesGroups.create({
      group_id: group.id,
      role_id: role.id,
    });
  });
};

const GMGroup = async () => {
  const { RolesGroups, Group, Role } = require('../../models');

  const group = await Group.create({
    name: 'General Manager group',
    description: 'A group contain general manage role only',
  });

  const role = await Role.findOne({
    where: {
      title: 'General Manager',
    },
  });
  await RolesGroups.create({ group_id: group.id, role_id: role.id });
};

const RentalServiceOfficers = async () => {
  const { RolesGroups, Group, Role } = require('../../models');

  const group = await Group.create({
    name: 'Rental Service Officers group',
    description: 'A group contain rental service officers',
  });

  const role = await Role.findOne({
    where: {
      title: 'Rental Services Officer',
    },
  });
  await RolesGroups.create({ group_id: group.id, role_id: role.id });
};

const initializeGroups = async () => {
  await EveryRole();
  await EveryLevelOneRole();
  await EveryManagerExceptGM();
  await GMGroup();
  await RentalServiceOfficers();
};

module.exports = initializeGroups;
