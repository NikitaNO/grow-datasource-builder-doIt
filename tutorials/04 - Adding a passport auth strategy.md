# 04 - Adding a passport auth strategy

In your index.js file we need to add an `authStrategies` property to our object we are exporting.

```
const BPromise = require('bluebird');
const request = BPromise.promisify(require('request'));
const _ = require('lodash');
module.exports = {
  getData: _getData,
  authStrategies: [
    {
      passport: {
        getStrategy() {
          return new strategy({
            clientID: config.clientId,
            clientSecret: config.secret,
            callbackURL: config.callback,
            passReqToCallback: true,
            display: 'popup'
          }, (req, accessToken, refreshToken, profile, done) => {
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
        }
      }
    }
  ]
};
```

Now that we have credentials we can use them to make an api call that uses oauth authentication. Lets change the _getData function to make a call to this TestDemo api.

```
function _getData(config) {
  const accessToken = _.get(config, 'auth.params.accessToken');
  const options = {
    url: 'https://www.testdemo.com/api/resource,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${auth}`
    }
  }
  return request(options);
}
```

