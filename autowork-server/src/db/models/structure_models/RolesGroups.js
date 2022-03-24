const { DataTypes } = require('sequelize');
const db = require('../../db.config');

const RolesGroups = db.define(
  'RolesGroups',
  { group_id: DataTypes.UUID, role_id: DataTypes.UUID },
  { timestamps: false, freezeTableName: true },
);

module.exports = RolesGroups;
