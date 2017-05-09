const connector = require('./connector');
const authStrategies = require('./authStrategies');

module.exports = {
  getData: connector.getData,
  getFacebookPages: connector.getFacebookPages,
  validateAuth: connector.validateAuth,
  authStrategies
};