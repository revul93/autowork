const { DataTypes } = require('sequelize');
const db = require('../../db.config');

const Department = db.define('Department', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      max: 255,
      is: /^[a-zA-Z]+[a-zA-Z\s&]*$/,
    },
  },
});

module.exports = Department;
