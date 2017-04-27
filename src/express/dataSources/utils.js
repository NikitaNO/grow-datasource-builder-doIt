'use strict';
const fs       = require('fs');
const BPromise = require('bluebird');
const moment   = require('moment');
const _        = require('lodash');

BPromise.promisifyAll(fs);

const Utils = {

  /**
   * ONLY CALL THIS FUNCTION IF YOU ACTUALLY HAVE A TIMEZONEOFFSET TO BE CALCULATED
   *
   * @param start           a string in a format that moment can accept
   * @param end             a string in a format that moment can accept
   * @param timezoneOffset  a number for the timezoneOffset (example: -6, or 3, etc)
   * @param dateFormat      a string of the format you are expecting the date to be in (example: 'YYYY-MM-DD', or 'YYYY/MM/DD+HH:mm', etc)
   * @param startOfStr      a string of what the 'start of ___' was. (example: 'year', or 'month', or 'week', or 'day', etc)
   * @param isRolling       a boolean as to whether or not we are rolling or not. (look in the date picker directive for how isRolling is defined)
   * @returns {{start: String, end: String}} the strings in the format you specified
   */
  convertTimePeriods(start, end, timezoneOffset, dateFormat, startOfStr, isRolling) {

    let momentOfServer     = moment();
    let momentOfShop       = moment().add(timezoneOffset, 'hours');
    let timezoneOffsetSign = timezoneOffset >= 0 ? 1 : -1;
    start                  = moment(start);
    end                    = moment(end);

    //if the since had a 'start of ____' call in the date before interpolation, then we know we need to roll since back a whole ____ (year, month, quarter, etc)
    //until just needs to be adjusted according to the timezoneOffset though
    if (startOfStr) {
      if (!momentOfShop.isSame(momentOfServer, startOfStr)) {
        return {
          start: start.add(timezoneOffsetSign * 1, startOfStr).format(dateFormat),
          end: end.add(timezoneOffset, 'hours').format(dateFormat)
        };
      } else {
        //this case means they chose start of and the server and timezone are in the same unit of time (year|month|day, etc) but the until needs to
        //still be adjusted in case the shop is in the future
        return {
          start: start.format(dateFormat),
          end: end.add(timezoneOffset, 'hours').format(dateFormat)
        };
      }
    }

    //if they chose a custom daterange and included hours in the granularity, then we can just adjust the info by the timezoneOffset
    if (isRolling) {
      return {
        start: start.add(timezoneOffset, 'hours').format(dateFormat),
        end: end.add(timezoneOffset, 'hours').format(dateFormat)
      };
    }

    //this can occur even if they didn't choose a 'start of ____' on the frontend and needs to be taken care of on the day level
    if (!momentOfShop.isSame(momentOfServer, 'day')) {
      return {
        start: start.add(timezoneOffsetSign * 1, 'day').format(dateFormat),
        end: end.add(timezoneOffset, 'hours').format(dateFormat)
      };

    } else {
      return {
        start: start.format(dateFormat),
        end: end.add(timezoneOffset, 'hours').format(dateFormat)
      };
    }
  },


  /**
   * This method will decide on how to save the auth,
   * if the auth id is -1 then save it to the filesystem
   * otherwise it will save it in the db
   *
   * @param  {object} config JSON that holds config information
   * @param {object} options obviously some options
   * @return {promise}
   */
  saveAuth(config, options = {}) {
    return BPromise.resolve();
  },

  /**
   * This method will set the auth to invalid in the db
   * if it is a real record
   *
   * @param  {object} config JSON that holds config information
   * @return {promise}
   */
  setAuthToInvalid(config, options = {}) {
    return BPromise.resolve();
  },

  /**
   * This method will set the auth to valid in the db
   * if it is a real record
   *
   * @param  {object} config JSON that holds config information
   * @return {promise}
   */
  setAuthToValid(config) {
    return BPromise.resolve();
  },

  /**
   * Facebook and other datasources don't allow ranges that are more than a given number of days.  Here we split
   * up the range into smaller chunks.
   *
   * @returns {Array}
   */
  splitDateRanges: function (config, dateRange) {
    let since = config.report.params.since ? config.report.params.since : moment().subtract(10, 'days').format('YYYY-MM-DD');
    let until = config.report.params.until ? config.report.params.until : moment().format('YYYY-MM-DD');

    let daysDiff = moment(until).diff(since, 'days');

    if (daysDiff > dateRange) {

      let totalCalls  = Math.ceil(daysDiff / dateRange);
      let daysPerCall = Math.ceil(daysDiff / totalCalls);
      let starts      = [];

      for (let i = 0; i < totalCalls; i++) {
        starts.push(moment(since).add((daysPerCall * i), 'days').format('YYYY-MM-DD'));
      }

      let startAndEnds = [];

      for (let i = 1; i < totalCalls; i++) {
        startAndEnds.push({
          since: starts[i - 1],
          until: moment(starts[i]).subtract(1, 'days').format('YYYY-MM-DD')
        });
      }

      startAndEnds.push({
        since: _.last(starts),
        until: until
      });

      return startAndEnds;
    }

    return [{
      since: since,
      until: until
    }];

  },
  getMomentDateRangeArray: function (startDate, endDate, interval = 'days', total = 1) {
    let dateArray   = [];
    let currentDate = moment(_.clone(startDate));
    endDate         = moment(endDate);

    while (currentDate <= endDate) {
      dateArray.push(currentDate.format());
      currentDate = currentDate.clone().add(total, interval);
    }

    return dateArray;
  }
};


module.exports = Utils;
