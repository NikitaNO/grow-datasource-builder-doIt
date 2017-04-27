'use strict';
const _      = require('lodash');
const moment = require('moment');

module.exports = {

  shouldOnlyReturnLastDate: function (config) {
    return !config.report.params.since || !config.report.params.until;
  },

  /**
   * The way that facebook returns week/days_28 data is that every day is returned with the last 7/28 days worth of insights calculated for it.
   * Our users only want to see new week/month, so this will remove the ones that we don't want to see
   */
  removeExtraneousDates: function (config, data) {
    if (config.report.params.period === 'lifetime' || config.report.params.period === 'day') {
      return data;
    }
    var periodSize = config.report.params.period === 'week' ? 7 : 28;
    return _.filter(data.reverse(), function (obj, index) {
      return index % periodSize === 0;
    }).reverse();
  },

  /**
   *
   * @param config - the whole config passed in from the frontend
   * @param startEndObj - we need this split out of the config because of the way facebook
   *              differentiates lifetime periods from the other period types
   * @returns {Object} options are what facebook is expecting
   */
  setupOptions: function (config, startEndObj) {

    var options = {
      period: config.report.params.period
    };

    if (startEndObj.until) {
      options.until = startEndObj.until;
    }
    if (startEndObj.since) {
      options.since = startEndObj.since;
    }
    return options;
  },

  makeDataMoreHumanReadable: function (data) {
    return _.map(data, function (dataChunk) {
      if (dataChunk.end_time) {
        dataChunk.end_time = moment(dataChunk.end_time).format('YYYY-MM-DD');
      }
      if (dataChunk.created_date) {
        dataChunk.created_date = moment(dataChunk.created_date).format('YYYY-MM-DD');
      }
      if (_.isObject(dataChunk.value)) {
        _.extend(dataChunk, dataChunk.value);
        delete dataChunk.value;
      }
      return dataChunk;
    });
  }

};

function _getOriginalSince(config) {
  return config.report.params.since ? config.report.params.since : moment().subtract(10, 'days').format('YYYY-MM-DD');
}

function _getOriginalUntil(config) {
  return config.report.params.until ? config.report.params.until : moment().format('YYYY-MM-DD');
}
