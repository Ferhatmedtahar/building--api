const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const { signup } = require('../controllers/authController');
//
//route for this signup to create new user

router.post('/signup', signup);
//login or reset password and system adminstator
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').patch(updateUser).get(getUser).delete(deleteUser);

module.exports = router;
