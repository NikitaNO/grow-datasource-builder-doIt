const BPromise = require('bluebird');
const _        = require('lodash');
const FB       = require('fb');
const j2t      = require('json-to-table');
const moment   = require('moment');
const dsUtils  = require('../utils');
const errors   = require('../../errors');

module.exports = {
  getData: _getData,
  getFacebookPages: _getFacebookPages,
  validateAuth: _validateAuth
};

/**
 * The entry point to make api calls and return table data
 * @param {object} config
 * @return {array}
 */
function _getData(config) {
  return _getFacebookPages(config)
  .then(pages => _getInsights(config, pages))
  .then(_.flatten)
  .then(results => {
    return j2t(results, {
      checkKeyBeforePath: true,
      defaultVal: 0
    });
  })
  .catch(errors.OAuthError, err => {
    return dsUtils.setAuthToInvalid(config)
      .then(() => {
        throw err;
      });
  });
}

/**
 * The validate auth function. Use this to validate any auth params.
 * This will be called when creating an auth. If it fails the auth
 * will not be created
 * @param {object} config
 */
function _validateAuth(config) {
  return new BPromise((resolve, reject) => {
    FB.setAccessToken(config.auth.params.accessToken);
    FB.api(`/${config.auth.params.profile_id}/accounts`, data => {
      if (data && data.error) {
        if (data.error.code === 'ETIMEDOUT') {
          reject('Request to facebook timed out');
        } else {
          reject(data.error);
        }
      } else {
        resolve();
      }
    });
  });
}

/**
 * This will return all pages the user has access to
 * @param {object} config
 */
function _getFacebookPages(config) {
  return new BPromise((resolve, reject) => {
    FB.setAccessToken(config.auth.params.accessToken);
    FB.api(`/v2.5/${config.auth.params.profile_id}/accounts?limit=1500`, data => {
      if (data && data.error) {
        reject(_getError(data.error));
      } else {
        resolve(_.sortBy(data.data, 'name'));
      }
    });
  })
  .then(pages => {
    const pageIds = _.chunk(_.map(pages, 'id'), 50);
    return BPromise.each(pageIds, ids => {
      return new BPromise(resolve => {
        ids = ids.join(',');
        FB.api(`/v2.5/?ids=${ids}&fields=location`, locationData => {
          if (locationData && locationData.error) {
            return resolve();
          }
          pages = _.map(pages, page => {
            let location = locationData[page.id];
            if (location && location.location) {
              let street = (location.location.street) ? location.location.street : '';
              let city   = (location.location.city) ? location.location.city : '';
              let state  = (location.location.state) ? location.location.state : '';
              page.name += ` - ${street} ${city} ${state}`;
            }
            return page;
          });
          resolve();
        });
      });
    })
    .thenReturn(pages);
  });
}

/**
 * This will make the api call to get insights for each page the
 * user has access to
 * @param {object} config
 * @param {array} pages
 */
function _getInsights(config, pages) {
  const insight = _.get(config, 'report.params.name', 'page_fan_adds');
  return BPromise.map(pages, page => {
    const urlStr = `/v2.5/${page.id}/insights/${insight}`;
    FB.setAccessToken(page.access_token);
    return new BPromise((resolve, reject) => {
      const options = {
        period: _.get(config, 'report.params.period', 'day')
      };
      if (_.has(config, 'report.params.until')) {
        options.until = moment(config.report.params.until).unix();
      }
      if (_.has(config, 'report.params.since')) {
        options.since = moment(config.report.params.since).unix();
      }
      FB.api(urlStr, options, res => {
        if (!res) {
          return reject(_getError('No Response'));
        }
        if (res.error) {
          return reject(_getError(res.error));
        }
        if (!_.isArray(res.data)) {
          return resolve([]);
        }
        let data = _.get(res, 'data.0.values');
        if (!_.isArray(data) || data.length === 0) {
          return resolve(null, []);
        }
        data = _.map(data, row => {
          if (row.end_time) {
            row.end_time = moment(row.end_time).format('YYYY-MM-DD');
          }
          if (row.created_date) {
            row.created_date = moment(row.created_date).format('YYYY-MM-DD');
          }
          if (_.isObject(row.value)) {
            _.extend(row, row.value);
            delete row.value;
          }
          return row;
        });
        return resolve(data);
      });
    })
    .then(rows => {
      return _.map(rows, row => {
        return _.merge(row, {page_name: page.name});
      });
    });
  }, {concurrency: 1});
}

/**
 * This will check some error information and create an error object
 * @param {object} err
 */
function _getError(err) {
  let error = new Error('An error has occurred with the Facebook Connector.');
  if (_.isString(err)) {
    error = new Error(err);
  } else if (_.isString(err.message)) {
    error = new Error(err.message + '\nPotentially a bad pageId or you dont have \npermissions on the pageId');
  } else if (err.code === 190 || err.code === 102) {
    error = new errors.OAuthError('Authentication has failed. OAuth has expired or is invalid.');
  } else if (err.error_user_title && err.error_user_msg) {
    error = new Error(`${err.error_user_title}: ${err.error_user_msg}`);
  }
  return error;
}