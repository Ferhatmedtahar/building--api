const User = require('../models/userModel');
exports.getAllUsers = async (req, res) => {
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
};
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
