const express = require('express');
const router = express.Router();

const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  checkID,
  checkBody,
} = require('../controllers/tourController');

//params middleware :run on only who have params
router.param('id', checkID);

router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').patch(updateTour).get(getTour).delete(deleteTour);

module.exports = router;
