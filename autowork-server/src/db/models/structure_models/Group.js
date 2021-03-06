const { DataTypes } = require('sequelize');
const { validate } = require('../../../utils');
const db = require('../../db.config');

const Group = db.define(
  'Group',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: validate.IsGroupName,
    },
    description: {
      type: DataTypes.STRING,
      validate: validate.IsLongText,
    },
  },
  { timestamps: false },
);

module.exports = Group;
