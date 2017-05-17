const BPromise = require('bluebird');
const request = BPromise.promisify(require('request'));
const _ = require('lodash');
const j2t = require('json-to-table');

module.exports = {
  getData: _getData,
  validateAuth: _validateAuth
};

/**
 * The entry point to make api calls and return table data
 * @param {object} config
 * @return {array}
 */
function _getData(config) {
  const data = [
    {
      id: 1,
      name: 'Test',
      city: 'Dallas'
    },
    {
      id: 2,
      name: 'Testing',
      city: 'Austin'
    },
    {
      id: 3,
      name: 'Tester',
      city: 'Fort Collins'
    }
  ];
  return BPromise.resolve(j2t(data));
}

/**
 * The validate auth function. Use this to validate any auth params.
 * This will be called when creating an auth. If it fails the auth
 * will not be created
 * @param {object} config
 */
function _validateAuth(config) {
  return BPromise.resolve();
}