const fs           = require('fs');
const path         = require('path');
const uuidV4       = require('uuid/v4');
const _            = require('lodash');
const authJsonPath = path.join(__dirname, '..', '..', 'auths.json');

//Create auth file if it doesnt exist
if (!fs.existsSync(authJsonPath)) {
  fs.writeFileSync(authJsonPath, JSON.stringify([], null, 2));
}

module.exports = {
  create(data) {
    data.id = uuidV4();
    let auths = fs.readFileSync(authJsonPath);
    auths = JSON.parse(auths);
    auths.push(data);
    fs.writeFileSync(authJsonPath, JSON.stringify(auths, null, 2));
  },
  findByDataSourceName(dataSourceName) {
    let auths = fs.readFileSync(authJsonPath);
    auths = JSON.parse(auths);
    return _.find(auths, auth => {
      return auth.dataSourceName === dataSourceName;
    });
  }
}