class appError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    //property that allow us to know that the error is an error from the app
    // not a programing error or weird error from the other packages for example
    this.isOperational = true;
    //stack trace err.stack path where the error happend
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = appError;
