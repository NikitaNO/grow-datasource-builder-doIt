function NotFoundError(message) {
  this.message = message;
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, NotFoundError);
  } else {
    this.stack = (new Error()).stack;
  }
}
NotFoundError.prototype             = Object.create(Error.prototype);
NotFoundError.prototype.name        = 'NotFoundError';
NotFoundError.prototype.constructor = NotFoundError;
module.exports                      = NotFoundError;