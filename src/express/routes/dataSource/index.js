const express     = require('express');
const router      = express.Router();
const dataSources = require('../../dataSources');
const { runner }  = require('../../utils/dataSource');
const _           = require('lodash');
const authUtil    = require('../../utils/auth');

router.get('/dataSources', (req, res) => {
  res.json(_.keys(dataSources));
});

router.post('/dataSources/:dataSource/getData', async (req, res) => {
  try {
    const data = await runner.run(req.params.dataSource, req.body.params);
    res.json({
      data
    });
  } catch(e) {
    console.error(e);
    res.status(400).json({
      message: e.message
    });
  }
});

router.get('/dataSources/:dataSource/getAuths', (req, res) => {
  res.json(authUtil.findByDataSourceName(req.params.dataSource));
});

router.use('/api/data-source/auth', require('./auth'));

module.exports = router;
