const BPromise       = require('bluebird');
const _              = require('lodash');
const reports        = require('./reports');
const FB             = require('fb');
const dsUtils        = require('../utils');
const errors         = require('../../errors');
const facebookConfig = require('./config.json')['local'];
const strategy       = require('passport-facebook').Strategy;
const fbErrors       = require('./error');
const j2t            = require('json-to-table');
const fbUtils        = require('./utils');

module.exports = {
  config: facebookConfig,
  id: 1,
  runMetricsSeriallyByAuthId: true,
  runReportsSerially: true,
  getData: _getData,
  validateAuth: _validateAuth,
  getFacebookPages: _getFacebookPages,
  authStrategies: [
    {
      passport: {
        getStrategy() {
          return new strategy({
            clientID: facebookConfig.id,
            clientSecret: facebookConfig.secret,
            callbackURL: facebookConfig.callback,
            passReqToCallback: true,
            display: 'popup',
            scope: ['manage_pages', 'read_insights', 'read_stream', 'ads_read']
          }, (req, accessToken, refreshToken, profile, done) => {
            //Run an api call to get the extended token
            FB.api('oauth/access_token', {
              client_id: facebookConfig.id,
              client_secret: facebookConfig.secret,
              grant_type: 'fb_exchange_token',
              fb_exchange_token: accessToken
            },  res => {
              if (!res || res.error) {
                return done(null, false);
              }
              req.dataSourceAuthParams = {
                authInfo: {
                  accessToken: res.access_token,
                  expires: (res.expires ? res.expires : 0),
                  refreshToken: refreshToken,
                  profile_id: profile.id
                },
                name: profile.username || profile.displayName
              };
              return done(null, {});
            });
          });
        },
        options: {
          display: 'popup'
        }
      }
    }
  ],
  replaceCertainReportParams: _replaceCertainReportParams
};

function _getData(config) {
  if (!config.report.params.pageId && !config.report.params.selectAllPages) {
    config.report.params.selectAllPages = true;
  }
  if (config.report.params.pageId && !config.report.params.selectedPages) {
    config.report.params.selectedPages = [{id: config.report.params.pageId}];
  }
  return _getFacebookPages(config.auth.params)
  .then(pages => {
    if (!config.report.params.selectAllPages) {
      pages = _.filter(pages, page => {
        return _.find(config.report.params.selectedPages, { id: page.id });
      });
    }
    config.report.params.selectedPages = pages;
    return BPromise.map(pages, page => {
      return new BPromise((resolve, reject) => {
        reports[config.report.type || 'insights'].getData(config, page)
        .then(results => {
          resolve(results);
        })
        .catch(errors.OAuthError, err => {
          dsUtils.setAuthToInvalid(config)
          .then(() => {
            reject(err);
          });
        })
        .catch(err => {
          reject(err);
        });
      })
      .then(rows => {
        if (config.report.params.selectedPages.length > 1) {
          return _.map(rows, row => {
            return _.merge(row, {page_name: page.name});
          });
        }
        return rows;
      });
    }, {concurrency: 1})
    .then(_.flatten)
    .then(results => {
      return j2t(results, {
        checkKeyBeforePath: true,
        defaultVal: 0
      });
    })
    .then(results => {
      if (config.report.params.name === 'page_fans_by_like_source_unique') {
        results[0] = _.map(results[0], key => {
          return _.startCase(key);
        });
      }
      if (fbUtils.shouldOnlyReturnLastDate(config) && config.report.params.name !== 'videos') {
        return [_.head(results), _.last(results)];
      } else {
        return results;
      }
    });
  });
}

function _getFacebookPages(dsAuth) {
  var profileId = dsAuth.profile_id || dsAuth.authInfo.profile_id;
  return new BPromise((resolve, reject) => {
    FB.setAccessToken(dsAuth.accessToken || dsAuth.authInfo.accessToken);
    FB.api(`/v2.5/${profileId}/accounts?limit=1500`, data => {
      if (data && data.error) {
        reject(fbErrors.getError(data.error, dsAuth));
      } else {
        resolve(_.sortBy(data.data, 'name'));
      }
    });
  })
  .then(results => {
    var idChunks = _.chunk(_.map(results, 'id'), 50);
    return BPromise.each(idChunks, ids => {
      return new BPromise((resolve, reject) => {
        ids = ids.join(',');
        FB.api(`/v2.5/?ids=${ids}&fields=location`, locationData => {
          if (locationData && locationData.error) {
            return resolve();
          }
          results = _.map(results, account => {
            let location = locationData[account.id];
            if (location && location.location) {
              let street = (location.location.street) ? location.location.street : '';
              let city   = (location.location.city) ? location.location.city : '';
              let state  = (location.location.state) ? location.location.state : '';
              account.name += ` - ${street} ${city} ${state}`;
            }
            return account;
          });
          resolve();
        });
      });
    })
    .thenReturn(results);
  })
  .catch(errors.OAuthError, err => {
    const config = {
      auth: dsAuth
    };
    dsUtils.setAuthToInvalid(config);
    throw err;
  });
}

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

function _replaceCertainReportParams(preConfigured, templateParams) {
  preConfigured.report.params.selectedPages = templateParams.selectedPages;
  return preConfigured;
}