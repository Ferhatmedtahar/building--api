const Tour = require('../models/TourModel');

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

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  //1 filter

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    //the values which we want to specify : gte , gt, lte , lt
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    this.query.find(JSON.parse(queryStr));
    // let this.query = Tour.find(JSON.parse(queryStr));
    return this;
  }

  //2sort
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  //3fields :project

  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query.select(fields);
    } else {
      this.query.select('-__v');
    }
    return this;
  }
  //4pagination

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit; //data before the start of the page
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

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

//reFactored : all CRUD operation logic performed on the Tours

//build the query based on the filter , sort , pagination :
//1 ADVANCED FILTERING: filter based on all fields expect using limit and sort and page and fields
// const queryObj = { ...req.query };
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach((el) => delete queryObj[el]);
// //the values which we want to specify : gte , gt, lte , lt
// const queryStr = JSON.stringify(queryObj).replace(
//   /\b(gte|gt|lte|lt)\b/g,
//   (match) => `$${match}`,
// );
// let query = Tour.find(JSON.parse(queryStr));

// //2 SORT based on one fields not like filter we sort based on some values
// // sort( val val) are seperated by space , but in the url we get it sepearted by comma

// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }

//3/limiting fleids : project
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query.select(fields);
// } else {
//   query.select('-__v');
// }
// //4 pagination : page=X&limit=Y    {.skip(limit*page).limit(default limit)}

// //page1:1-2  , page2:3-4 page3:5-6 ,...ect we want to skip the prev page not this page also haha
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 10;
// const skip = (page - 1) * limit; //data before the start of the page
// query = query.skip(skip).limit(limit);
// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('this page does not exist');
// }
