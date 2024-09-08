const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../controllers/authController');
//
//route for this signup to create new user

router.post('/signup', signup);
router.post('/login', login);
//
//
//resetPassword

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//update password:

router.patch('/updatePassword', protect, updatePassword);

//
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

//login or reset password and system adminstator
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').patch(updateUser).get(getUser).delete(deleteUser);

module.exports = router;
