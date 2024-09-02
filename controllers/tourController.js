const Tour = require('../models/TourModel');
const APIFeatures = require('../utils/apiFeatures');

// exports.checkBody = (req, res, next) => {
//   if (!req.body?.name || !req.body?.price) {
//     return res.status(400).json({
//       status: 'bad request',
//       message: 'body doesn`t fullfill the requirements',
//     });
//   }
//   next();
// };

// manupilate the query object
exports.aliasTopTours = (req, res, next) => {
  req.query = {
    limit: '5',
    sort: '-ratingAverage,price',
    fields: 'name,price,ratingAverage,summary,difficulty',
  };
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id:req.params.id})   ... same

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.updateTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'succcss', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    //similar to doing query but allow us to manupilate data in diffrent ways
    //group documents seperate sum avg,.....
    //pass array of stagesEach stage performs an operation on the input documents. For example, a stage can filter documents, group documents, and calculate values.

    const stats = Tour.aggregate([{}]);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};
