// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'hello from the server side ', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.status(200).json({ message: 'post request was made' });
// });
const express = require('express');
const fs = require('fs');
const app = express();
//middleware :function that can modify the incoming data before it reach the server
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
});

app.post('/api/v1/tours', (req, res) => {});

//the server and the port
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
