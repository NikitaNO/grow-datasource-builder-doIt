# Auths

Auths describe the authentication credentials used to retrieve data from data sources. There are many ways a data source might have implemented their auth system. This will go over those ways on how to accomplish asking for and saving credentials. This is just a brief overview. There will also be specific examples on data sources that use each of these types.

[Facebook Example](./FACEBOOK.md)

[Magento Example](./MAGENTO.md)

[Amazon Seller Central Example](./AMAZONSELLERCENTRAL.md)

# Initiate auth flow:

`https://local.gogrow.com/api/data-source/auth/:dataSourceName`

Going to this URL it will check if its a passport, view, or redirect.

## Passport

The passport node module is great for doing all the oauth work for you. Sometimes though there isn't a passport module for a certain datasource. So it is recommended to handle everything yourself.

```
{
  passport: {

    //This will return the passport auth strategy
    getStrategy() {
      return new strategy({
        clientID: '*****',
        clientSecret: '*****,
        callbackURL: '*****',
        passReqToCallback: true,
        display: 'popup'
      }, (req, accessToken, refreshToken, profile, done) => {

        //Always create an object on the req called 'dataSourceAuthParams.authInfo'
        //and attach any credentials
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
    },

    //Any options for passport
    options: {
      display: 'popup'
    },

    saveDataSourceAuthParamsToReq(req) {
      //TODO - must figure out what data source uses this function
    }
  }
}
```
## Views

```
{
  view: 'index.html',
  defaultAuthParams: { // The default params.
    host: '',
    adminHost: '',
    consumerKey: '',
    consumerSecret: ''
  },
  beforeRender(req) {
    return new Promise(async (resolve, reject) => {
      const data = await someProcess();
      return resolve(data);
    });
  }
}
```

The view represents the ejs file that we use to render the html form. This will be used to collect credentials or useful information about the data source.

We might be able to remove beforeRenders everywhere. I think it was used to re-populate a form in the re-auth stage. But since we don't want credentials to show and get messed up by user input, we make them re-type the parameters in. 

## Redirects

```
{
  redirect(req) {
    return new Promise(async (resolve, reject) => {
      const oauthUrl = `https://${req.clientHost}/oauth`;
      return resolve(oauthUrl);
    });
  }
}
```

This is useful to allowing a redirect in the action list. For instance to initiate an oauth flow.

# Callback - Capturing auth credentials

`https://local.gogrow.com/api/data-source/auth/:dataSourceName/callback`

This route will then call your passport module or `saveDataSourceAuthParamsToReq`.

## Saving DataSource auth params To Req

```
{
  saveDataSourceAuthParamsToReq(req) {
    return new Promise((resolve, reject) => {
      const authInfo = await getAccessToken(req.body.code);
      req.dataSourceAuthParams = {
        authInfo: {
          accessToken: authInfo.accessToken
        }
      };
      //Or if you need to save it on the session and skip to the next stage in the auth flow.
      req.session.dataSourceAuthParams = {
        authInfo: {
          accessToken: authInfo.accessToken
        }
      };
      resolve();
    });
  }
}
```

This will build up a session of auth credential data. Then when all of the action have completed it will save the auth data in the database.

Once the callback has succeded it will then increment to the next auth strategy. This makes it useful for collecting data in steps. For instance we need to get the url before we can send it to an oauth flow.