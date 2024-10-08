const express = require('express');

const {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../controllers/authController');

const router = express.Router();

//
//route for this signup to create new user

router.post('/signup', signup);
router.post('/login', login);
//
//
//resetPassword

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//!you need to be auth always from this point
//update password:

router.patch('/updatePassword', protect, updatePassword);

//
router.get('/getMe', protect, getMe, getUser);
router.get('/me', getMe, getUser);
router.patch('/updateMe', protect, uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', protect, deleteMe);

//login or reset password and system adminstator
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').patch(updateUser).get(getUser).delete(deleteUser);

module.exports = router;
