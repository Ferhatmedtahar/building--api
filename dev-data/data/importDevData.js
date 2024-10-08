const mongoose = require('mongoose');

const fs = require('fs');

const Tour = require('./../../models/TourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

const dotenv = require('dotenv');

const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config.env') });

const DB = process.env.APPDEV;

mongoose.connect(DB).then(() => console.log('DB connnection successful '));

//read file json

const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('./reviews.json', 'utf-8'));

//import tours to the DB

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete all data from collection

const DeleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  DeleteData();
}
