'use strict';
const FB                   = require('fb');
const moment               = require('moment');
const _                    = require('lodash');
const BPromise             = require('bluebird');
const async                = require('async');
const request              = BPromise.promisify(require('request'));
const FacebookErrorHandler = require('../error');
const fbUtils              = require('../utils');
const dsUtils              = require('../../utils');
const API_CALL_LIMIT       = 10;
const MakeFBPromisifyable  = (url, options, callback) => {
  FB.api(url, options, res => {
    if (res.error) {
      return callback(res.error);
    }
    return callback(null, res);
  });
};
const FBApi                = BPromise.promisify(MakeFBPromisifyable);

module.exports = {

  getData: function (config, page) {

    FB.setAccessToken(page.access_token);
    let urlStr = `/v2.7/${page.id}/feed`;

    return new BPromise(function (resolve, reject) {

      var startEndDates = dsUtils.splitDateRanges(config, 80);

      async.mapLimit(startEndDates, 3, getChunkedFBData, function (err, results) {
        if (err) {
          reject(FacebookErrorHandler.getError(err, config));
        } else {
          results = _.flatten(results);
          results = fbUtils.removeExtraneousDates(config, results);

          if (config.report.params.category === 'all-posts') {
            //we don't do anything here to filter out the results because we want all of them. We have to do it like this
            //because there were a handful of metrics were made with no category, and they are supposed to be the
            //most-recent ones which are defaulted at the end of this if-else chain. We also don't want to get the
            //reach for all of these posts, (since there could technically be hundreds or thousands) so we resolve right now.
            return resolve(results);
          } else if (config.report.params.category === 'most-recent') {
            //we arbitrarily chose 30 as the number of posts to return to the front-end. Part of this is because we have
            // to go get the reach for each of these posts, which is a separate call for each.
            results = _.take((_.sortBy(results, 'created_date').reverse()), 30);
          } else {
            //the metrics made before categories existed all default to the top 30 sorted by likes and comments
            results = _.take(_.sortBy(results, function (n) {
              return -(n.likes + n.comments);
            }), 30);
          }

          //make the 30 calls and put the info back onto each of the result objects...
          _getAllPostReach(results)
          .then(resolve)
          .catch(function (err) {
            reject(FacebookErrorHandler.getError(err, config));
          });
        }
      });


      function getChunkedFBData(startEndObj, callback) {
        var apiCallCount = 0;

        startEndObj.since = moment(startEndObj.since).unix();
        startEndObj.until = moment(startEndObj.until).unix();

        const _apiCall = (totalResults = [], nextPageUrl) => {
          if (++apiCallCount > API_CALL_LIMIT) {
            return resolve(totalResults);
          }
          var options    = fbUtils.setupOptions(config, startEndObj);
          options.limit  = 100;
          options.fields = 'comments.summary(true),likes.summary(true),from,message,picture,id,created_time,shares';

          const _handleRes = (res) => {
            res = toJSON(res);

            nextPageUrl = _.get(res, 'paging.next');
            let data    = _.get(res, 'data');
            if (data) {
              data = _cleanUpFacebookPost(data);
              if (_.isArray(data) && data.length > 0) {
                data         = fbUtils.makeDataMoreHumanReadable(data);
                totalResults = totalResults.concat(data);
                if (nextPageUrl) {
                  return _apiCall(totalResults, nextPageUrl);
                }
              }
            }
            return totalResults;
          };

          if (nextPageUrl) {
            return request(nextPageUrl).then(_handleRes);
          }

          return FBApi(urlStr, options)
          .then(_handleRes);
        };

        return _apiCall()
        .then(results => callback(null, results))
        .catch(err => callback(err.message, null));
      }
    });
  }
};


function _cleanUpFacebookPost(data) {
  return _.map(data, function (post) {
    let transformedIds = ['id', 'message', 'picture', 'likes', 'comments', 'created_time', 'from'];
    let otherFields    = _.omit(post, transformedIds);
    return _.merge({
      postId: post.id,
      message: post.message,
      picture: post.picture || '',
      likes: post.likes ? post.likes.summary.total_count : 0,
      comments: post.comments ? post.comments.summary.total_count : 0,
      created_date: post.created_time || 0,
      from: post.from
    }, otherFields);
  });
}


function _getAllPostReach(topPosts) {
  return BPromise.map(topPosts, _getReach);
}

function _getReach(post) {
  let urlStr = `/v2.7/${post.postId}/insights/post_impressions_unique`;
  return FBApi(urlStr, {})
  .then(res => {
    post.reach = _.get(res, 'data.0.values.0.value', 0);
    return post;
  });
}

function toJSON(res) {
  if (res.body) {
    res = res.body;
  }
  if (!_.isObject(res)) {
    res = _.attempt(JSON.parse, res);
    if (_.isError(res)) {
      throw (res);
    }
  }
  if (!res) {
    throw ('No Response');
  }
  if (res.error) {
    throw (res.error);
  }
  return res;
}
