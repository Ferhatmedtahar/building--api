const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
//create a schema for the model

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      //using external library `validator js ` to validate from there function
      validate: {
        validator: function (val) {
          return validator.isAlpha(val);
        },
        message: 'name must contain only caracters',
      },

      maxlength: [40, 'a toue must have less than 40 caracteres'],
      minlength: [10, 'a toue must have more than 10 caracteres'],
    },
    duration: {
      type: Number,
      required: [true, 'A Tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour must have a group size'],
    },
    difficulty: {
      type: String,

      required: [true, 'A Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty is either :easy ,medium,difficult ',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'ratingAverage must be more than 1 '],
      max: [5, 'ratingAverage must be less than 5'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return this.price > value;
        },
        message: 'price should be highter than the discount ',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a  summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      trim: true,
      required: [true, 'A Tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      select: false,
      default: Date.now(),
    },
    slug: String,
    startDates: [Date],
  },
  {
    //after this we want to define it explicitly in our schema in options object and tell the schema that i want this virtuals to appear when i need it

    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);
//virtual properties : calculated from one to another to save space and not saved in the database

tourSchema.virtual('durationWeeks').get(function () {
  //we dont use arrow function bcs it doesnt have  its own this keyword.
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE : runs before the .save() and .create() not in insertMany
//pre save middleware
// tourSchema.pre('save', function (next) {
//   //this is the currently document which are getting proccessed
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

//

// //after saving
// tourSchema.post('save', function (document, next) {
//   console.log(document);
//   next();
// });

//2/ QUERY MIDDLEWARE

// tourSchema.pre(/^find/, function (next) {
//   this.find({});//chain more filter code
// });
// tourSchema.post(/^find/, function (docs,next) {
//   this.find({});//chain more filter code
// });

// created a modal to create tours out of it
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
