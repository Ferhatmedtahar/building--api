const { default: mongoose, mongo } = require('mongoose');
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

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
