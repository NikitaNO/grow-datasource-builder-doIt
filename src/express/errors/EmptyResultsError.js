function EmptyResultsError(message) {
  this.message = message;
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, EmptyResultsError);
  } else {
    this.stack = (new Error()).stack;
  }
}
EmptyResultsError.prototype             = Object.create(Error.prototype);
EmptyResultsError.prototype.name        = 'EmptyResultsError';
EmptyResultsError.prototype.constructor = EmptyResultsError;
module.exports                          = EmptyResultsError;