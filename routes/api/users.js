const express = require('express');

const router = express.Router();

// Bcrypt
const bcrypt = require('bcryptjs');

// User Model
const User = require('../../models/User');

// Gravatar
const gravatar = require('gravatar');

// @route  GET api/users/test
// @desc   Test users route
// @access Private
router.get('/test', (req, res) => {
  res.json({
    msg: 'Users/test works',
  });
});

// @route  GET api/users/register
// @desc   register users
// @access Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    // User exists
    if (user) {
      return res.status(400).json({
        email: 'Email already exists',
      });
    }
    const avatar = gravatar.url(req.body.email, {
      s: '200', // size
      r: 'pg', // Rating
      d: 'mm', // Default
    });

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
      password: req.body.password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            res.json(user);
          })
          .catch(err => console.log(err));
      });
    });
  });
});

module.exports = router;
