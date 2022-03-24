const { DataTypes } = require('sequelize');
const db = require('../../db.config');
const { GetConstants, validate } = require('../../../utils');

const STATUS = GetConstants().STATUS;

const Document = db.define(
  'Document',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    creator: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    approvals: {
      type: DataTypes.STRING,
      validate: validate.IsDocumentApprovalSequence,
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: [[...Object.values(STATUS)]],
      },
    },
    workflow_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false },
);

module.exports = Document;
