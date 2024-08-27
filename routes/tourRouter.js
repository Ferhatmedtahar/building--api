const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
} = require('../controllers/tourController');

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').patch(updateTour).get(getTour).delete(deleteTour);

module.exports = router;
