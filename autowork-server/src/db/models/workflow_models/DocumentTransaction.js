const { DataTypes } = require('sequelize');
const db = require('../../db.config');

const DocumentTransaction = db.define('DocumentTransaction', {
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
  author: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

module.exports = DocumentTransaction;
