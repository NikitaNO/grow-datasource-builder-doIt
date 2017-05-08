const _        = require('lodash');
const Github   = require('github-api');
const BPromise = require('bluebird');
const j2t      = require('json-to-table');
const moment   = require('moment');
const IRRELEVANT_COLUMNS = ['labels_url', 'comments_url', 'events_url', 'html_url', 'user', 'labels', 'assignee'];

module.exports = {
  getData: _getData,
  validateAuth: _validateAuth
};

/**
 * The entry point to make api calls and return table data
 * @param {object} config
 * @return {array}
 */
function _getData(config) {
  const endpoint = _.get(config, 'report.params.endpoint', 'repos');
  return endpoints[endpoint](config)
  .then(j2t);
}

/**
 * The validate auth function. Use this to validate any auth params.
 * This will be called when creating an auth. If it fails the auth
 * will not be created
 * @param {object} config
 */
function _validateAuth(config) {
  return _getData(config);
}

function _getConnector(config) {
  return new Github({
    token: _.get(config, 'auth.params.accessToken'),
    auth: 'oauth'
  });
}

const endpoints = {
  repos(config) {
    const user = _getConnector(config).getUser();
    return new BPromise((resolve, reject) => {
      user.listRepos((err, repos) => {
        if (err) {
          return reject(_getError(err));
        }
        resolve(_.sortBy(repos, 'full_name'));
      });
    });
  },
  issues(config) {
    return new BPromise((resolve, reject) => {
      let issues  = _getConnector(config).getIssues(config.report.params.repo.username, config.report.params.repo.repo);
      let options = {
        state: _.get(config, 'report.params.state.title', 'all').toLowerCase()
      };
      if (config.report.params.since) {
        options.since = config.report.params.since;
      }
      issues.listIssues(options, (err, issues) => {
        if (err) {
          return reject(_getError(err));
        }
        issues = _.map(issues, issue => {
          issue.user_login     = issue.user.login;
          issue.user_id        = issue.user.id;
          issue.user_type      = issue.user.type;
          issue.assignee_login = _.get(issue, 'assignee.login');
          issue.assignee_id    = _.get(issue, 'assignee.id');
          issue.assignee_type  = _.get(issue, 'assignee.type');
          issue.labelNames     = _.map(issue.labels, 'name').join(', ');
          return _.omit(issue, IRRELEVANT_COLUMNS);
        });
        resolve(issues);
      });
    });
  },
  contributors(config) {
    let repo = _getConnector(config).getRepo(config.report.params.repo.username, config.report.params.repo.repo);
    return new BPromise((resolve, reject) => {
      repo.getContributors((err, contributors) => {
        if (err) {
          return reject(_getError(err));
        }
        let contributions = [];
        _.forEach(contributors, contributor => {
          _.forEach(contributor.weeks, weekInfo => {
            contributions.push({
              name: contributor.author.login,
              weekStart: moment.unix(weekInfo.w).format('YYYY-MM-DD'),
              additions: weekInfo.a,
              deletions: weekInfo.d,
              commits: weekInfo.c
            });
          });
        });
        resolve(contributions);
      });
    });
  }
};

function _getError(err) {
  let error = new Error('An error has occurred with the Github Connector.');
  if (typeof err === 'string') {
    error = new Error(err);
  } else if (err.request.responseText) {
    error = new Error(err.request.responseText);
  }
  return error;
}