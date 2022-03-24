const SeedDb = async () => {
  const initializeStructure = require('./structure');
  const initializeWorkflows = require('./workflows');

  await initializeStructure();
  await initializeWorkflows();
};

module.exports = { SeedDb };
