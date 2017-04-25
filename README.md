# Grow Datasource Builder

This repo is for local use only. It is a lite version of the app only used to build and test new datasources.

## Setup

#### Hostname

Run this command to add `local.gogrow.com` to your hosts file.

`echo '127.0.0.1  local.gogrow.com' | sudo tee -a /etc/hosts`

#### Installing docker

To download the installer for mac:

`https://docs.docker.com/docker-for-mac/install/`

## Running the app

To run this app we use docker.

`docker-compose up`

If everything is successful you may navigate to the following location in your browser.

`http://local.gogrow.com`

## Adding node modules and rebuilding the docker container

There will come a time when you need to add in some node modules. To do this add the node module to the `package.json` file located in the root of the app.

You will need to rebuild the docker image. To do that run this command.

`docker-compose build`

## Docker commands

To stop running the app

`docker-compose stop`

To remove the app from your system

`docker-compose down`

## File structure

    src // The node app
      ├── express // The node express server
      └── webpack // The webpack react build