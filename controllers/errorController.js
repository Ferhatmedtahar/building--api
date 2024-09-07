const appError = require('../utils/appError');

module.exports = (err, req, res, next) => {
  //default error bcs there are some error come without status code

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //DEVELOPMENT
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      err,
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }

  //PRODUCTION
  if (process.env.NODE_ENV === 'production') {
    let errorApp = { ...err };
    //errors from mongo db error
    if (err.name === 'CastError') {
      errorApp = handleCastErrorDB(err);
    }
    if (err.name === 'MongoServerError' && err.code === 11000) {
      errorApp = handleMongoDuplicate(err);
    }
    if (err.name === 'ValidationError') {
      errorApp = handleValidationError(err);
    }
    if (err.name === 'JsonWebTokenError') {
      errorApp = handleJWTError(err);
    }

    if (err.name === 'TokenExpiredError') {
      errorApp = handleTokenExpire(err);
    }
    if (errorApp.isOperational) {
      //OPERATIONAL ,trusted error : we can send to client, errors that we can define them
      res.status(errorApp.statusCode).json({
        status: errorApp.status,
        message: errorApp.message,
      });
    }

    //
    else {
      //NON OPERATIONAL ERROR :error didnt create our selfs
      //programming error or unknowen error , DONT LEAK ERROR DETAILS TO CLIENT
      console.error('error❌', err);
      res
        .status(500)
        .json({ status: 'error', message: 'Something went wrong' });
    }
  }
};

// err want to mark as operational so we create it from appError operational true not the mongoose generic  one
function handleCastErrorDB(err) {
  const message = `invalid ${err.path}:${err.value}`;
  return new appError(message, 400);
}

function handleMongoDuplicate(err) {
  const value = err.errmsg.match(/(["'])(\\?.)*\1/)[0];
  const message = `this ${value} already exist .Please use another value!`;
  return new appError(message, 409);
}

function handleValidationError(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  console.log(errors);

  const message = `invalid data input :${errors.join('. ')}
  `;

  return new appError(message, 404);
}

function handleJWTError(err) {
  return new appError('Invalid token , please log in again!', 401);
}

function handleTokenExpire(err) {
  return new appError('Your token had expired ! please log in again', 401);
}
