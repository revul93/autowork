const db = require('../../db.config');

const RolesGroups = db.define(
  'RolesGroups',
  {},
  { timestamps: false, freezeTableName: true },
);

module.exports = RolesGroups;
