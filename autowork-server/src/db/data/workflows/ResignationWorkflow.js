const ResignationWorkflow = async () => {
  const { Workflow, Group } = require('../../models');
  const { get_approval_levels } = require('../../../utils/static');
  const APPROVAL_LEVELS = get_approval_levels();

  const name = 'Resignation';
  const description = 'Resignation Workflow for Managers';
  const initiators = await Group.findOne({ name: 'Every manager group' });

  await Workflow.create({
    name,
    description,
    initiators: initiators.id,
    approval_required: APPROVAL_LEVELS.DIRECT_MANAGER,
  });
};

module.exports = ResignationWorkflow;
