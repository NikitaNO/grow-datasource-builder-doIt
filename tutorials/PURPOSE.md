# Purpose

The purpose of this app is to define datasources that we can query, consume data, and display visually.

## Front End - React App

This displays the tool for: 
* Selecting a datasource
* Choosing authentication
* Configuring parameters
* Visualizing the data

## Back End - Node App

This defines what data sources are available to query. Within a datasource you find systems that deal with:
* Retrieving data from a 3rd party
* Creating an authentication wrapper
* Take in configuration parameters that will be used to make queries
* Handle errors, rate limits, pagination, and large data sets