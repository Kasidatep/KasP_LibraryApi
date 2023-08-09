const express = require('express')
const postModel = require('../models/post')
const router = express.Router()

router.get('/posts', async (req, res) => {
  try {
    const posts = await postModel.getPosts()
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' })
  }
})

router.get('/posts/all', async (req, res) => {
  try {
    const postsWithUser = await postModel.getPostsUser()
    res.json(postsWithUser)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts with user data' })
  }
})

router.get('/posts/:id', async (req, res) => {
  try {
    const postsById = await postModel.getPostsById(req.params.id)
    if (postsById.length > 0) {
      const singlePost = postsById[0]
      res.json(singlePost);
    } else {
      res.status(404).json({ error: 'Post not found' })
    }
  } catch (error) {
    res.status(500).json({ error: `Error fetching posts ${req.params.id} with user data | ${error.message}` })
  }
})


router.post('/posts', async (req, res) => {

  try {
    const { title, description, img, visible, userId, postDate } = req.body
    if (!req.body.title || !req.body.description || !req.body.visible.toString().match(/^[1-2]{1}$/g) || !req.body.userId) {
      res.status(400)
      res.json({ message: "Bad Request" })
    }

    const newPost = {
      title,
      description,
      img,
      visible,
      userId,
      postDate,
    }

    const result = await postModel.createPost(newPost)
    res.json(result)
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ error: 'An error occurred while creating the post.' })
  }
})

router.put('/posts/:id', async (req, res) => {
  try {
    const { title, description, img, visible, userId, postDate } = req.body
    if (!req.body.title || !req.body.description || !req.body.visible.toString().match(/^[1-2]{1}$/g) || !req.body.userId) {
      res.status(400)
      res.json({ message: "Bad Request" })
    }
    const updatePost = {
      id:req.params.id,
      title,
      description,
      img,
      visible,
      userId,
      postDate,
    }

    const result = await postModel.updatePost(updatePost, req.params.id)
    res.json(result)
  } catch (error) {
    console.error('Error update post:', error)
    res.status(500).json({ error: 'An error occurred while updating the post.' })
  }
})

router.delete('/posts/:id', async (req, res) => {
  try{
    const result = await postModel.deletePostsById(req.params.id)
    res.json(result)
  } catch (error) {
    console.error('Error delete post:', error)
    res.status(500).json({ error: 'An error occurred while deleting the post.' })
  }
})

module.exports = router

