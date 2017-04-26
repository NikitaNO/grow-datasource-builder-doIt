const express = require('express');
const router = express.Router();
const dataSources = require('../../dataSources');

router.get('/:dataSourceName', showCreateDataSourceAuth);
// router.get('/api/data-source/auth/:dataSourceName/callback',
//   getDataSourceAuthParams,
//   gotoNextAuthStrategy,
//   validateDataSourceAuthParams,
//   upsertDataSourceAuthParams);
// router.post('/api/data-source/auth/:dataSourceName/callback',
//   getDataSourceAuthParams,
//   gotoNextAuthStrategy,
//   validateDataSourceAuthParams,
//   upsertDataSourceAuthParams);

module.exports = router;

function showCreateDataSourceAuth(req, res) {
  
  const dataSource = dataSources[req.params.dataSourceName];

  if (!dataSource) {
    return res.status(404).send('No datasource with that name');
  }

  if (!dataSource.authStrategies) {
    return res.status(404).send('The data source does not have an auth strategy');
  }

  res.send('You have chosen wisely');

}