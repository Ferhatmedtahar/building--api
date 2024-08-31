const Tour = require('../models/TourModel');

//parse the tours and read the file sync
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkBody = (req, res, next) => {
//   if (!req.body?.name || !req.body?.price) {
//     return res.status(400).json({
//       status: 'bad request',
//       message: 'body doesn`t fullfill the requirements',
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
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
  // here the method called by the document
  // const tour = new Tour({!data here});
  // tour.save()   {return a promise }
  //or but here we call the method directly on the modal
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

//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   // tours = [...tours, newTour]; err
//   tours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       if (err) throw new Error('Tour can`t be created');
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     },
//   );
//   // res.status(200).send('done');
// };

//   const id = req.params.id * 1;

//   let tour = tours.find((el) => el.id === id);
//   tour = { ...tour, ...req.body };
//   tours[id] = tour;

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       if (err) {
//         throw new Error('could not write in the file ');
//       }
//       res.status(200).json({
//         status: 'success',
//         data: {
//           tour,
//         },
//       });
//     },
//   );
// };

//         status: 'success',
//   const id = req.params.id * 1;

//   const newTours = tours.filter((el) => el.id !== id);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(newTours),
//     (err) => {
//       if (err) {
//         throw new Error('could not write in the file ');
//       }
//       res.status(204).json({
//         status: 'success',
//         mdata: null,
//       });
//     },
//   );
// };
