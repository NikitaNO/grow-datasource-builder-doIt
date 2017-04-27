const errors = require(__dirname + '/../../errors');

const FacebookErrorHandler = {

  /**
   * This method will create a new default error and if needed
   * it will customize the error according to the message and
   * error codes from facebook
   *
   * @param  {Error} err The error object
   * @param {object} config The config that was used
   * @return {Error}
   */
  getError: function (err, config) {
    console.error('FACEBOOK ERROR: ', err.message || err, config);
    var error = new Error('An error has occurred with the Facebook Connector.');

    if (typeof err === 'string') {
      error = new Error(err);
    } else if (typeof err.message === 'string') {
      error = new Error(err.message + '\nPotentially a bad pageId or you dont have \npermissions on the pageId');
    } else if (err.code === 190 || err.code === 102) {
      error = new errors.OAuthError('Authentication has failed. OAuth has expired or is invalid.');
    } else if (err.error_user_title && err.error_user_msg) {
      error = new Error(`${err.error_user_title}: ${err.error_user_msg}`);
    }
    return error;
  }

};

module.exports = FacebookErrorHandler;