const { DataTypes } = require('sequelize');
const db = require('../../db.config');
const { get_approval_levels } = require('../../../utils');

const APPROVAL_LEVELS = get_approval_levels();

const Workflow = db.define('Workflow', {
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
  description: {
    type: DataTypes.STRING,
    validate: { max: 3000 },
  },
  approval_required: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [...Object.keys(APPROVAL_LEVELS)],
    },
  },
  initiators: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Workflow;
