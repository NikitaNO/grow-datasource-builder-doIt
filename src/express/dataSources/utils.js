const { auth } = require('../utils/dataSource');
module.exports = {
  saveAuth: auth.saveAuth,
  setAuthToInvalid: auth.setAuthToInvalid,
  setAuthToValid: auth.setAuthToValid,
  checkForAuthLock: auth.checkForAuthLock
};
