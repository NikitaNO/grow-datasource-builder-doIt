const _                = require('lodash');
const BPromise         = require('bluebird');
const crypto           = require('crypto');
const request          = BPromise.promisify(require('request'));
const errors           = require('../../errors');
const smartsheetConfig = require('./config.json')['local'];
const j2t              = require('json-to-table');
const dsUtils          = require('../utils');
const BASE_URL         = 'https://api.smartsheet.com/2.0';

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
  const endpoint = _.get(config, 'report.params.endpoint', '/sheets');
  let options = {
    headers: {
      Authorization: `Bearer ${config.auth.params.accessToken}`
    },
    url: `${BASE_URL}${config.report.params.endpoint}`,
    method: 'GET'
  };
  if (config.report.params.sheetId) {
    options.url += `/${config.report.params.sheetId}`;
  }
  options.url += `?includeAll=true`;
  return request(options)
  .then(res => {
    let body = _.attempt(JSON.parse, _.get(res, 'body'));
    if (_.isError(body)) {
      throw new Error(`Error parsing response from Smartsheet: ${body.message}`);
    }
    if (res.statusCode >= 300) {
      if (body.errorCode === 1003) {
        throw new errors.AuthTokenExpiredError(body.message);
      }
      throw new Error(body.message || 'An issue with the smartsheet connection occurred');
    }
    return _manipulateResponse(body, config);
  })
  .then(response => {
    return config.report.params.sheetId ? response : j2t(response);
  })
  .catch(errors.AuthTokenExpiredError, err => {
    return _refreshAuthToken(config)
    .then(() => _getData(config));
  });
}

/**
 * The validate auth function. Use this to validate any auth params.
 * This will be called when creating an auth. If it fails the auth
 * will not be created
 * @param {object} config
 */
function _validateAuth(config) {
  //We just barely made a call using the accessToken, so it is okay
  //to just resolve
  return BPromise.resolve(true);
}

function _refreshAuthToken(config) {
  return dsUtils.checkForAuthLock(config.auth.id)
  .then(auth => {
    if (auth.locked) {
      let hash    = crypto.createHash('sha256').update(`${smartsheetConfig.clientSecret}|${config.auth.params.refreshToken}`).digest('hex');
      let options = {
        url: `${BASE_URL}/token?grant_type=refresh_token&refresh_token=${config.auth.params.refreshToken}&client_id=${smartsheetConfig.clientId}&hash=${hash}`,
        method: 'POST'
      };
      return request(options)
      .then(res => {
        let body = _.attempt(JSON.parse, _.get(res, 'body'));
        if (_.isError(body)) {
          throw new Error(`Error parsing response from Smartsheet: ${body.message}`);
        }
        if (res.statusCode >= 300) {
          //don't explicitly check for the expired token error here, otherwise we'd get into an infinite loop, so just throw generic error
          throw new Error(body.message || 'An issue with the smartsheet connection occurred');
        }
        return body;
      })
      .then(newAuthData => {
        config.auth.params.accessToken  = newAuthData.access_token;
        config.auth.params.refreshToken = newAuthData.refresh_token;
        return dsUtils.saveAuth(config);
      });
    } else {
      config.auth.params = auth.authInfo;
    }
  })
  .catch(err => {
    return dsUtils.setAuthToInvalid(config)
    .then(() => {
      throw err;
    });
  });
}

function _manipulateResponse(body, config) {
  if (config.report.params.endpoint === '/users/me') {
    return body;
  }
  if (config.report.params.sheetId) {
    let headerRow = _.map(body.columns, 'title');
    let dataRows  = _.map(body.rows, row => {
      return _.map(row.cells, (cellDetails => {
        //this catches certain problems, like dateFields don't have a .displayValue, just a .value
        return cellDetails.displayValue || cellDetails.value;
      }));
    });
    return [headerRow].concat(dataRows);
  }
  return body.data;
}
