const BPromise = require('bluebird');
const request = BPromise.promisify(require('request'));
const _ = require('lodash');
const j2t = require('json-to-table');
const url = 'https://leads.irelo.io/apiJSON.php';

//Check response for erorrs

dataFilter = (object, path) => {
  const data = object.body;
  if (data.response.errors) {
    const errors = data.response.errors.join(' ');
    throw new Error(errors)
  }
  return j2t(_.get(data, path));
};

// Body building helper for queries

buildBody = (config, action) => {
  const apiKey = _.get(config, 'auth.params.apiKey');
  const params = config.report.params;
  const body = {
    Request: {
      Key: apiKey,
      API_Action: action,
      Format: "json"
    }
  };

  body.Request = _.assignIn({}, body.Request, params);

  return {
    url,
    body,
    method: 'POST',
    json: true
  }
};

// For add additional parameters in textarea field in the format below
// {
//   "Date_Start": "2000-01-15",
//   "Date_End": "2008-05-15",
//   "Lead_Type": "Lead_Type"
// }


_getFilterSetsAll = (config) => {
  const path = 'response.filter_sets.set';
  const options = buildBody(config, 'getFilterSetsAll');

  return request(options)
    .then(res => {
      return dataFilter(res, path);
    });
};

_getNumberOfLeads = (config) => {
  const path = 'response';
  const options = buildBody(config, 'getNumberOfLeads');

  return request(options)
    .then(res => {
      return dataFilter(res, path);
    });
};

_getPossibleSalePrice = (config) => {
  const path = 'response';
  const options = buildBody(config, 'getPossibleSalePrice');

  return request(options)
    .then(res => {
      return dataFilter(res, path);
    });
};

_getTransactionDetails = (config) => {
  const path = 'response';
  const options = buildBody(config, 'getTransactionDetails');

  return request(options)
    .then(res => {
      return dataFilter(res, path);
    });
};

_customLeadSalesBySourceReport = (config) => {
  const path = 'response';
  const options = buildBody(config, 'customLeadSalesBySourceReport');

  return request(options)
    .then(res => {
      return dataFilter(res, path);
    });
};

_validateAuth = (config) => {
  return BPromise.resolve();
};

module.exports = {
  getFilterSetsAll: _getFilterSetsAll,
  getNumberOfLeads: _getNumberOfLeads,
  getPossibleSalePrice: _getPossibleSalePrice,
  getTransactionDetails: _getTransactionDetails,
  customLeadSalesBySourceReport: _customLeadSalesBySourceReport,
  validateAuth: _validateAuth
};