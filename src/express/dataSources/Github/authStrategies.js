const strategy = require('passport-github').Strategy;
const config = require('./config.json')['local'];
module.exports = [
  {

    /**
     * To signify that this auth strategy is made with Passport. Give it
     * the property of "passport"
     */
    passport: {

      /**
       * This auth strategy is made with Passport. It must contain a function that
       * will return a new Passport Strategy.
       */
      getStrategy() {

        //Create a new Passport Strategy giving it our Facebook client app info
        return new strategy({
          clientID: config.clientId,
          clientSecret: config.clientSecret,
          callbackURL: config.callback,
          userAgent: config.userAgent,
          scope: ['user', 'repo', 'read:org'],
          passReqToCallback: true
        }, (req, accessToken, refreshToken, profile, done) => {

          //To save this auth data into a new auth object we must create this structure on 
          //the req object
          req.dataSourceAuthParams = {
            authInfo: {
              githubId: profile.id,
              accessToken: accessToken,
              username: profile.username
            },
            name: profile.username
          };

          //Once we are done we can call the Passport done function
          //It will then return and save our new auth
          return done(null, {});
        });
      }
    }
  }
];