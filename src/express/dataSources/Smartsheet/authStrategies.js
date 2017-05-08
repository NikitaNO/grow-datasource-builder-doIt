const strategy  = require('passport-smartsheet').Strategy;
const config    = require('./config.json')['local'];
const connector = require('./connector');
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
          scope: ['READ_SHEETS', 'READ_SIGHTS', 'READ_USERS', 'READ_CONTACTS'],
          tokenURL: 'https://api.smartsheet.com/2.0/token',
          passReqToCallback: true
        }, (req, accessToken, refreshToken, profile, done) => {

          //At this point we have the access token and refresh token
          let config = {
            auth: {
              params: {
                accessToken
              }
            },
            report: {
              params: {
                endpoint: '/users/me'
              }
            }
          };

          //Make a call to get the users account name and email
          connector.getData(config)
          .then(user => {

            //To save this auth data into a new auth object we must create this structure on 
            //the req object
            req.dataSourceAuthParams = {
              authInfo: {
                accessToken,
                refreshToken
              }
            };
            let accountName = _.get(user, 'account.name');
            req.dataSourceAuthParams.name = accountName ? `${accountName} - ${user.email}` : user.email;

            //Once we are done we can call the Passport done function
            //It will then return and save our new auth
            return done(null, {});
          });
        });
      }
    }
  }
];