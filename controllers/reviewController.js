const Review = require('../models/reviewModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  if (!reviews) {
    return next(new appError('there are no reviews', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});
exports.getReview = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const review = await Review.findById(id);
  if (!review) {
    return next(new appError('there are no review', 400));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { content, rating, user, tour } = req.body;

  const review = await Review.create({ content, rating, user, tour });
  if (!review) {
    return next(new appError('review could not be created', 400));
  }
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
exports.updateReview = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { content, rating } = req.body;

  const review = await Review.findByIdAndUpdate(
    id,
    { content, rating },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!review) {
    return next(new appError('review could be updated', 400));
  }
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
exports.deleteReview = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    return next(new appError('review  could not be deleted', 400));
  }
  res.status(202).json({
    status: 'success',
    data: null,
  });
});
