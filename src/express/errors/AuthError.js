function AuthError(message) {
  this.message = message;
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, AuthError);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthError.prototype             = Object.create(Error.prototype);
AuthError.prototype.name        = 'AuthError';
AuthError.prototype.constructor = AuthError;
module.exports                  = AuthError;