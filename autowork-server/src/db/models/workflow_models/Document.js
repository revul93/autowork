const { DataTypes } = require('sequelize');
const db = require('../../db.config');
const { get_document_statuses } = require('../../../utils');

const DOCUMENT_STATUSES = get_document_statuses();

const Document = db.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  initiator: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    validate: {
      isIn: [[...Object.values(DOCUMENT_STATUSES)]],
    },
  },
  workflow_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Document;
