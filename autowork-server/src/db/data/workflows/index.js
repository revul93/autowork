const initializeWorkflows = async () => {
  const initializeResignationWorkflow = require('./ResignationWorkflow');
  try {
    await initializeResignationWorkflow();
    console.log('Corporate predefined worflows loaded successfully');
  } catch (error) {
    console.error(error);
  }
};

module.exports = initializeWorkflows;
