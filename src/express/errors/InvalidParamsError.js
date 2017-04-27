function InvalidParamsError(message) {
  this.message = message;
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, InvalidParamsError);
  } else {
    this.stack = (new Error()).stack;
  }
}
InvalidParamsError.prototype             = Object.create(Error.prototype);
InvalidParamsError.prototype.name        = 'InvalidParamsError';
InvalidParamsError.prototype.constructor = InvalidParamsError;
module.exports                           = InvalidParamsError;
