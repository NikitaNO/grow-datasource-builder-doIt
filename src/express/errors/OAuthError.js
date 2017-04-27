function OAuthError(message) {
  this.message = message;
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, OAuthError);
  } else {
    this.stack = (new Error()).stack;
  }
}
OAuthError.prototype             = Object.create(Error.prototype);
OAuthError.prototype.name        = 'OAuthError';
OAuthError.prototype.constructor = OAuthError;
module.exports                   = OAuthError;