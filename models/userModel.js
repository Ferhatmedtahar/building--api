const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
//name , email , photo ,role, password , passwordConfirm ,
// methods:correctPassword:check if the passed password are correct with encrypted one in login
// ,passwordChangedAt:compare if password changed after IAT
//createPasswordResetToken:
//middleWare to encrypt password and delete the confirm password
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
    maxlength: [40, 'user name must be less than 40 caracteres'],
    minlength: [2, 'user name must be more than 5 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    //should be unique and lowercase
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'email are not correct'],
    maxlength: [50, 'user email must be less than 50 caracteres'],
    minlength: [10, 'user email must be more than 5 caracteres'],
  },
  //place to the pic path
  photo: String,
  //role
  role: {
    type: String,
    //diffrent names depend on the app
    enum: ['admin', 'user', 'guide', 'lead-guide'],
    default: 'user',
  },
  //
  password: {
    type: String,
    required: [true, 'please provide a password'],
    select: false,
    minlength: [8, 'user password must be more than 5 caracteres'],
  },
  passwordConfirm: {
    type: String,
    required: [true, ' please confirm the  password'],
    validate: {
      //this only work on .create() / .save
      validator: function (value) {
        return this.password === value;
      },
      message: 'mismatch password and confirm password',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
});

//
//METHODS WE CAN CALL IN AUTH CONTROLLER TO DO STUFF//AVAILEBLE IN EACH DOCUMENT
//we will create intance method that ar availbe in every document
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//changed password check
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const toTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    //password changed after the jwt was issued
    return toTimeStamp > JWTTimeStamp;
  }
  //false means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  //behave like a password

  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//
//MIDDLEWARES BEFORE OR AFTER THE DOCUMENTS ARE SAVE
//encrypt the password
userSchema.pre('save', async function (next) {
  //if password are not encypted
  if (!this.isModified('password')) return next();
  //hash the password : well studied Bcrypt algorithm with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete the password confirm
  this.passwordConfirm = undefined;
  next();
});

//
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//query middleware
userSchema.pre(/^find/, async function (next) {
  //this point to the query
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
