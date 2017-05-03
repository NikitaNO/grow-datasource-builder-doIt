# 03 - Adding an oauth auth strategy

In your index.js file we need to add an `authStrategies` property to our object we are exporting.

```
const BPromise = require('bluebird');
const request = BPromise.promisify(require('request'));
const _ = require('lodash');
module.exports = {
  getData: _getData,
  authStrategies: [
    // We will add in 3 different auth strategies to make the oauth flow work
  ]
};
```

First we will ask for the host url, consumer key and secret:

```
{
  view: 'auth/TestDemoOAuth',
  saveDataSourceAuthParamsToReq(req) {
    return new BPromise(resolve => {
      req.dataSourceAuthParams = req.session.dataSourceAuthParams = {
        authInfo: {
          host: req.body.host,
          consumerKey: req.body.consumerKey,
          consumerSecret: req.body.consumerSecret
        }
      };
      resolve();
    });
  }
}
```

This object will define a `view` to display our html form. Navigate to the `/grow-datasource-builder/src/express/views/auth` folder and create file named `TestDemoOAuth.jade`.

We need to ask for the username and the password.

```
form(method='post', action='/api/data-source/auth/TestDemo/callback')
  input(type='hidden', name='_csrf', value='#{csrfToken}')
  input(type='text', name='host', placeholder='Host')
  input(type='text', name='consumerKey', placeholder='consumerKey')
  input(type='password', name='consumerSecret', placeholder='consumerSecret')
  input(type='submit', value='Submit')
```

When the form has been submitted it will call `/api/data-source/auth/TestDemo/callback`. It will then call the `saveDataSourceAuthParamsToReq` function in our authStrategy.

Then we will redirect to initiate the oauth flow:

```
{
  redirect(req) {
    const config = {
      auth: {
        params: req.session.dataSourceAuthParams.authInfo
      }
    };
    return _getRequestToken(config)
      .then(requestToken => {
        config.auth.params.requestToken = requestToken;
        req.session.dataSourceAuthParams.authInfo.requestToken = config.auth.params.requestToken;
        return _getRequestTokenUrl(config);
      });
  }
}
```

Then if everything goes well we will get an access token when it hits the callback url.

```
{
  saveDataSourceAuthParamsToReq(req) {
    return new BPromise(resolve => {
      req.dataSourceAuthParams = {
        authInfo: req.session.dataSourceAuthParams.authInfo,
        name: `TestDemo - ${req.session.dataSourceAuthParams.authInfo.host}`
      };
      let config = {
        auth: {
          params: req.dataSourceAuthParams.authInfo
        }
      };
      _getAccessToken(config)
        .then(accessToken => {
          req.dataSourceAuthParams.authInfo.accessToken = accessToken;
          resolve();
        });
    });
  }
}
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

Next:

[04 - Adding a passport auth strategy](./04 - Adding a passport auth strategy.md)