const User = require('../models/userModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//update the current user data :name & email data :POST

exports.updateMe = catchAsync(async (req, res, next) => {
  //1 create error if user post password data

  if (req.body.password || req.body.passwordConfirm) {
    next(
      new appError(
        'this route is not for password update , please use /updatePassword ',
        400,
      ),
    );
  }
  //2 update user document
  //we can use find by id and update and we want to filter t he body to update only the fields which we want not other fields .
  const filteredBody = filterObj(req.body, 'name', 'email'); //if we want to add other fields we change just this

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

//delete the user by himself: deActive the account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//admin op
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    res.status(500).json({
      status: 'error ',
      message: 'route are not implemented',
    });
  }
  res.status(200).json({
    status: 'success ',
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error ',
    message: 'route are not implemented',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error ',
    message: 'route are not implemented',
  });
};
//admin updating
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error ',
    message: 'route are not implemented',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error ',
    message: 'route are not implemented',
  });
};

//for update me
function filterObj(obj, ...allowedFields) {
  const newobj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newobj[el] = obj[el];
    }
  });
  return newobj;
}
