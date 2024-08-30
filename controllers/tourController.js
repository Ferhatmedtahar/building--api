const fs = require('fs');
//parse the tours and read the file sync
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkID = (req, res, next, val) => {
  if (val > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour could not be found:Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body?.name || !req.body?.price) {
    return res.status(400).json({
      status: 'bad request',
      message: 'body doesn`t fullfill the requirements',
    });
  }
  next();
};

//reFactored : all CRUD operation logic performed on the Tours

exports.getAllTours = (req, res) => {
  // console.log(req.time);
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  // tours = [...tours, newTour]; err
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) throw new Error('Tour can`t be created');
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
  // res.status(200).send('done');
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;

  let tour = tours.find((el) => el.id === id);
  tour = { ...tour, ...req.body };
  tours[id] = tour;

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        throw new Error('could not write in the file ');
      }
      res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
    },
  );
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;

  const newTours = tours.filter((el) => el.id !== id);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newTours),
    (err) => {
      if (err) {
        throw new Error('could not write in the file ');
      }
      res.status(204).json({
        status: 'success',
        mdata: null,
      });
    },
  );
};

// old way and the new way is creating a route and specify the methods which should be in it
// //GET
// app.get('/api/v1/tours', getAllTours);

// //GET by id
// app.get(`/api/v1/tours/:id`, getTour);

// //POST
// app.post('/api/v1/tours', createTour);

// //PATCH
// app.patch('/api/v1/tours/:id', updateTour);

// //DELETE
// app.delete('/api/v1/tours/:id',deleteTour);
