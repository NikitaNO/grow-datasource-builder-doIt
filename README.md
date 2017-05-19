For add additional parameters in textarea field in the format below
 {
   "Date_Start": "2000-01-15",
   "Date_End": "2008-05-15",
  "Lead_Type": "Lead_Type"
}


# Grow Datasource Builder

This repo is for local use only. It is a lite version of the app only used to build and test new datasources.

[Nginx](./nginx)

[Setup](#setup)

[Running The App](#running-the-app)

[Pull Requests](#pull-requests)

[Adding Node Modules](#adding-node-modules)

[Docker Commands](#docker-commands)

[Documentation](./docs)

[Tutorials](./tutorials)

# Setup

#### Hostname

Run this command to add `local.gogrow.com` to your hosts file.

`echo '127.0.0.1  local.gogrow.com' | sudo tee -a /etc/hosts`

#### Installing docker

To download the installer for mac:

`https://docs.docker.com/docker-for-mac/install/`

#### Clone the repo

`git clone git@github.com:Growmies/grow-datasource-builder.git`

# Running the app

To run this app we use docker.

`docker-compose up`

If everything is successful you may navigate to the following location in your browser.

`https://local.gogrow.com`

## File structure

    nginx             // The nginx container
    src               // The node app
      ├── express     // The node express server
      ├── webpack     // The webpack react build
      ├── gulpfile.js // Gulp tasks
      └── index.js    // Entrypoint of the app

## Express app

    express         
      ├── dataSources // The place to add each datasource
      ├── errors      // User defined errors
      ├── middleware  // express middleware
      ├── public      // Folder to put static assets
      ├── routes      // User defined express routes
      ├── utils       // Utilities
      ├── views       // Jade views
      └── index.js    // Express app

## Webpack

    webpack/src         
      ├── app               // The place to add react components
      ├── .babelrc          // Babel configuration
      ├── postcss.config.js // Postcss loader config
      └── webpack.config.js // Webpack config

## React App

    webpack/src/app         
      ├── components // Components
      ├── containers // Containers
      ├── services   // Services. API calls
      ├── stores     // Mobx Stores
      └── index.js   // React entry point

# Pull Requests

  When you pull the latest code from develop make sure to rebuild the docker container. This will ensure that you have the latest node_modules.

  `git checkout develop`

  `git pull`

  `docker-compose build`

  When making changes to the code base branch off of the develop branch. Do not work directly off the develop branch.

  `git checkout -b your-branch`

  Before submitting a new pull request be sure to pull the latest from the develop branch and merge it into your branch. Resolve all merge conflicts.

  `git checkout develop`

  `git pull`

  `git checkout your-branch`

  `git merge develop`

  This will ensure that your branch has the latest from develop and there will be no merge conflicts.

# Adding node modules

There will come a time when you need to add in some node modules. To do this add the node module to the `package.json` file located in the root of the app.

You will need to rebuild the docker image. To do that run this command.

`docker-compose build`

# Docker commands

To start running the app.

`docker-compose up`

To stop running the app. This is useful if your container is in a broken state. This will stop all services.

`docker-compose stop`

To remove the app from your system.

`docker-compose down`

Rebuild the docker image. This will add any new node_modules to the build.

`docker-compose build`
