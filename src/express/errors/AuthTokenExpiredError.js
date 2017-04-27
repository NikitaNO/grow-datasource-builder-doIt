function AuthTokenExpiredError(message) {
  this.message = message;
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, AuthTokenExpiredError);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthTokenExpiredError.prototype             = Object.create(Error.prototype);
AuthTokenExpiredError.prototype.name        = 'AuthTokenExpiredError';
AuthTokenExpiredError.prototype.constructor = AuthTokenExpiredError;
module.exports                              = AuthTokenExpiredError;