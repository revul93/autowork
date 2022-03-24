const { DataTypes } = require('sequelize');
const db = require('../../db.config');

const DocumentData = db.define(
  'DocumentData',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    document_transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    workflow_data_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false },
);

module.exports = DocumentData;
