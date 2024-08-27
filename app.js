const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
//morgan middleware
morgan; //
//middleware :function that can modify the incoming data before it reach the server

app.use(morgan('dev'));

app.use(express.json());

//creating our own middleware and understand the middleware stack
//first
app.use((req, res, next) => {
  console.log('hello from the middle ware');
  next();
});

//second
app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});

//parse the tours and read the file sync
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//tours

const tourRouter = express.Router();
const userRouter = express.Router();
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').patch(updateTour).get(getTour).delete(deleteTour);

//users
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').patch(updateUser).get(getUser).delete(deleteUser);

//
//
//
//
//the server and the port
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//users route CRUD operations

function getAllUsers(req, res) {
  res.status(500).json({
    status: 'error ',
    message: 'route are not implemented',
  });
}

function getUser(req, res) {
  res.status(500).json({
    status: 'error ',
    message: 'route are not implemented',
  });
}

function deleteUser(req, res) {
  res.status(500).json({
    status: 'error ',
    message: 'route are not implemented',
  });
}

function updateUser(req, res) {
  res.status(500).json({
    status: 'error ',
    message: 'route are not implemented',
  });
}

function createUser(req, res) {
  res.status(500).json({
    status: 'error ',
    message: 'route are not implemented',
  });
}

//
//
//
//reFactored : all CRUD operation logic performed on the Tours

function getAllTours(req, res) {
  // console.log(req.time);
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
}

function getTour(req, res) {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour could not be found:Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
}

function createTour(req, res) {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  // tours = [...tours, newTour]; err
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) throw new Error('Tour can`t be created');
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  // res.status(200).send('done');
}

function updateTour(req, res) {
  const id = req.params.id * 1;

  if (id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour could not be found:Invalid ID',
    });
  }

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
    }
  );
}

function deleteTour(req, res) {
  const id = req.params.id * 1;

  if (id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour could not be found:Invalid ID',
    });
  }
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
    }
  );
}

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
