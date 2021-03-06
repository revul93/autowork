const initializeWorkflows = async () => {
  const initializeResignationWorkflow = require('./ResignationWorkflow');
  const initializeNewUserWorkflow = require('./NewUserWorkflow');
  const initializePettyCashRequest = require('./PettyCashRequest');
  const initializeSystemChangeWorkflow = require('./SystemChange');
  const initializeAddClientToBlackList = require('./AddToBlackList');
  const initializeStationaryRequestWorkflow = require('./StationaryRequest');
  const initializeApplyDiscount = require('./ApplyDiscount');
  try {
    await initializeResignationWorkflow();
    await initializeNewUserWorkflow();
    await initializePettyCashRequest();
    await initializeSystemChangeWorkflow();
    await initializeAddClientToBlackList();
    await initializeStationaryRequestWorkflow();
    await initializeApplyDiscount();
    console.log('Predefined workflows loaded successfully');
  } catch (error) {
    console.error(error);
  }
};

module.exports = initializeWorkflows;
