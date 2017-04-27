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
    const auths = readFile();
    auths.push(data);
    fs.writeFileSync(authJsonPath, JSON.stringify(auths, null, 2));
  },
  findByDataSourceName(dataSourceName) {
    const auths = readFile();
    return _.reduce(auths, (foundAuths, auth) => {
      if (auth.dataSourceName === dataSourceName) {
        foundAuths.push(auth);
      }
      return foundAuths;
    }, []);
  },
  findById(id) {
    const auths = readFile();
    return _.find(auths, { id });
  }
}

function readFile() {
  return JSON.parse(fs.readFileSync(authJsonPath));
}