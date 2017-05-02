# Facebook Auth Example

This example has only one auth strategy. It will start the oauth flow for facebook and handle the callback itself. It will then make a call to get a longer access token.

```
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
]
```