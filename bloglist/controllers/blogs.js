const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
// Existing GET endpoint
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Existing POST endpoint
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = request.user
  if (!user) {
    return response.status(404).json({ error: 'User not found' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// New DELETE endpoint
blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: 'Unauthorized' })
  } else {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).send('Blog deleted')
  }

  /*try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (!deletedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.status(204).end() // Respond with status code 204 No Content upon successful deletion
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }*/
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes: request.body.likes },
      { new: true } // Return the updated document
    )

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.json(updatedBlog)
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = blogsRouter