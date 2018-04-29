const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post Model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');

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


// @route  GET api/posts
// @desc   GET Posts
// @access Public
router.get('/', (req, res) => {

  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts)
    })
    .catch(err => res.status(404)
      .json({ nopostsfound: 'No posts found' }));
});


// @route  GET api/posts/:id
// @desc   GET ONE Post by id
// @access Public
router.get('/:id', (req, res) => {

  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404)
      .json({ nopostfound: 'No post found with the id' }));
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

// @route  DELETE api/posts/:id
// @desc   Delete a  Post
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          } else {
            // Delete
            post.remove()
              .then(() => res.json({ success: true }));
          }
        })
        .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
    })
});

// @route  POST api/posts/like/:id
// @desc   Like a  Post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // See if > 0 means user already liked the post
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'User already liked the post' });

          } else {
            // Add the like to the post
            post.likes.unshift({ user: req.user.id });
            // Save to db
            post.save().then(post => res.json(post));
          }

        })
        .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
    })
});

// @route  POST api/posts/dislike/:id
// @desc   Unlike / Dislike a Post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // See if = 0 means user has not liked the post already
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: 'User already not liked the post before' });

          } else {
            // Add the unlike to the post
            const removeIndex = post.likes
              .map(item => item.user.toString())
              .indexOf(req.user.id);

            // splice the item out of the array
            post.likes.splice(removeIndex, 1);
            // Save to DB
            post.save().then(post => res.json(post));
          }
        })
        .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
    })
});

module.exports = router;
