# 01 - Creating a data source

## Creating a data source from an automated script

You can create a data source by running the node script `src/create-datasource.js`

If you dont have node installed you may enter this docker command to enter into the containers command line:

`docker-compose run web-server /bin/bash`

Then you can run this following command:

`node create-datasource.js`

It will ask you the name of what you want the data source to be called.

It will then create a directory for you, given the name you provided in the `src/express/dataSources` directory.

To exit the container type `exit`

---

## Creating a data source manually

Navigate to the `src/express/dataSources` folder.

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