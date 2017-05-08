'use strict';
const authUtil = require('../utils/auth');

module.exports = {
  saveAuth: authUtil.saveAuth,
  setAuthToInvalid: authUtil.setAuthToInvalid,
  setAuthToValid: authUtil.setAuthToValid,
  checkForAuthLock: authUtil.checkForAuthLock
};
