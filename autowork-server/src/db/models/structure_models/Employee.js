const { DataTypes } = require('sequelize');
const db = require('../../db.config');

const Employee = db.define('Employee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      max: 255,
      is: /^[a-zA-Z]+[a-zA-Z\s]*$/,
    },
  },
  staff_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    validate: {
      is: /1[0-9]{5}/,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      max: 255,
      isEmail: true,
    },
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Employee;
