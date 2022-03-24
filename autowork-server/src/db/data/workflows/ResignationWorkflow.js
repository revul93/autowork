const ResignationWorkflow = async () => {
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

  const name = 'Resignation';
  const description = 'Resignation Workflow';
  const creators = await Group.findOne({
    name: 'Every Level One Role',
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
        await Role.findOne({ where: { title: 'Payroll Accountant' } })
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
    {
      order: 3,
      assigned_to: (
        await Role.findOne({ where: { title: 'Employees Relations Officer' } })
      ).id,
      workflow_id: workflow.id,
    },
  ]);

  await WorkflowData.bulkCreate([
    {
      name: 'resignation_reason',
      label: 'Resignation reason',
      type: DATAFIELD_TYPES.TEXTAREA,
      required: true,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'end_of_service_date',
      label: 'End of service date',
      type: DATAFIELD_TYPES.DATE,
      workflow_transaction_id: workflow_transactions[0].id,
    },
    {
      name: 'end_of_service_total_benifits',
      label: 'End of Service Total Benifits',
      type: DATAFIELD_TYPES.NUMBER,
      workflow_transaction_id: workflow_transactions[1].id,
    },
    {
      name: 'system_user_deleted',
      label: 'System user deleted ?',
      type: DATAFIELD_TYPES.CHECKBOX,
      workflow_transaction_id: workflow_transactions[2].id,
    },
    {
      name: 'email_deleted',
      label: 'Email deleted ?',
      type: DATAFIELD_TYPES.CHECKBOX,
      workflow_transaction_id: workflow_transactions[2].id,
    },
    {
      name: 'assets_collected',
      label: 'Assets collected ?',
      type: DATAFIELD_TYPES.CHECKBOX,
      workflow_transaction_id: workflow_transactions[3].id,
    },
    {
      name: 'assets_details',
      label: 'Assets details',
      type: DATAFIELD_TYPES.TEXTAREA,
      workflow_transaction_id: workflow_transactions[3].id,
    },
    {
      name: 'cheque_granted',
      label: 'Cheque granted ?',
      type: DATAFIELD_TYPES.CHECKBOX,
      workflow_transaction_id: workflow_transactions[3].id,
    },
    {
      name: 'employee_released',
      label: 'Employee released ?',
      type: DATAFIELD_TYPES.CHECKBOX,
      workflow_transaction_id: workflow_transactions[3].id,
    },
  ]);
};

module.exports = ResignationWorkflow;
