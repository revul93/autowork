const { DataTypes } = require('sequelize');
const db = require('../../db.config');

const Role = db.define('Role', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      max: 255,
      is: /^[a-zA-Z]+[a-zA-Z\s&]*$/,
    },
  },
  department_id: DataTypes.UUID,
  section_id: DataTypes.UUID,
  reports_to: DataTypes.UUID,
});

module.exports = Role;
