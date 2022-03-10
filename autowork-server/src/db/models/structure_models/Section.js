const { DataTypes } = require('sequelize');
const db = require('../../db.config');

const Section = db.define('Section', {
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
  department_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Section;
