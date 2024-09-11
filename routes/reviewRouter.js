const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');
//now i want to protect  routes that no one can use if its not logged in and restrict for all expect for admin and lead guide
const router = express.Router();
router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);
router
  .route('/:id')
  .get(getReview)
  .patch(protect, restrictTo('user'), updateReview)
  .delete(protect, restrictTo('user'), deleteReview);

module.exports = router;
