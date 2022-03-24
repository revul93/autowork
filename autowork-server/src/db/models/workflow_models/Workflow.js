const { DataTypes } = require('sequelize');
const { validate } = require('../../../utils');
const db = require('../../db.config');

const Workflow = db.define(
  'Workflow',
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
      validate: validate.IsWorkflowName,
    },
    description: {
      type: DataTypes.STRING,
      validate: validate.IsLongText,
    },
    approval_sequence: {
      type: DataTypes.STRING,
      validate: validate.IsWorkflowApprovalSequence,
    },
    creators: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { timestamps: false },
);

module.exports = Workflow;
