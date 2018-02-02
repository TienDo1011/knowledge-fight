const { jwtSecretKey } = require('../config');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../db/userModel');

exports.register = function(req, res) {
  const newUser = new User(req.body);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save().then(user => {
    user.hash_password = undefined
    return res.json(user);
  })
  .catch(err => res.status(400).json({
    message: err
  }))
}

exports.signIn = function(req, res) {
  User.findOne({
    email: { $regex: new RegExp(req.body.email), $options: 'i' }
  }, (err, user) => {
    if (err) return res.status(500).json({message: err});
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.'})
    } else if (user) {
      if (!user.comparePassword(req.body.password)) {
        return res.status(401).json({ message: 'Authentication failed. Wrong password.'})
      } else {
        return res.json({
          token: jwt.sign({ email: user.email, name: user.name, _id: user._id}, jwtSecretKey),
          email: user.email,
          name: user.name
        });
      }
    }
  });
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};