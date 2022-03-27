const { DataTypes } = require('sequelize');
const db = require('../../db.config');
const { GetConstants } = require('../../../utils');
const STATUS = GetConstants().STATUS;

const DocumentTransaction = db.define(
  'DocumentTransaction',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    document_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    workflow_transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: [[...Object.values(STATUS)]],
      },
    },
    author: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false },
);

module.exports = DocumentTransaction;
