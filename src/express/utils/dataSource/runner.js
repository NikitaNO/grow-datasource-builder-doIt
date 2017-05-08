const dataSources = require('../../dataSources');
const _ = require('lodash');
const authUtil = require('../auth');

module.exports = {
  run: _run
};

async function _run(dataSourceName, params) {
  const dataSource = dataSources[dataSourceName];
  if (!dataSource) {
    throw new Error(`Datasource ${dataSourceName} is not defined`);
  }
  if (!dataSource.getData) {
    throw new Error(`Datasource ${dataSourceName} getData is not defined`);
  }
  const authParams = await authUtil.findById(_.get(params, 'authId'));
  const config = {
    auth: {
      id: _.get(authParams, '_id'),
      params: _.get(authParams, 'authInfo')
    },
    report: {
      params: _.get(params, 'reportParams')
    }
  };
  return _getData(dataSource, config);
}

async function _getData(dataSource, config) {
  const data = await dataSource.getData(config);
  return data;
}