const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
//
//route for this signup to create new user

router.post('/signup', signup);
router.post('/login', login);
//
//
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
//resetPassword

//login or reset password and system adminstator
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').patch(updateUser).get(getUser).delete(deleteUser);

module.exports = router;
