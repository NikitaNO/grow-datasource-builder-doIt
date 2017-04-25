const fs   = require('fs');
const path = require('path');
const dataSources = {};

fs.readdirSync(__dirname)
  .forEach(dataSource => {
    const dataSourcePath = path.join(__dirname, dataSource);
    if (fs.statSync(dataSourcePath).isDirectory()) {
      dataSources[dataSource] = require(dataSourcePath);
    }
  });

module.exports = dataSources;