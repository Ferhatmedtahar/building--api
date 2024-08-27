const express = require('express');
const fs = require('fs');
const app = express();
//middleware :function that can modify the incoming data before it reach the server
app.use(express.json());
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//GET
app.get('/api/v1/tours', getAllTours);

//GET by id
app.get(`/api/v1/tours/:id`, getTour);

//POST
app.post('/api/v1/tours', createTour);

//PATCH
app.patch('/api/v1/tours/:id', updateTour);

//DELETE
app.delete('/api/v1/tours/:id');

//the server and the port
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//
//
//reFactored : all CRUD operation logic performed

function getAllTours(req, res) {
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
