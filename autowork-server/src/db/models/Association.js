const setAssociation = async () => {
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

  // Department   1 ---> n   Section
  Department.hasMany(Section, { foreignKey: 'department_id' });
  // Department   1 ---> n   Role
  Department.hasOne(Role, { foreignKey: 'department_id' });

  // Role   n ---> 1   Section
  Section.hasMany(Role, { foreignKey: 'section_id' });
  // // Role   n ---> 1   Role
  Role.belongsTo(Role, { foreignKey: 'reports_to' });
  // Role   1 ---> n   Employee
  Role.hasMany(Employee, { foreignKey: 'role_id' });

  // Group   n ---> n   Role
  Group.belongsToMany(Role, {
    through: RolesGroups,
    foreignKey: 'group_id',
  });
  Role.belongsToMany(Group, {
    through: RolesGroups,
    foreignKey: 'role_id',
  });

  // Employee   1 ---> 1   User
  Employee.hasOne(User, { foreignKey: 'employee_id' });

  // Workflow   1 ---> n   WorkflowTransaction
  Workflow.hasMany(WorkflowTransaction, {
    foreignKey: 'workflow_id',
  });
  // Workflow   1 --> n   Group
  Workflow.belongsTo(Group, { foreignKey: 'initiators' });

  // WorkflowTransaction   1 ---> n   Role
  WorkflowTransaction.belongsTo(Role, { foreignKey: 'assigned_to' });

  // WorkflowData   n ---> 1   WorkflowTransaction
  WorkflowData.belongsTo(WorkflowTransaction, {
    foreignKey: 'workflow_transaction_id',
  });

  // Document    n --> 1   Workflow
  Document.belongsTo(Workflow, {
    foreignKey: 'workflow_id',
  });
  // Document   1 --> 1   Employee
  Document.belongsTo(Employee, {
    foreignKey: 'initiator',
  });
  // Document   1 --> n   DocumentTransaction
  Document.hasMany(DocumentTransaction, {
    foreignKey: 'document_id',
  });

  // DocumentTransaction   1 --> 1   WorkflowTransaction
  DocumentTransaction.belongsTo(WorkflowTransaction, {
    foreignKey: 'workflow_transaction_id',
  });
  // DocumentTransaction   1 --> n   DocumentData
  DocumentTransaction.hasMany(DocumentData, {
    foreignKey: 'document_transaction_id',
  });
  // DocumentTransaction   1 --> 1   Employee
  DocumentTransaction.belongsTo(Employee, {
    foreignKey: 'author',
  });

  // DocumentData   n --> 1   WorkflowData
  DocumentData.belongsTo(WorkflowData, {
    foreignKey: 'workflow_data_id',
  });
};

module.exports = { setAssociation };
