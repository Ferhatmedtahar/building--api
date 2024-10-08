const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const Email = require('../utils/email');
const crypto = require('crypto');

//
//
//signToken
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
//
//
//createSendToken
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  //remove the password from the output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

/*

//* the auth flow code now

*/

//*sign up
//REVIEW

exports.signup = catchAsync(async (req, res, next) => {
  // not good image a user send his body including part of this data role :admin .
  //so we distructur our body .
  const { name, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  const url = `${req.protocol}://${req.get('host')}`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();
  // const token = jwt.sign(payload:{ id: newUser._id }, 'secret');
  createSendToken(newUser, 201, res);
});

//REVIEW

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
  createSendToken(user, 200, res);
});

//REVIEW

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
  res.locals.user = currentUser;

  next();
});

//

//REVIEW
//roles is array of the allowed :admin and lead guide.
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError(`you don't have permission to perform this action!`, 403),
      );
    }
    next();
  };
};

//forgot password functionallity
//REVIEW

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on POSTed email
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) next(new appError('there is no user with that email', 404));

  // 2) Generate the random reset token
  //intance method in user model bcs its related to the user
  const resetToken = user.createPasswordResetToken();
  // this will allow us to save this without before save . always read docs
  await user.save({ validateBeforeSave: false });

  // 3) send it to user's email
  // the url path to the reset alogn with the token
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forget your password ? Submit this request with your password amd password Confirm to :${resetURL}\n
    if u didn't forget your password , please ignore this email`;
  try {
    await new Email(user, resetURL).sendResetPassword();
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset Token (valid for 10 min)',
    //   message,
    // });
    res.status(200).json({
      status: 'success',
      message: 'token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new appError(
        'There was error sending this email , Try again later !',
        500,
      ),
    );
  }
});

//
//
//reset password functionallity
//REVIEW

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1/ get user based on the token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2/ if token has not expired && there is user , set the new password

  if (!user) return next(new appError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3/ update changedPasswordAt property for the user

  // we do this in middleware in usermodel not method but a middleware pre, post

  //4/ Log the user in : send jwt
  createSendToken(user, 200, res);
});

//update user password
//REVIEW

exports.updatePassword = catchAsync(async (req, res, next) => {
  //user need to pass his password as security mesuare
  //1 get user
  const currentPassword = req.body.currentPassword;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) next(new appError('user not found!', 404));

  // 2 check if password correct

  const correctpassword = await user.correctPassword(
    currentPassword,
    user.password,
  );
  if (!correctpassword)
    next(new appError('wrong password, please try again!', 401));

  //3 update the password

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  //4 log the user again : send new token

  createSendToken(user, 200, res);
});
//REVIEW

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
//REVIEW

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
