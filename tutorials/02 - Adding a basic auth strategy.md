# 02 - Adding a basic auth strategy

In your index.js file we need to add an `authStrategies` property to our object we are exporting.

```
const BPromise = require('bluebird');
const request = BPromise.promisify(require('request'));
const _ = require('lodash');
module.exports = {
  getData: _getData,
  authStrategies: [
    {
      view: 'auth/TestDemo',
      saveDataSourceAuthParamsToReq(req) {
        return new BPromise((resolve, reject) => {
          req.dataSourceAuthParams = {
            authInfo: {
              username: req.body.username,
              password: req.body.password,
            },
            name: req.body.name
          };
          resolve();
        });
      }
    }
  ]
};
```

This object will define a `view` to display our html form. Navigate to the `/grow-datasource-builder/src/express/views/auth` folder and create file named `TestDemo.jade`.

We need to ask for the username and the password.

```
form(method='post', action='/api/data-source/auth/TestDemo/callback')
  input(type='hidden', name='_csrf', value='#{csrfToken}')
  input(type='text', name='name', placeholder='Connection Name')
  input(type='text', name='username', placeholder='Username')
  input(type='password', name='password', placeholder='Password')
  input(type='submit', value='Submit')
```

When the form has been submitted it will call `/api/data-source/auth/TestDemo/callback`. It will then call the `saveDataSourceAuthParamsToReq` function in our authStrategy.

```
saveDataSourceAuthParamsToReq(req) {
  return new BPromise((resolve, reject) => {
    req.dataSourceAuthParams = {
      authInfo: {
        username: req.body.username,
        password: req.body.password,
      },
      name: req.body.name
    };
    resolve();
  });
}
```

We will save the username and password in an object called `authInfo`. That object will be stored on the `req.dataSourceAuthParams` object along with the name of the connection.

Now that we have credentials we can use them to make an api call that uses basic authentication. Lets change the _getData function to make a call to this TestDemo api.

```
function _getData(config) {
  const username = _.get(config, 'auth.params.username');
  const password = _.get(config, 'auth.params.password');
  const auth = new Buffer(`${username}:${password}').toString('base64');
  const options = {
    url: 'https://www.testdemo.com/api/resource,
    method: 'GET',
    headers: {
      Authorization: `BASIC ${auth}`
    }
  }
  return request(options);
}
```

Next:

[03 - Adding an oauth auth strategy](./03 - Adding an oauth auth strategy.md)




