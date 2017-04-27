const message = `Your data contained an unsupported unicode character. Try and reduce your api call
                                   to not include the offending characters (most likely \u0000), or contact support@grow.com to help debug
                                   and resolve this particular issue.`;

function UnsupportedUnicodeError() {
  this.message = message;
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, UnsupportedUnicodeError);
  } else {
    this.stack = (new Error()).stack;
  }
}
UnsupportedUnicodeError.prototype             = Object.create(Error.prototype);
UnsupportedUnicodeError.prototype.name        = 'UnsupportedUnicodeError';
UnsupportedUnicodeError.prototype.constructor = UnsupportedUnicodeError;
module.exports                                = UnsupportedUnicodeError;
