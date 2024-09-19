const User = require('../models/userModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const sharp = require('sharp');

const multer = require('multer');

// const multerStrorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });
const multerStrorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Not an image!, please upload only Images.', 400), false);
  }
};

// where we want to save our images which got uploaded
const upload = multer({ storage: multerStrorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

//!resize the user photo

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  //redefine the filename bcs we removed the storage from disk to memory to process the images before its saved
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  // sharp
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  //write in in a file in our disk
  next();
});

// REVIEW update the current user data :name & email data :POST

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
  const filteredBody = filterObj(req.body, 'name', 'email');
  //if we want to add other fields we change just this
  if (req.file) filteredBody.photo = req.file.filename;
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

//

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

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

//admin operations
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
//
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined ! , please Login/SignUp instead ',
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
