const express     = require('express');
const router      = express.Router();
const _           = require('lodash');
const dataSources = require('../../dataSources');
const passport    = require('passport');
const { auth }    = require('../../utils');

router.get('/error-check', 
  errorCheck);
router.get('/:dataSourceName', 
  showCreateDataSourceAuth);
router.get('/:dataSourceName/callback',
  getDataSourceAuthParams,
  gotoNextAuthStrategy,
  validateDataSourceAuthParams,
  upsertDataSourceAuthParams);
router.post('/:dataSourceName/callback',
  getDataSourceAuthParams,
  gotoNextAuthStrategy,
  validateDataSourceAuthParams,
  upsertDataSourceAuthParams);

module.exports = router;

/**
 * Check to see if there is an error. If there is it will display it.
 * Otherwise it will close the auth window.
 */
function errorCheck(req, res) {
  if (!_.isUndefined(req.session.auth_error)) {
    const authError = _.cloneDeep(req.session.auth_error);
    delete req.session.auth_error;
    res.render('auth/fail', {
      msg: authError
    });
  } else {
    res.redirect('/close-window');
  }
}

/**
 * This will show the current auth strategy, such as an html page, passport redirect to an oauth flow.
 */
function showCreateDataSourceAuth(req, res, next) {
  //Delete any previous auth errors
  delete req.session.auth_error;
  const dataSource = dataSources[req.params.dataSourceName];
  if (!dataSource) {
    return res.status(404).send('No datasource with that name');
  }
  if (!dataSource.authStrategies) {
    return res.status(404).send('The data source does not have an auth strategy');
  }
  //Keep an index variable so we know what strategy to show next
  if (_.isUndefined(req.session.currentAuthStrategyIndex)) {
    req.session.currentAuthStrategyIndex = 0;
  }
  //If the dataSource has another strategy the increment the index
  if (req.incrementNextAuthStrategy) {
    req.session.currentAuthStrategyIndex++;
  } else {
    req.session.currentAuthStrategyIndex = 0;
  }
  const getAuthStrategy = () => {
    const strategy = dataSource.authStrategies[req.session.currentAuthStrategyIndex];
    if (!strategy) {
      //If there is no auth strategy then reset the index in hope to find one
      req.session.currentAuthStrategyIndex = 0;
      return getAuthStrategy();
    } else {
      return strategy;
    }
  };
  //Get the current auth strategy
  const authStrategy = getAuthStrategy();
  if (!authStrategy) {
    return res.status(404).send('The data source does not have an auth strategy');
  }
  if (authStrategy.passport) {
    let options = {};
    if (authStrategy.passport.getOptions) {
      options = authStrategy.passport.getOptions(req);
    } else if (authStrategy.passport.options) {
      options = authStrategy.passport.options;
    }
    authStrategy.passport.getStrategy(req);
    if (!passport.authenticate) {
      console.error('data-source.showCreateDataSourceAuth: Does not authenticate');
    }
    return passport.authenticate(req.params.dataSourceName, options, (err, user, info) => {
      return next();
    })(req, res, next);
  }  
  if (authStrategy.view) {
    if (authStrategy.beforeRender) {
      return authStrategy.beforeRender(req)
        .then(defaultAuthParams => {
          return res.render(authStrategy.view, defaultAuthParams);
        })
        .catch(next);
    } else {
      return res.render(authStrategy.view, authStrategy.defaultAuthParams);
    }
  } 
  if (authStrategy.redirect) {
    return authStrategy.redirect(req)
      .then(url => {
        //Increment the next auth strategy
        req.session.currentAuthStrategyIndex++;
        res.redirect(url);
      })
      .catch(err => {
        req.session.auth_error = err.message;
        res.redirect('/api/data-source/auth/error-check');
      });
  } 
  return res.status(404).send('The data source does not have an auth strategy');
}

/**
 * This will get the auth params from the auth strategy.
 */
