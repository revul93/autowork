const { DataTypes } = require('sequelize');
const db = require('../../db.config');

const { get_data_field_types, isOptionsArray } = require('../../../utils');

const DATAFIELDTYPES = get_data_field_types();

const WorkflowData = db.define('WorkflowData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [...Object.keys(DATAFIELDTYPES)],
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      max: 255,
      is: /^[a-zA-Z\s]*$/,
    },
  },
  required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  max_chars: {
    type: DataTypes.INTEGER,
    defaultValue: 255,
  },
  is_email: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_staff_id: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  min: DataTypes.INTEGER,
  max: DataTypes.INTEGER,
  file_extension: DataTypes.STRING,
  options: {
    type: DataTypes.STRING,
    validate: {
      isOptionsArray,
    },
  },
  workflow_transaction_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

module.exports = WorkflowData;
