# Data Sources

A data source defines a set of api calls that will be used to retrieve data. 

It must handle these objectives:

* Write a function called `getData` that will take in a configuration object as the first parameter and return a promise that resolves with data in a table format array.
* Write a function called `validateAuth` that will take in a configuration object as the first parameter and will validate authentication parameters (* Do we need this. Can we just show an alert if an error like this happens in the first objective?)
* Write an array of objects called `authStrategies` that will act as an action list. Each action will send the client on a wizard like experience to create a set of authentication parameters, whether through OAUTH or some Basic Authentication pattern.
* Any other functions that will retrieve data (* Or do we want everything to go through getData)

To learn more about authStrategies go to this tutorial:

[Auths](./auths/README.md)
