const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

//signToken
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//
//sign up
exports.signup = catchAsync(async (req, res, next) => {
  // not good image a user send his body including part of this data role :admin .
  //so we distructur our body .
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  // const token = jwt.sign(payload:{ id: newUser._id }, 'secret');
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1/ check if email and password exist
  if (!email || !password) {
    return next(new appError('please provide email and password', 400));
  }

  //2/ check user exists && password is correct
  //like this we can select a field which are not selected `override it`
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Incorrect email or password', 401));
  }
  //3/ if everything ok . send the token to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) get token and check if its there (exist)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    next(
      new appError('You are not logged in!, please log in to get access', 401),
    );
  // 2) most imporetant :`verification`:validate token using jwt algorithm bcs we dont want that our payload got changes or touch
  // decoded is the payload which is  the id and expires  time
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3)check if the user still exist

  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new appError(
        `the user belonging to this token does no longer exist `,
        401,
      ),
    );
  // 4) if user changed password after the jwt token was issued
  //we do this bcs if the user changed his password bcs he think somewone else user !
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new appError(
        `user recently changed password! please  log in again.`,
        401,
      ),
    );
  }

  //than we will grant the access to  rpotected route
  req.user = currentUser;
  next();
});
