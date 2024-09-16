const { default: mongoose, mongo } = require('mongoose');
const Tour = require('./TourModel');
// review :content ,rating , user id, tour id , createdAt:review Date
const reviewSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Review can not be empty!'],
      trim: true,
    },
    rating: {
      type: Number,
      max: 5,
      min: 1,
      // required: [true, 'Review can not have a Rating '],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a tour .'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must have a user who wrote it '],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//methods

//middlewares

reviewSchema.pre(/^find/, function (next) {
  //we dont want to leak data of users : we send just the name and photo for user and just the name of tour
  //REVIEW
  // NO NEED for that bcs i dontreallt need to know the tour details in review evem just the name bcs it query it again
  // i just  keep it referencing on it that i can from the tourget all reviews details
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // })
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});
reviewSchema.index(
  { tour: 1, user: 1 },
  {
    unique: true,
  },
);

//REVIEW `this` point to the model now in statics
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        AverageRating: { $avg: '$rating' },
      },
    },
  ]);
  //now after calculating this statistics we want to store it the Tour Document
  if (stats.length) {
    await Tour.findByIdAndUpdate(
      tourId,
      {
        ratingAverage: stats[0].AverageRating,
        ratingQuantity: stats[0].nRating,
      },
      { new: true, runValidators: true },
    );
  } else {
    await Tour.findByIdAndUpdate(
      tourId,
      {
        ratingAverage: 4.5,
        ratingQuantity: 0,
      },
      { new: true, runValidators: true },
    );
  }
};

//after we create new review
reviewSchema.post('save', function () {
  //this points to the current  review document .
  // this.constructor is the document than the constructor is the model who craeted that document

  this.constructor.calcAverageRatings(this.tour);
});

//REVIEW for findByIdAndUpdate findByIdAndDelete

// reviewSchema.pre(/^findOneAnd/, async function (next) {
// this point to the query not document

//? we pass the review data from the pre middlware to the post middleware
//   this.r = await this.findOne();
//   next();
// });

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAverageRatings(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
