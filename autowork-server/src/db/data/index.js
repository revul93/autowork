const seed_db = async () => {
  const initializeStructure = require('./structure');
  // const initializeWorkflows = require('./workflow');

  await initializeStructure();
  // await initializeWorkflows();
};

module.exports = { seed_db };
