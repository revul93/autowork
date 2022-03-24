const Division = require('./structure_models/Division');
const Role = require('./structure_models/Role');
const Group = require('./structure_models/Group');
const Employee = require('./structure_models/Employee');
const User = require('./structure_models/User');
const RolesGroups = require('./structure_models/RolesGroups');
const Workflow = require('./workflow_models/Workflow');
const WorkflowTransaction = require('./workflow_models/WorkflowTransaction');
const WorkflowData = require('./workflow_models/WorkflowData');
const Document = require('./workflow_models/Document');
const DocumentTransaction = require('./workflow_models/DocumentTransaction');
const DocumentData = require('./workflow_models/DocumentData');

const { SetAssociation } = require('./Association');

module.exports = {
  Division,
  Role,
  Group,
  Employee,
  User,
  RolesGroups,
  Workflow,
  WorkflowTransaction,
  WorkflowData,
  Document,
  DocumentTransaction,
  DocumentData,
  SetAssociation,
};
