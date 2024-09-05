const dotenv = require('dotenv');

//we need to have when we host the app a tool to restart the program not keeping close all the time
process.on('unhandledRejection', (err) => {
  console.log('unhandled Rejection ❌ shutting down the server');
  console.log(err.name, err.message);
  //close the server will give time to handle the pending requests than close the app
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception ❌ shutting down the server');
  console.log(err.name, err.message);
  //we need to crach the app not to close server
  // bcs the node  process will be in unclean state so we crash than restart it
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const mongoose = require('mongoose');

const DB = process.env.APPDEV;

//this would work just fine to handle REJECTED PROMISE but we can do this globally
mongoose.connect(DB).then(() => console.log(`DB connection successful !`));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
