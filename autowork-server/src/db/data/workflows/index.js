const initializeWorkflows = async () => {
  const initializeResignationWorkflow = require('./ResignationWorkflow');
  try {
    await initializeResignationWorkflow();
    console.log('Predefined workflows loaded successfully');
  } catch (error) {
    console.error(error);
  }
};

module.exports = initializeWorkflows;
