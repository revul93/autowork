const ApplyDiscount = async () => {
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

  const name = 'Apply discount for a client';
  const description = 'Apply discount for a client';
  const creators = await Group.findOne({
    where: { name: 'Rental Service Officers group' },
  });

  const approval_sequence = [
    (await Role.findOne({ where: { title: CONSTANTS.MISC.DIRECT_MANAGER } }))
      .id,
    (await Role.findOne({ where: { title: 'Accounting Manager' } })).id,
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
    {
      order: 2,
      assigned_to: (await Role.findOne({ where: { title: 'Accountant' } })).id,
      workflow_id: workflow.id,
    },
  ]);

  await WorkflowData.bulkCreate([
    {
      name: 'client_id',
      label: 'Client ID',
      type: DATAFIELD_TYPES.TEXT,
      required: true,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'contract_number',
      label: 'Contract Number',
      type: DATAFIELD_TYPES.TEXT,
      max_chars: 15,
      required: true,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'discount_rate',
      label: 'Discount Rate',
      type: DATAFIELD_TYPES.TEXT,
      max_chars: 3,
      max: 100,
      required: true,
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
      max_chars: 3000,
      type: DATAFIELD_TYPES.TEXTAREA,
      workflow_transaction_id: workflow_transactions[1].id,
    },
    {
      name: 'done',
      label: 'Account Justified',
      type: DATAFIELD_TYPES.CHECKBOX,
      workflow_transaction_id: workflow_transactions[2].id,
    },
    {
      name: 'note',
      label: 'Note',
      max_chars: 3000,
      type: DATAFIELD_TYPES.TEXTAREA,
      workflow_transaction_id: workflow_transactions[2].id,
    },
  ]);
};

module.exports = ApplyDiscount;
