const PettyCashRequest = async () => {
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

  const name = 'Petty Cash Request';
  const description = 'Petty Cash Request';
  const creators = await Group.findOne({
    where: { name: 'Every manager group' },
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
        await Role.findOne({ where: { title: 'Payroll Accountant' } })
      ).id,
      workflow_id: workflow.id,
    },
  ]);

  await WorkflowData.bulkCreate([
    {
      name: 'staff_id',
      label: 'Holder Staff ID',
      type: DATAFIELD_TYPES.NUMBER,
      required: true,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'amount',
      label: 'Amount',
      type: DATAFIELD_TYPES.NUMBER,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'done',
      label: 'Petty Cash granted ?',
      type: DATAFIELD_TYPES.CHECKBOX,
      workflow_transaction_id: workflow_transactions[1].id,
    },
  ]);
};

module.exports = PettyCashRequest;
