const StationaryRequestWorkflow = async () => {
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

  const name = 'Stationary Request';
  const description = 'Stationary Request';

  const creators = await Group.findOne({
    where: { name: 'Every role group' },
  });
  const approval_sequence = [
    (await Role.findOne({ where: { title: CONSTANTS.MISC.DIRECT_MANAGER } }))
      .id,
    (await Role.findOne({ where: { title: 'Procuremnets Manager' } })).id,
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
        await Role.findOne({ where: { title: 'Payroll Accountant' } })
      ).id,
      workflow_id: workflow.id,
    },
    {
      order: 2,
      assigned_to: (
        await Role.findOne({ where: { title: 'General Procurements Officer' } })
      ).id,
      workflow_id: workflow.id,
    },
  ]);

  await WorkflowData.bulkCreate([
    {
      name: 'item',
      label: 'Item name',
      type: DATAFIELD_TYPES.TEXT,
      required: true,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'item_description',
      label: 'Item description',
      type: DATAFIELD_TYPES.TEXTAREA,
      max_chars: 3000,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: DATAFIELD_TYPES.NUMBER,
      required: true,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'budget',
      label: 'Budget',
      type: DATAFIELD_TYPES.NUMBER,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'supplied',
      label: 'Is Supplied ?',
      type: DATAFIELD_TYPES.CHECKBOX,
      workflow_transaction_id: workflow_transactions[1].id,
    },
  ]);
};

module.exports = StationaryRequestWorkflow;
