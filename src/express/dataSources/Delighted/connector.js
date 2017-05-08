'use strict';
const _            = require('lodash');
const BPromise     = require('bluebird');
const request      = BPromise.promisify(require('request'));
const j2t          = require('json-to-table');
const moment       = require('moment');
const errors       = require('../../errors');
const PER_PAGE_MAX = 100;

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
  const allOptionCalls = _createRequestOptions(config);
  return BPromise.map(allOptionCalls, options => {
    return _requestByPage(config, options, 1, []);
  })
  .then(_.flatten)
  .then(allResponses => {
    _.forEach(allResponses, record => {
      if (record.unsubscribed_at) {
        record.unsubscribed_at = moment.unix(record.unsubscribed_at).format('YYYY-MM-DD HH:mm:ss');
      }
      if (record.bounced_at) {
        record.bounced_at = moment.unix(record.bounced_at).format('YYYY-MM-DD HH:mm:ss');
      }
    });
    return j2t(allResponses);
  });
}

/**
 * The validate auth function. Use this to validate any auth params.
 * This will be called when creating an auth. If it fails the auth
 * will not be created
 * @param {object} config
 */
function _validateAuth(config) {
  config.report = {
    type: 'delighted',
    params: {
      endpoint: 'metrics',
      since: moment().startOf('day').format('YYYY-MM-DD'),
      until: moment().format('YYYY-MM-DD')
    }
  };
  return _getData(config);
}

/**
 * This will make an api call to collect all the pages
 */
function _requestByPage(config, options, pageNum, allData) {
  options.qs.page = pageNum;
  return request(options)
  .then(response => {
    let body = _.attempt(JSON.parse, response.body);
    if (_.isError(body)) {
      throw body;
    }
    if (body.status >= 400) {
      if (body.status === 401) {
        throw new errors.AuthError(body.message);
      }
      throw new Error(body.message);
    }
    if (config.report.params.endpoint === 'metrics') {
      body.since = options.since;
      body.until = options.until;
    }
    allData = allData.concat(body);
    if (body.length === PER_PAGE_MAX) {
      return _requestByPage(config, options, ++pageNum, allData);
    }
    return allData;
  });
}

/**
 * This will create all the request options. An example of handling a Basic auth.
 */
function _createRequestOptions(config) {
  const apiKey = _.get(config, 'auth.params.apiKey');
  const endpoint = _.get(config, 'report.params.endpoint', 'metrics');
  const base64Auth = new Buffer(`${apiKey}:`).toString('base64');

  if (!config.report.params.breakdownByMonth) {
    let since = moment(config.report.params.since);
    let until = moment(config.report.params.until);

    return [{
      method: 'GET',
      url: `https://api.delighted.com/v1/${endpoint}.json`,
      qs: {
        since: since.format('X'),
        until: until.format('X'),
        per_page: PER_PAGE_MAX
      },
      headers: {
        Authorization: `Basic ${base64Auth}`
      },
      since: since.format('YYYY-MM-DD'),
      until: until.format('YYYY-MM-DD')
    }];
  }

  let previousMonthOptions = _.map(_.range(0, 13), num => {
    let since = moment().startOf('month').subtract(num, 'months');
    let until = moment().startOf('month').subtract(num - 1, 'months');
    if (num === 0) {
      since = moment().startOf('month');
      until = moment();
    }
    return {
      method: 'GET',
      url: `https://api.delighted.com/v1/${endpoint}.json`,
      qs: {
        since: since.format('X'),
        until: until.format('X'),
        per_page: PER_PAGE_MAX
      },
      headers: {
        Authorization: `Basic ${base64Auth}`
      },
      since: since.format('YYYY-MM-DD'),
      until: until.format('YYYY-MM-DD')
    };
  });

  return previousMonthOptions;
}