const appError = require('../utils/appError');

module.exports = (err, req, res, next) => {
  //default error bcs there are some error come without status code

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }

  //PRODUCTION
  if (process.env.NODE_ENV === 'production') {
    let errorDB = { ...err };
    //errors from mongo db error
    if (err.name === 'CastError') {
      errorDB = handleCastErrorDB(err);
    }
    if (err.name === 'MongoServerError' && err.code === 11000) {
      errorDB = handleMongoDuplicate(err);
    }
    if (err.name === 'ValidationError') {
      errorDB = handleValidationError(err);
    }

    if (errorDB.isOperational) {
      //OPERATIONAL ,trusted error : we can send to client, errors that we can define them
      res.status(errorDB.statusCode).json({
        status: errorDB.status,
        message: errorDB.message,
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
