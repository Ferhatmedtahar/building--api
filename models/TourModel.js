const mongoose = require('mongoose');

//create a schema for the model

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});
// created a modal to create tours out of it

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
