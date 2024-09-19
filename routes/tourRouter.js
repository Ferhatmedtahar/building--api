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
  getToursWithin,
  getDistances,
  getMonthlyPlan,
  uploadTourImages,
  resizeTourImages,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRouter');

//we use middle ware to change the request object as we need that the url is simple without that queries.
//REVIEW we are mounting a router in this url
router.use('/:tourId/reviews', reviewRouter);

router.route('/stats').get(getTourStats);

router
  .route('/monthlyPlan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

//?we could do this is search params but its more clean doing this in the url + used alot (url contain alot options )
//tours-distance?distance=200&center=-34,50&unit=km
// BETTER tours-distance/200/center/-34,50/uni/km

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

//*geo spatial aggerations
router.route('/distances/:latlng/unit/:unit').get(getDistances);

/*

//*the CRUD operations on the tours


*/

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour,
  )
  .get(getTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
//we pass the role which can interact with this recourse.

module.exports = router;
// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

//POST/tour/d234231/reviews
//GET/tour/d234231/reviews
//GET/tour/d234231/reviews/93f1230a

//params middleware :run on only who have params
// router.param('id', checkID);