function getDataSourceAuthParams(req, res, next) {
  const dataSource = dataSources[req.params.dataSourceName];
  if (!dataSource) {
    return res.status(404).send('Datasource is not defined');
  }
  //Keep an index variable so wee know what strategy to show next
  if (_.isUndefined(req.session.currentAuthStrategyIndex)) {
    req.session.currentAuthStrategyIndex = 0;
  }
  //Get the current auth strategy
  const authStrategy = dataSource.authStrategies[req.session.currentAuthStrategyIndex];
  if (!authStrategy) {
    return res.status(404).send('The data source does not have an auth strategy');
  }
  //Passport
  if (authStrategy.passport) {
    //Some passport modules don't handle the callback, so it just needs to
    //hande the express request on its own
    if (authStrategy.passport.saveDataSourceAuthParamsToReq) {
      return authStrategy.passport.saveDataSourceAuthParamsToReq(req)
        .then(() => {
          if (!req.dataSourceAuthParams) {
            console.error('Could not retrieve auth info for: ' + req.params.dataSourceName);
            req.session.auth_error = 'Could not retrieve auth info';
            res.redirect('/api/data-source/auth/error-check');
          } else {
            next();
          }
        })
        .catch(err => {
          console.error('passport.saveDataSourceAuthParamsToReq error: ', err.message || err);
          req.session.auth_error = err.message || err;
          res.redirect('/api/data-source/auth/error-check');
        });
    } else {
      //Normal passport strategy
      authStrategy.passport.getStrategy(req);
      let options = {};
      if (authStrategy.passport.getOptions) {
        options = authStrategy.passport.getOptions(req);
      } else if (authStrategy.passport.options) {
        options = authStrategy.passport.options;
      }
      return passport.authenticate(req.params.dataSourceName, options, (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!req.dataSourceAuthParams) {
          console.error('Could not retrieve auth info for: ' + req.params.dataSourceName);
          req.session.auth_error = `Could not retrieve auth info ${info ? info.message : ''}`;
          res.redirect('/api/data-source/auth/error-check');
        } else if (_.isError(req.dataSourceAuthParams)) {
          console.error('data-source.getDataSourceAuthParams: ', req.dataSourceAuthParams.message);
          req.session.auth_error = req.dataSourceAuthParams.message;
          res.redirect('/api/data-source/auth/error-check');
        } else {
          next();
        }
      })(req, res, next);
    }
  } else if (authStrategy.saveDataSourceAuthParamsToReq) {
    return authStrategy.saveDataSourceAuthParamsToReq(req)
      .then(() => {
        if (!req.dataSourceAuthParams) {
          console.error('Could not retrieve auth info for: ' + req.params.dataSourceName);
          req.session.auth_error = 'Could not retrieve auth info';
          res.redirect('/api/data-source/auth/error-check');
        } else if (_.isError(req.dataSourceAuthParams)) {
          console.error('data-source.getDataSourceAuthParams: ', req.dataSourceAuthParams.message);
          req.session.auth_error = req.dataSourceAuthParams.message;
          res.redirect('/api/data-source/auth/error-check');
        } else {
          next();
        }
      })
      .catch(err => {
        console.error('saveDataSourceAuthParamsToReq error: ', err.message || err);
        req.session.auth_error = err.message || err;
        res.redirect('/api/data-source/auth/error-check');
      });
  } else {
    console.error('Could not retrieve auth info for: ' + req.params.dataSourceName);
    req.session.auth_error = 'Could not retrieve auth info';
    res.redirect('/api/data-source/auth/error-check');
  }
}

/**
 * This will check to see if there is another auth strategy to use. If there is it will
 * redirect back to `showCreateDataSourceAuth`
 */
function gotoNextAuthStrategy(req, res, next) {
  const dataSource = dataSources[req.params.dataSourceName];
  //Keep an index variable so we know what strategy to show next
  if (_.isUndefined(req.session.currentAuthStrategyIndex)) {
    return res.status(404).send('Dont know what strategy you are on');
  }
  //Get the next auth strategy
  const authStrategy = dataSource.authStrategies[req.session.currentAuthStrategyIndex + 1];
  if (!authStrategy || req.stopNextAuthStrategy) {
    //Set the index back to 0
    req.session.currentAuthStrategyIndex = 0;
    //We are done we can finally validate the auth
    return next();
  }
  req.incrementNextAuthStrategy = true;
  return showCreateDataSourceAuth(req, res, next);
}

/**
 * Once every auth strategy is finished it will validate auth params to make
 * sure they are correct
 */
function validateDataSourceAuthParams(req, res, next) {
  const dataSource = dataSources[req.params.dataSourceName];
  const config = {
    auth: {
      params: req.dataSourceAuthParams.authInfo
    }
  };
  dataSource.validateAuth(config)
    .then(() => next())
    .catch(err => {
      req.session.auth_error = err.message || err;
      res.redirect('/api/data-source/auth/error-check');
      console.error('Error Validating auth for: ' + req.params.dataSourceName, err.message || err);
    });
}

/**
 * This will create the auth
 */
function upsertDataSourceAuthParams(req, res) {
  const authParamsData = _.merge({
    dataSourceName: req.params.dataSourceName,
  }, req.dataSourceAuthParams);
  try {
    auth.create(authParamsData);
    res.redirect('/api/data-source/auth/error-check');
  } catch (e) {
    req.session.auth_error = e.message;
    res.redirect('/api/data-source/auth/error-check');
    console.error(e);
  }
}
