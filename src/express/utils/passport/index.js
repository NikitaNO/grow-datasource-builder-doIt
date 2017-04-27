'use strict';
const passport    = require('passport');
const _           = require('lodash');
const dataSources = require('../../dataSources');
module.exports = {
  init() {
    _.each(dataSources, (dataSource, key) => {
      if (dataSource.authStrategies) {
        _.each(dataSource.authStrategies, authStrategy => {
          if (authStrategy.passport) {
            passport.use(key, authStrategy.passport.getStrategy());
          }
        });
      }
    });
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }
};
