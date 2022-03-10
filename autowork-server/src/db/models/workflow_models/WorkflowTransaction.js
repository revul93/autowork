const { DataTypes } = require('sequelize');
const db = require('../../db.config');

const WorkflowTransaction = db.define('WorkflowTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 50,
    },
  },
  workflow_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  assigned_to: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

module.exports = WorkflowTransaction;
