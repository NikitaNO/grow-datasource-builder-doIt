const connector = require('./connector');
const authStrategies = require('./authStrategies');

module.exports = {
  getData: connector.getData,
  validateAuth: connector.validateAuth,
  authStrategies
};