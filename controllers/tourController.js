const Tour = require('../models/TourModel');
const APIFeatures = require('../utils/apiFeatures');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query = {
    limit: '5',
    sort: '-ratingAverage,price',
    fields: 'name,price,ratingAverage,summary,difficulty',
  };
  next();
};

// manupilate the query object

exports.getAllTours = catchAsync(async (req, res, next) => {
  //create features object and excute the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();
  const tours = await features.query;
  //send the response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

//get one tour
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  //Tour.findOne({_id:req.params.id})   ... same
  if (!tour) {
    return next(new appError('tour not found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  //query methods return query
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) next(new appError('no tour found with that ID'));
  res.status(204).json({ status: 'succcss', data: null });
});

exports.getTourStats = async (req, res) => {
  try {
    //similar to doing query but allow us to manupilate data in diffrent ways
    //group documents seperate sum avg,.....
    //pass array of stagesEach stage performs an operation on the input documents. For example, a stage can filter documents, group documents, and calculate values.

    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          //_id we group by it ,if we dont want to group so its null and the name of new field after a operations
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingQuanitity' },
          averageRating: { $avg: '$ratingAverage' },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          averagePrice: 1,
        },
      },
      // {
      //   $match: {
      //     _id: { $ne: 'easy' },
      //   },
      // },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    // we need to analyse each tour startDate in our year and group with month so group by year than month
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },

          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },

      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
// const plan = await Tour.aggregate([
//   {
//     $unwind: '$startDates',
//   },
//   {
//     $project: {
//       Year: { $year: '$startDates' },
//       Month: { $month: '$startDates' },
//     },
//   },
//   {
//     $match: { Year: { $eq: year } },
//   },
//   {
//     $group: { _id: '$Month', numTours: { $sum: 1 } },
//   },
// ]);
