# DataSources

A datasource defines a set of api calls that will be used to retrieve data. 

It must handle these objectives:

* Write a function called `getData` that will take in a configuration object as the first parameter and return a promise that resolves with data in a table format array.
* Write a function called `validateAuth` that will take in a configuration object as the first parameter and will validate authentication parameters (* Do we need this. Can we just show an alert if an error like this happens in the first objective?)
* Write an array of objects called `authStrategies` that will act as an action list. Each action will send the client on a wizard like experience to create a set of authentication parameters, whether through OAUTH or some Basic Authentication pattern.
* Any other functions that will retrieve data (* Or do we want everything to go through getData)

## Creating a data source

Navigate to the /grow-datasource-builder/src/express/dataSources folder.

Create a folder called `TestDemo`.

In this new folder create a file called index.js and paste this code into that file.

```
module.exports.getData = config => {
    return new Promise((resolve, reject) => {
      const data = [
        ['name', 'city', 'state'],
        ['joe', 'provo', 'ut'],
        ['betty', 'salt late city', 'ut']
      ];
      return resolve(data);
    });
  }
};
module.exports.validateAuth = config => {
    return new Promise((resolve, reject) => {
      //Make whatever call you need to using the authentication that was given.
      //To check to see if those credentials are valid
      if (validCall) {
        return resolve();
      }
      return reject('Authentication is invalid');
    });
  }
};
module.exports.authStrategies = [
  {
    //Any auth strategies go here
  }
];
```

Restart your server if nodemon does not pick up that changes. You datasource should now be available in the front end to select. You may begin writing your datasource to accept certain parameters and return certain data so that it can be visualized in Grow.

To learn more about authStrategies go to this tutorial:

[Auths](./AUTHS.md)
