const fs = require('fs-extra');
const questions = require('questions');

questions.askMany({
  dataSourceName: {
    info: 'Datasource Name'
  },
}, config => {

  const dest = `./express/dataSources/${config.dataSourceName}`;

  fs.copy('./express/utils/dataSource/Template', dest, err => {
    if (err) {
      return console.error(err);
    }

    console.log(`Successfully created the ${config.dataSourceName} directory ...`);

    const authFile = `${dest}/auth.pug`;

    fs.readFile(authFile, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      const result = data.replace(/{{DATASOURCE_NAME}}/g, config.dataSourceName);
      fs.writeFile(authFile, result, 'utf8', err => {
        if (err) {
          return console.log(err);
        }
        console.log(`Completed successfully ...`);
      });
    });

  });

});