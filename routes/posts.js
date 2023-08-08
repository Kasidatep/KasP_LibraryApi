const express = require('express');
const postModel = require('../models/post');

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const posts = await postModel.getPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

router.get('/posts2', async (req, res) => {
  try {
    const postsWithUser = await postModel.getPostsUser();
    res.json(postsWithUser);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts with user data' });
  }
});

module.exports = router;