const { DataTypes } = require('sequelize');
const db = require('../../db.config');

const Group = db.define('Group', {
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
      is: /^[a-zA-Z\s]*$/,
    },
  },
  description: {
    type: DataTypes.STRING,
    validate: { max: 3000 },
  },
});

module.exports = Group;
