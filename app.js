const express = require('express');
const morgan = require('morgan');

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

module.exports = app;
