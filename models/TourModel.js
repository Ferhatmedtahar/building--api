const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');
//create a schema for the model

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'a tour must have less than 40 caracteres'],
      minlength: [10, 'a tour must have more than 10 caracteres'],
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

    //location
    //embedded
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      adress: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
          coordinates: [Number],
          adress: String,
          description: String,
          day: Number,
        },
      },
    ],
    //guides
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
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

//virtual populate
//. virtual() , name of this field,
//objectof options:
//1/name of model which we want to ref
//2/ specify 2 fields : foreign field and local field
//foreign field :name of field in the other fields
//local field : in this cuurent firlds
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// created a modal to create tours out of it
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
//

//

//

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
