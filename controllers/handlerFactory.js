const APIFeatures = require('../utils/apiFeatures');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new appError(`no ${model} found with that ID`, 404));
    }
    res.status(204).json({ status: 'succcss', data: null });
  });
};

exports.createOne = (model) => {
  return catchAsync(async (req, res, next) => {
    const newDoc = await model.create(req.body);
    if (!newDoc) {
      return next(
        new appError(`${model} could not be created! , please try later.`, 404),
      );
    }
    res.status(201).json({
      status: 'success',
      data: {
        newDoc,
      },
    });
  });
};

exports.updateOne = (model) => {
  return catchAsync(async (req, res, next) => {
    const id = req.params.id;
    //query methods return query
    const updatedDoc = await model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) {
      return next(
        new appError(`${model} could not be updated! , please try later.`, 404),
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedDoc,
      },
    });
  });
};

exports.getOne = (model, populated = '') => {
  return catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let query = model.findById(id);
    if (populated) query = query.populate(populated);

    const doc = await query;
    if (!doc) {
      return next(new appError(`there are no ${model}`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

exports.getAll = (model) => {
  return catchAsync(async (req, res, next) => {
    // to all nested get reviews in tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    //create features object and excute the query
    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();
    //add explain
    // const doc = await features.query.explain();
    const doc = await features.query;
    //send the response
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { doc },
    });
  });
};
