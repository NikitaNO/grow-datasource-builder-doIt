const BPromise = require('bluebird');
const request = BPromise.promisify(require('request'));
const _ = require('lodash');
const j2t = require('json-to-table');
const MAX_PAGES = 5;
const URL = 'http://swapi.co/api/';

module.exports = {
  getData: _getData
};

async function _getData(config, totalResults = [], pageCount = 0) {
  const report = _.get(config, 'report.params.report', 'people');
  const options = {
    url: _.get(config, 'next.url', `${URL}${report}`),
    json: true
  };
  const req = await request(options);
  const page = _.get(req, 'body.results');
  if (page) {
    totalResults = totalResults.concat(page);
  }
  const next = _.get(req, 'body.next');
  if (next && pageCount < MAX_PAGES) {
    return _getData(config, totalResults, ++pageCount); 
  }
  return j2t(totalResults);

}

