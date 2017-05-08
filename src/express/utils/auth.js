const BPromise    = require('bluebird');
const _           = require('lodash');
const MongoClient = require('mongodb').MongoClient;
const ObjectID    = require('mongodb').ObjectID;

module.exports = {
  create: _create,
  findByDataSourceName: _findByDataSourceName,
  findById: _findById,
  saveAuth: _saveAuth,
  setAuthToInvalid: _setAuthToInvalid,
  setAuthToValid: _setAuthToValid,
  checkForAuthLock: _checkForAuthLock
}

/**
 * Connects to the mongodb instance
 */
function _connect() {
  return new BPromise((resolve, reject) => {
		const url = 'mongodb://mongo:27017/grow';
		MongoClient.connect(url, (err, db) => {
      if (err) {
        return reject(err);
      }
      return resolve(db);
    });
  });
}

/**
 * This will create a new auth
 * @param {object} data
 */
async function _create(data) {
  const db = await _connect();
  const collection = db.collection('auths');
  data.locked = false;
  data.validAuth = true;
  return new BPromise((resolve, reject) => {
    collection.insertMany([data], (err, result) => {
      db.close();
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

/**
 * Find all auths by data source name
 * @param {string} dataSourceName
 * @return array
 */
async function _findByDataSourceName(dataSourceName) {
  const db = await _connect();
  const collection = db.collection('auths');
  return new BPromise((resolve, reject) => {
    collection.find({ 
       dataSourceName
    }).toArray((err, result) => {
      db.close();
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

/**
 * Find auth by id
 * @param {string} id
 * @return Promise
 */
async function _findById(id) {
  const db = await _connect();
  const collection = db.collection('auths');
  const auth = await collection.findOne({ _id: new ObjectID(id) });
  db.close();
  return auth;
}

/**
 * This method will save auth info in the db
 *
 * @param  {object} config JSON that holds config information
 * @param {object} options obviously some options
 * @return {promise}
 */
async function _saveAuth(config, options = {}) {
  const db = await _connect();
  const collection = db.collection('auths');
  return new BPromise((resolve, reject) => {
    collection.updateOne(
      { _id: new ObjectID(config.auth.id) }, 
      { 
        $set: { 
          authInfo : config.auth.params,
          locked: options.locked || false
        } 
      }, (err, result) => {
      db.close();
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

/**
 * This method will set the auth to invalid in the db
 *
 * @param  {object} config JSON that holds config information
 * @return {promise}
 */
async function _setAuthToInvalid(config, options = {}) {
  const db = await _connect();
  const collection = db.collection('auths');
  return new BPromise((resolve, reject) => {
    collection.updateOne(
      { _id: new ObjectID(config.auth.id) }, 
      { 
        $set: { 
          validAuth: false,
          locked: options.locked || false
        } 
      }, (err, result) => {
      db.close();
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

/**
 * This method will set the auth to valid in the db
 *
 * @param  {object} config JSON that holds config information
 * @return {promise}
 */
async function _setAuthToValid(config) {
  const db = await _connect();
  const collection = db.collection('auths');
  return new BPromise((resolve, reject) => {
    collection.updateOne(
      { _id: new ObjectID(config.auth.id) }, 
      { 
        $set: { 
          validAuth: true,
        } 
      }, (err, result) => {
      db.close();
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

/**
 * This method will check to see if an auth is locked
 * @param {string} authId
 * @return Promise
 */
function _checkForAuthLock(authId) {
  return _findById(authId)
  .then(auth => {
    if (auth.locked) {
      //if no rows where updated, that means someone else has the lock, so we need to wait for it to be ready
      return _waitForAuthReady(authId);
    } else {
      //if we did update a row, then we need to pass it on for the calling function to refresh.
      return auth;
    }
  });
}

/**
 * This function waits for a maximum of 6 seconds for some process to unlock the auth row
 * otherwise it will reject
 *
 * @param authId
 * @return Promise
 */
function _waitForAuthReady(authId) {
  return new BPromise((resolve, reject) => {
    const fibonacciBackoff = backoff.fibonacci({
      randomisationFactor: 0,
      initialDelay: 10,
      maxDelay: 6000
    });
    fibonacciBackoff.failAfter(10);
    fibonacciBackoff.on('ready', (number, delay) => {
      _findById(authId)
      .then(auth => {
        if (auth.locked) {
          fibonacciBackoff.backoff();
        } else {
          fibonacciBackoff.reset();
          resolve(auth);
        }
      });
    });
    fibonacciBackoff.on('fail', err => {
      reject('Could not obtain auth lock.');
    });
    fibonacciBackoff.backoff();
  });
}