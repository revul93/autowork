const Department = require('./structure_models/Department');
const Section = require('./structure_models/Section');
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

const { setAssociation } = require('./Association');

module.exports = {
  Department,
  Section,
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
  setAssociation,
};
