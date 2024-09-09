const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require(`./routes/tourRouter`);
const userRouter = require(`./routes/userRouter`);

const app = express();
//securtiy http headers
app.use(helmet());
//creating our own middleware and understand the middleware stack
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//rate limiter is a middle ware function created based on the objects
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  //100 requests in 1h per ip if he pass that limit he get an error and this error message we specify
  message: 'Too many requests from this ip, please try again in hour',
});
//limit access to the /api route only .
app.use('/api', limiter);

//body parser reading  data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  }),
);

// defend attack againt nosql query injection aand XSS attacks SO IMPORT
//easy to do anything , using all emails aand popular passwords

//check the body and params and query string aand remove all dollar and dots
app.use(mongoSanitize());
app.use(xss());

//prevent parameter pollution and we can white list some parameters to be able to be duplicated
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'ratingAverage',
      'difficulty',
      'difficulty',
      'price',
    ],
  }),
);

// serving static data
app.use(express.static('./public'));
//testing and looking headers and time
app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});
//routes
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
