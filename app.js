const express = require('express');
const morgan = require('morgan');

const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require(`./routes/tourRouter`);
const userRouter = require(`./routes/userRouter`);

const app = express();

//creating our own middleware and understand the middleware stack
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static('./public'));
app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//
//
//
//

//handling the undefined routes :ERROR
app.all('*', (req, res, next) => {
  //2-create the err and pass it throw the next function .
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//1 crete the middleware:GLOBAL ERROR HANDLER
app.use(globalErrorHandler);
module.exports = app;
