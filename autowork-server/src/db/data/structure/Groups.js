const { RolesGroups, Group, Role } = require('../../models');
const { Op } = require('sequelize');

const EveryRole = async () => {
  const group = await Group.create({
    name: 'Every role group',
    description: 'Every role in the corporate belongs to this group',
  });

  const roles = await Role.findAll();
  roles.forEach(async (role) => {
    let build = RolesGroups.build({
      group_id: group.id,
      role_id: role.id,
    });
    await build.save();
  });
};

const EveryNonSupervisorOrManager = async () => {
  const group = await Group.create({
    name: 'Every Non Supervisor Or Manager',
    description:
      'Every role except managers or supervisors in the corporate belongs to this group',
  });

  const roles = await Role.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.endsWith]: 'Supervisor',
          },
        },
        {
          title: {
            [Op.endsWith]: 'Manager',
          },
        },
      ],
    },
  });

  roles.forEach(async (role) => {
    let build = RolesGroups.build({
      group_id: group.id,
      role_id: role.id,
    });
    await build.save();
  });
};

const EverySupervisor = async () => {
  const group = await Group.create({
    name: 'Every supervisor group',
    description: 'Every supervisor role in the corporate belongs to this group',
  });

  const roles = await Role.findAll({
    where: {
      title: {
        [Op.endsWith]: 'Supervisor',
      },
    },
  });

  roles.forEach(async (role) => {
    let build = RolesGroups.build({
      group_id: group.id,
      role_id: role.id,
    });
    await build.save();
  });
};

const EveryManager = async () => {
  const group = await Group.create({
    name: 'Every manager group',
    description: 'Every manager role in the corporate belongs to this group',
  });

  const roles = await Role.findAll({
    where: {
      title: {
        [Op.endsWith]: 'Manager',
      },
    },
  });

  roles.forEach(async (role) => {
    let build = RolesGroups.build({
      group_id: group.id,
      role_id: role.id,
    });
    await build.save();
  });
};

const initializeGroups = async () => {
  await EveryRole();
  await EverySupervisor();
  await EveryManager();
  await EveryNonSupervisorOrManager();
};

module.exports = initializeGroups;
