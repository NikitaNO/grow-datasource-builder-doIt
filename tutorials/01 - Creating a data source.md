# 01 - Creating a data source

Navigate to the `/grow-datasource-builder/src/express/dataSources` folder.

Create a folder called `TestDemo`.

In this new folder create a file called index.js and paste this code into that file.

```
const BPromise = require('bluebird');
module.exports = {
  getData(config) {
    return BPromise.resolve();
  }
};
```

Restart your server if nodemon does not pick up your changes. 

You datasource should now be available in the front end to select. 

You may begin writing your datasource to accept certain parameters and return certain data so that it can be visualized in Grow.

Next:

[02 - Adding a basic auth strategy](./02 - Adding a basic auth strategy.md)