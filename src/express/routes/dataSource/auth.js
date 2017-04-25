const express = require('express');
const router = express.Router();

router.get('/:dataSourceName',
  showCreateDataSourceAuth);
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
  res.send('You got nothing on this!!');
}