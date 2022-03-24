const { DataTypes } = require('sequelize');
const { validate } = require('../../../utils');
const db = require('../../db.config');

const Role = db.define(
  'Role',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: validate.IsRoleTitle,
    },
    division_id: DataTypes.UUID,
    reports_to: DataTypes.UUID,
  },
  { timestamps: false },
);

module.exports = Role;
