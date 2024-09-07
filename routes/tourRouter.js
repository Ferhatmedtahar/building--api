const express = require('express');
const router = express.Router();

const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');

//params middleware :run on only who have params
// router.param('id', checkID);

//we use middle ware to change the request object as we need that the url is simple without that queries.
router.route('/stats').get(getTourStats);
router.route('/monthlyPlan/:year').get(getMonthlyPlan);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/').get(protect, getAllTours).post(createTour);

router
  .route('/:id')
  .patch(updateTour)
  .get(getTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
//we pass the role which can interact with this recourse.
module.exports = router;
