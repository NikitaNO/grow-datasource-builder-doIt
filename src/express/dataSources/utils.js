'use strict';
const fs       = require('fs');
const BPromise = require('bluebird');
const moment   = require('moment');
const _        = require('lodash');

module.exports = {

  /**
   * This method will decide on how to save the auth,
   * if the auth id is -1 then save it to the filesystem
   * otherwise it will save it in the db
   *
   * @param  {object} config JSON that holds config information
   * @param {object} options obviously some options
   * @return {promise}
   */
  saveAuth(config, options = {}) {
    return BPromise.resolve();
  },

  /**
   * This method will set the auth to invalid in the db
   * if it is a real record
   *
   * @param  {object} config JSON that holds config information
   * @return {promise}
   */
  setAuthToInvalid(config, options = {}) {
    return BPromise.resolve();
  },

  /**
   * This method will set the auth to valid in the db
   * if it is a real record
   *
   * @param  {object} config JSON that holds config information
   * @return {promise}
   */
  setAuthToValid(config) {
    return BPromise.resolve();
  }
  
};
