const connector = require('./connector');
const authStrategies = require('./authStrategies');

module.exports = {
  validateAuth: connector.validateAuth,
  getFilterSetsAll: connector.getFilterSetsAll,
  getNumberOfLeads: connector.getNumberOfLeads,
  getPossibleSalePrice: connector.getPossibleSalePrice,
  getTransactionDetails: connector.getTransactionDetails,
  customLeadSalesBySourceReport: connector.customLeadSalesBySourceReport,
  authStrategies
};