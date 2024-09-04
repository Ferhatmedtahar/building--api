module.exports = (err, req, res, next) => {
  //default error bcs there are some error come without status code
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
