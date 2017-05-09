const express     = require('express');
const router      = express.Router();
const _           = require('lodash');
const dataSources = require('../../dataSources');
const { runner, auth } = require('../../utils/dataSource');


router.get('/dataSources', getDataSources);
router.get('/dataSources/:dataSource/getAuths', getDataSourceAuths);
router.get('/dataSources/:dataSource/getFunctions', getDataSourceFunctions);
router.post('/dataSources/:dataSource/:functionName', postDataSourceFunction);
router.use('/api/data-source/auth', require('./auth'));

module.exports = router;

/**
 * Get all of the defined datasources
 */
function getDataSources(req, res) {
  res.json(_.keys(dataSources));
}

/**
 * Get all of the defined datasource functions
 */
function getDataSourceFunctions(req, res) {
  try {
    const dataSource = dataSources[req.params.dataSource];
    if (!dataSource) {
      throw new Error(`Datasource ${dataSourceName} is not defined`);
    }
    res.json(_.keys(_.omit(dataSource, ['getData', 'validateAuth', 'authStrategies'])));
  } catch (e) {
    console.error(e);
    res.status(400).json({
      message: e.message
    });
  }
}

/**
 * Call a certain function on a datasource
 */
async function postDataSourceFunction(req, res) {
  try {
    const dataSource = dataSources[req.params.dataSource];
    if (!dataSource) {
      throw new Error(`Datasource ${dataSourceName} is not defined`);
    }
    const data = await runner.run(dataSource, req.params.functionName, req.body.params);
    res.json({
      data
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      message: e.message
    });
  }
}

/**
 * Get all the auths for a datasource
 */
async function getDataSourceAuths(req, res) {
  const auths = await auth.findByDataSourceName(req.params.dataSource);
  res.json(auths);
}