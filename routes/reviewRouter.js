const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getReview,
  setTourUserIds,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');
//now i want to protect  routes that no one can use if its not logged in and restrict for all expect for admin and lead guide
//? MERGE PARAMS
const router = express.Router({ mergeParams: true });

//auth
router.use(protect);

//router
router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);
router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;

//POST/tour/d234231/reviews
// *we want to get all reviews for a specific tour change just the getter .
//GET/tour/d234231/reviews
//GET/tour/d234231/reviews/93f1230a
