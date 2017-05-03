# 05 - Using Json to table

We need to turn data if needed into a 2d array of table data. We do this by requiring a module `json-to-table`.

```
const BPromise = require('bluebird');
const request = BPromise.promisify(require('request'));
const _ = require('lodash');
const j2t = require('json-to-table');
module.exports = {
  getData: _getData,
};
```

Then we can modify our `_getData` call to use this module. We can pass in the arrays and objects we retrieve from the api.

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
  return request(options)
    .then(res => {
      //Get the results from the object at the path `data.results`
      return j2t(_.get(res, 'data.results'));
    });
}
```