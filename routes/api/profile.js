const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Profile model
const Profile = require('../../models/Profile');
// User model
const User = require('../../models/User');

// @route  GET api/profile/test
// @desc   Test profile route
// @access Public
router.get('/test', (req, res) => {
  res.json({
    msg: 'Profile/test works',
  });
});

// @route  GET api/profile
// @desc   Get current user profile route
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  let errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      } else {
        res.json(profile);
      };
    })
    .catch(err => res.status(404).json(err));

});


module.exports = router;