function RateLimitError(message) {
  this.message = message;
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, RateLimitError);
  } else {
    this.stack = (new Error()).stack;
  }
}
RateLimitError.prototype             = Object.create(Error.prototype);
RateLimitError.prototype.name        = 'RateLimitError';
RateLimitError.prototype.constructor = RateLimitError;
module.exports                       = RateLimitError;
