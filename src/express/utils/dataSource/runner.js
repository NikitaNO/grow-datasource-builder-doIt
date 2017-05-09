const _ = require('lodash');
const j2t = require('json-to-table');
const auth = require('./auth');

module.exports = {
  run: _run
};

/**
 * params
 * authId - The authentication to use
 * reportParams - parameters the datasource will use to make api calls
 */

/**
 * This will run a function on a datasource
 * @param {object} dataSource
 * @param {string} dataSourceName
 * @param {object} params
 */
async function _run(dataSource, functionName, params) {
  if (!_.has(dataSource, functionName)) {
    throw new Error(`Datasource ${functionName} is not defined`);
  }
  const authParams = await auth.findById(_.get(params, 'authId'));
  const config = {
    auth: {
      id: _.get(authParams, '_id'),
      params: _.get(authParams, 'authInfo')
    },
    report: {
      params: _.get(params, 'reportParams')
    }
  };
  const data = await dataSource[functionName](config);
  if (_.isArray(data) && !_.isArray(_.head(data))) {
    return j2t(data);
  } else if (!_.isArray(data)) {
    return [j2t(data)];
  }
  return data;
}