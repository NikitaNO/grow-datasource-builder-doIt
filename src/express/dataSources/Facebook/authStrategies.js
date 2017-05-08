const FB       = require('fb');
const strategy = require('passport-facebook').Strategy;
const config   = require('./config.json')['local'];

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
          clientID: config.id,
          clientSecret: config.secret,
          callbackURL: config.callback,
          passReqToCallback: true,
          display: 'popup',
          scope: ['manage_pages', 'read_insights', 'read_stream', 'ads_read']
        }, (req, accessToken, refreshToken, profile, done) => {

          //At this point the user has gone through the OAuth flow. Facebook will
          //give us a short lived token. To get a long lived token we must make this api call
          FB.api('oauth/access_token', {
            client_id: config.id,
            client_secret: config.secret,
            grant_type: 'fb_exchange_token',
            fb_exchange_token: accessToken
          },  res => {
            if (!res || res.error) {
              return done(null, false);
            }

            //To save this auth data into a new auth object we must create this structure on 
            //the req object
            req.dataSourceAuthParams = {
              authInfo: {
                accessToken: res.access_token,
                expires: (res.expires ? res.expires : 0),
                refreshToken: refreshToken,
                profile_id: profile.id
              },
              name: profile.username || profile.displayName
            };

            //Once we are done we can call the Passport done function
            //It will then return and save our new auth
            return done(null, {});
          });

        });
      },

      /**
       * Any other additional options to use with Passport
       */
      options: {
        display: 'popup'
      }
    }
  }
];