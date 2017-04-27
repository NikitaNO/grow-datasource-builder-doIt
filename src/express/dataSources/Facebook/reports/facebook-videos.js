'use strict';
const FB                   = require('fb');
const moment               = require('moment');
const _                    = require('lodash');
const BPromise             = require('bluebird');
const fbUtils              = require('../utils');
const dsUtils              = require('../../utils');
const MakeFBPromisifyable  = (url, options, callback) => {

  FB.api(url, options, res => {
    if (res.error) {
      return callback(res.error);
    }
    return callback(null, res);
  });
};
const FBApi               = BPromise.promisify(MakeFBPromisifyable);

module.exports = {

  getData: function (config, page) {
    FB.setAccessToken(page.access_token);
    let urlStr = `/v2.7/${page.id}/videos`;

    let startEndDates = dsUtils.splitDateRanges(config, 80);

    return BPromise.map(startEndDates, date => {
      date.since    = moment(date.since).unix();
      date.until    = moment(date.until).unix();
      let options   = fbUtils.setupOptions(config, date);
      options.limit = 100;
      return FBApi(urlStr, options)
      .then(res => {
        return res.data;
      })
      .then(videos => {
        if (videos.length > 0) {
          return getVideoDetails(videos);
        }
        return;
      });
    }, {concurrency: 2})
    .then(results => {
      results = _.flattenDeep(results);
      results = fbUtils.removeExtraneousDates(config, results);

      return results;
    });
  }
};


function getVideoDetails(videos) {
  return BPromise.map(videos, video => {
    if (video.id) {
      let urlStr = `/v2.7/${video.id}/video_insights`;
      return FBApi(urlStr, {})
      .then(results => {
        let videoObj = {
          videoid: video.id,
          description: video.description
        };
        _.forEach(results.data, result => {
          _.merge(videoObj, {
            [result.name]: _.get(result, 'values.0.value')
          });
        });
        return videoObj;
      });
    }
  }, {concurrency: 2});
}

