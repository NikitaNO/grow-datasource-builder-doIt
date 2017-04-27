'use strict';
const _                    = require('lodash');
const FB                   = require('fb');
const async                = require('async');
const moment               = require('moment');
const BPromise             = require('bluebird');
const FacebookErrorHandler = require('../error');
const fbUtils              = require('../utils');
const dsUtils              = require('../../utils');
const API_CALL_LIMIT       = 10;


module.exports = {

  getData: function (config, page) {
    
    const insight = _.get(config, 'report.params.name', 'page_fan_adds');

    FB.setAccessToken(page.access_token);
    let urlStr = `/v2.5/${page.id}/insights/${insight}`;

    return new BPromise((resolve, reject) => {

      var startEndDates = dsUtils.splitDateRanges(config, 80);

      async.map(startEndDates, getChunkedFBData, (err, results) => {
        if (err) {
          return reject(FacebookErrorHandler.getError(err, config));
        }
        results = _.flatten(results);
        results = fbUtils.removeExtraneousDates(config, results);

        if (config.report.params.summed) {
          results = _.reduce(results, (summedResults, row) => {
            //Take off end_date
            row = _.omit(row, 'end_time');
            //Go through every property
            _.each(_.keysIn(row), prop => {
              if (!summedResults[prop]) {
                summedResults[prop] = _.sum(_.map(results, prop));
              }
            });
            return summedResults;
          }, {});
        }
        resolve(results);
      });


      function getChunkedFBData(startEndObj, callback) {
        let apiCallCount = 0;

        startEndObj.since = moment(startEndObj.since).unix();
        startEndObj.until = moment(startEndObj.until).unix();


        let _apiCall = () => {
          if (++apiCallCount > API_CALL_LIMIT) {
            return callback(null, []);
          }
          var options = fbUtils.setupOptions(config, startEndObj);

          FB.api(urlStr, options, res => {
            if (!res) {
              return callback('No Response');
            }
            if (res.error) {
              return callback(res.error);
            }
            if (!_.isArray(res.data)) {
              return callback(null, []);
            }
            let data = _.get(res, 'data.0.values');
            if (!_.isArray(data) || data.length === 0) {
              return callback(null, []);
            }
            return callback(null, fbUtils.makeDataMoreHumanReadable(data));
          });
        };

        return _apiCall(startEndObj.since);
      }
    });
  }
};
