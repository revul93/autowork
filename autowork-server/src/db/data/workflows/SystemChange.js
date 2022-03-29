const SystemChangeWorkflow = async () => {
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

  const name = 'System Change';
  const description = 'System Change Workflow';
  const creators = await Group.findOne({
    where: { name: 'Rental Service Officers group' },
  });

  const approval_sequence = [
    (await Role.findOne({ where: { title: CONSTANTS.MISC.DIRECT_MANAGER } }))
      .id,
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
        await Role.findOne({ where: { title: 'Software Developer' } })
      ).id,
      workflow_id: workflow.id,
    },
  ]);

  await WorkflowData.bulkCreate([
    {
      name: 'field',
      label: 'Field',
      type: DATAFIELD_TYPES.TEXT,
      required: true,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'previous_value',
      label: 'Previous Value',
      type: DATAFIELD_TYPES.TEXT,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'new_value',
      label: 'New Value',
      type: DATAFIELD_TYPES.TEXT,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'change_reason',
      label: 'Reason of Change',
      type: DATAFIELD_TYPES.TEXTAREA,
      max_chars: 3000,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'done',
      label: 'Is done',
      type: DATAFIELD_TYPES.CHECKBOX,
      workflow_transaction_id: workflow_transactions[1].id,
    },
    {
      name: 'note',
      label: 'Note',
      type: DATAFIELD_TYPES.TEXTAREA,
      workflow_transaction_id: workflow_transactions[1].id,
    },
  ]);
};

module.exports = SystemChangeWorkflow;
