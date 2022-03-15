const seed_db = async () => {
  const initializeStructure = require('./structure');
  const initializeWorkflows = require('./workflows');

  await initializeStructure();
  await initializeWorkflows();
};

module.exports = { seed_db };
