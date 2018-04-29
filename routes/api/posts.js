const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post Model
const Post = require('../../models/Post');

// Post validation
const validatePostInput = require('../../validation/post');

// @route  GET api/posts/test
// @desc   Test post route
// @access Public
router.get('/test', (req, res) => {
  res.json({
    msg: 'Posts/test works',
  });
});

// @route  POST api/posts
// @desc   Create Post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Validation
  const {
    errors,
    isValid,
  } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));

});



module.exports = router;
