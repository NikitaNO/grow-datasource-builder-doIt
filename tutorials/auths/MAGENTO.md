# Magento Auth Example

This example has 3 auth strategies.

```
authStrategies: [
  {
    view: 'auth/magento.html',
    defaultAuthParams: {
      host: '',
      adminHost: '',
      consumerKey: '',
      consumerSecret: ''
    },
    saveDataSourceAuthParamsToReq(req) {
      return new BPromise(resolve => {
        req.dataSourceAuthParams = req.session.dataSourceAuthParams = {
          authInfo: {
            host: req.body.host,
            adminHost: req.body.adminHost,
            consumerKey: req.body.consumerKey,
            consumerSecret: req.body.consumerSecret,
            oauthInitiateUrl: req.body.oauthInitiateUrl,
            oauthTokenUrl: req.body.oauthTokenUrl,
            restApiUrl: req.body.restApiUrl
          }
        };
        resolve();
      });
    }
  },
  {
    redirect(req, _conn = connector) {
      let config = {
        auth: {
          params: req.session.dataSourceAuthParams.authInfo
        }
      };
      return _conn.getRequestToken(config)
      .then(results => {
        let body = _.get(results, '0.body');
        //Checking for errors. If there is an oauth paramter absent
        if (body.indexOf('oauth_parameters_absent') > -1 ||
          body.indexOf('oauth_problem') > -1) {
          throw new errors.OAuthError(body);
        }
        let oauthParts                                         = body.split('&');
        config.auth.params.requestToken                        = {
          oauth_token: oauthParts[0].substring(oauthParts[0].indexOf('=') + 1),
          oauth_token_secret: oauthParts[1].substring(oauthParts[1].indexOf('=') + 1),
          oauth_callback_confirmed: oauthParts[2].substring(oauthParts[2].indexOf('=') + 1)
        };
        //Save it on the session also
        req.session.dataSourceAuthParams.authInfo.requestToken = config.auth.params.requestToken;
        return _conn.getRequestTokenUrl(config);
      });
    }
  },
  {
    saveDataSourceAuthParamsToReq(req, _conn) {
      _conn = _conn || connector;
      return new BPromise(resolve => {
        req.dataSourceAuthParams                        = {
          authInfo: req.session.dataSourceAuthParams.authInfo,
          name: `Magento - ${req.session.dataSourceAuthParams.authInfo.host}`
        };
        req.dataSourceAuthParams.authInfo.tokenVerifier = {
          oauth_token: req.query.oauth_token,
          oauth_verifier: req.query.oauth_verifier
        };
        let config                                      = {
          auth: {
            params: req.dataSourceAuthParams.authInfo
          }
        };
        _conn.getAccessToken(config)
        .then(results => {
          let body       = _.get(results, '0.body');
          let oauthParts = body.split('&');
          let oauthToken = oauthParts[0].substring(oauthParts[0].indexOf('=') + 1);
          if (oauthToken === 'token_rejected') {
            req.dataSourceAuthParams = new Error('Access has been rejected');
            return resolve();
          }
          req.dataSourceAuthParams.authInfo.accessToken = {
            oauth_token: oauthToken,
            oauth_token_secret: oauthParts[1].substring(oauthParts[1].indexOf('=') + 1)
          };
          resolve();
        });
      });
    }
  }
]
```

First it brings up a form to collect information about hosts and oauth keys.

```
{
  view: 'auth/magento.html',
  defaultAuthParams: {
    host: '',
    adminHost: '',
    consumerKey: '',
    consumerSecret: ''
  }
}
```

The html for this:

```
<form id="LoginForm" method="post" action="/api/data-source/auth/Magento/callback">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>">
  <input type="text" name="host" placeholder="Host URL" /><br/>
  <input type="text" name="adminHost" placeholder="Admin Host URL" /><br/>
  <input type="text" name="oauthInitiateUrl" placeholder="OAuth Initiate URL (Optional)" /><br/>
  <input type="text" name="oauthTokenUrl" placeholder="OAuth Token URL (Optional)" /><br/>
  <input type="text" name="restApiUrl" placeholder="Rest API URL (Optional)" /><br/>
  <input type="text" name="consumerKey" placeholder="Consumer Key" /><br/>
  <input type="text" name="consumerSecret" placeholder="Consumer Secret" /><br/>
  <input type="submit" value="Submit" class="btn btn-primary">
</form>
```

Then it would collect the information about the Magento server:

```
{
  saveDataSourceAuthParamsToReq(req) {
    return new BPromise(resolve => {
      req.dataSourceAuthParams = req.session.dataSourceAuthParams = {
        authInfo: {
          host: req.body.host,
          adminHost: req.body.adminHost,
          consumerKey: req.body.consumerKey,
          consumerSecret: req.body.consumerSecret,
          oauthInitiateUrl: req.body.oauthInitiateUrl,
          oauthTokenUrl: req.body.oauthTokenUrl,
          restApiUrl: req.body.restApiUrl
        }
      };
      resolve();
    });
  }
}
```

Then we want it to redirect to start the oauth flow:

```
{
  redirect(req, _conn = connector) {
    let config = {
      auth: {
        params: req.session.dataSourceAuthParams.authInfo
      }
    };
    return _conn.getRequestToken(config)
    .then(results => {
      let body = _.get(results, '0.body');
      //Checking for errors. If there is an oauth paramter absent
      if (body.indexOf('oauth_parameters_absent') > -1 ||
        body.indexOf('oauth_problem') > -1) {
        throw new errors.OAuthError(body);
      }
      let oauthParts                                         = body.split('&');
      config.auth.params.requestToken                        = {
        oauth_token: oauthParts[0].substring(oauthParts[0].indexOf('=') + 1),
        oauth_token_secret: oauthParts[1].substring(oauthParts[1].indexOf('=') + 1),
        oauth_callback_confirmed: oauthParts[2].substring(oauthParts[2].indexOf('=') + 1)
      };
      //Save it on the session also
      req.session.dataSourceAuthParams.authInfo.requestToken = config.auth.params.requestToken;
      return _conn.getRequestTokenUrl(config);
    });
  }
}
```

Then we want to capture all the tokens that come back:

```
{
  saveDataSourceAuthParamsToReq(req) {
    return new BPromise(resolve => {
      req.dataSourceAuthParams                        = {
        authInfo: req.session.dataSourceAuthParams.authInfo,
        name: `Magento - ${req.session.dataSourceAuthParams.authInfo.host}`
      };
      req.dataSourceAuthParams.authInfo.tokenVerifier = {
        oauth_token: req.query.oauth_token,
        oauth_verifier: req.query.oauth_verifier
      };
      let config                                      = {
        auth: {
          params: req.dataSourceAuthParams.authInfo
        }
      };
      _conn.getAccessToken(config)
      .then(results => {
        let body       = _.get(results, '0.body');
        let oauthParts = body.split('&');
        let oauthToken = oauthParts[0].substring(oauthParts[0].indexOf('=') + 1);
        if (oauthToken === 'token_rejected') {
          req.dataSourceAuthParams = new Error('Access has been rejected');
          return resolve();
        }
        req.dataSourceAuthParams.authInfo.accessToken = {
          oauth_token: oauthToken,
          oauth_token_secret: oauthParts[1].substring(oauthParts[1].indexOf('=') + 1)
        };
        resolve();
      });
    });
  }
}
```

This last step will make a final call to get the access token for Magento. It will still resolve even though it might fail. By setting `req.dataSourceAuthParams = new Error('Access has been rejected');` it will catch this in the error check, and show the error.