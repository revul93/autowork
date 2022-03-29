const NewUserWorkflow = async () => {
  const {
    Workflow,
    Group,
    WorkflowTransaction,
    Role,
    WorkflowData,
  } = require('../../models');
  const { GetConstants } = require('../../../utils');
  const CONSTANTS = GetConstants();
  const DATAFIELD_TYPES = CONSTANTS.DATAFIELDTYPES;

  const name = 'New User';
  const description = 'New User Workflow';
  const creators = await Group.findOne({
    where: { name: 'Every manager group' },
  });

  const approval_sequence = [
    (await Role.findOne({ where: { title: CONSTANTS.MISC.DIRECT_MANAGER } }))
      .id,
    (await Role.findOne({ where: { title: 'HR Manager' } })).id,
    (await Role.findOne({ where: { title: 'General Manager' } })).id,
  ];

  const workflow = await Workflow.create({
    name,
    description,
    creators: creators.id,
    approval_sequence: JSON.stringify(approval_sequence),
  });

  const workflow_transactions = await WorkflowTransaction.bulkCreate([
    { order: 0, workflow_id: workflow.id },
    {
      order: 1,
      assigned_to: (
        await Role.findOne({ where: { title: 'Employees Relations Officer' } })
      ).id,
      workflow_id: workflow.id,
    },
    {
      order: 2,
      assigned_to: (
        await Role.findOne({ where: { title: 'System Administrator' } })
      ).id,
      workflow_id: workflow.id,
    },
  ]);

  await WorkflowData.bulkCreate([
    {
      name: 'fullname',
      label: 'Full name',
      type: DATAFIELD_TYPES.TEXT,
      required: true,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'birthdate',
      label: 'Birthdate',
      type: DATAFIELD_TYPES.DATE,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'address',
      label: 'Living address',
      type: DATAFIELD_TYPES.TEXT,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'mobileNumber',
      label: 'Mobile Number',
      type: DATAFIELD_TYPES.NUMBER,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'role',
      label: 'Role',
      type: DATAFIELD_TYPES.TEXT,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'division',
      label: 'Division',
      type: DATAFIELD_TYPES.TEXT,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'staff_id',
      label: 'Staff ID',
      type: DATAFIELD_TYPES.NUMBER,
      workflow_transaction_id: workflow_transactions[1].id,
    },
    {
      name: 'email',
      label: 'Email address',
      type: DATAFIELD_TYPES.TEXT,
      workflow_transaction_id: workflow_transactions[2].id,
    },
    {
      name: 'system_user',
      label: 'System User',
      type: DATAFIELD_TYPES.TEXT,
      workflow_transaction_id: workflow_transactions[2].id,
    },
  ]);
};

module.exports = NewUserWorkflow;
