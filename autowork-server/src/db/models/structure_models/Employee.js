const { DataTypes } = require('sequelize');
const db = require('../../db.config');
const { validate } = require('../../../utils');

const Employee = db.define(
  'Employee',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: validate.IsEmployeeName,
    },
    staff_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      validate: validate.IsStaffId,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: validate.IsEmail,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { timestamps: false },
);

module.exports = Employee;
