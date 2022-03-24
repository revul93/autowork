const { DataTypes } = require('sequelize');
const db = require('../../db.config');
const { GetConstants, validate } = require('../../../utils');

const DATAFIELDTYPES = GetConstants().DATAFIELDTYPES;

const WorkflowData = db.define(
  'WorkflowData',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: validate.IsInputName,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: validate.IsInputLabel,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [[...Object.values(DATAFIELDTYPES)]],
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
    options: {
      type: DataTypes.STRING,
      validate: validate.IsOptionsArray,
    },
    workflow_transaction_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  { timestamps: false },
);

module.exports = WorkflowData;
