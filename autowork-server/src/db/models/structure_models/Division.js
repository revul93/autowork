const { DataTypes } = require('sequelize');
const db = require('../../db.config');
const { validate } = require('../../../utils');

const Division = db.define(
  'Division',
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
      validate: validate.IsDivisionName,
    },
  },
  { timestamps: false },
);

module.exports = Division;
