const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Existing GET endpoint
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// Existing POST endpoint
blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  } catch (error) {
    response.status(500).json({ error: 'An error occurred while saving the blog' })
    console.error('Error saving blog:', error)
  }
})

// New DELETE endpoint
blogsRouter.delete('/:id', async (request, response) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (!deletedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.status(204).end() // Respond with status code 204 No Content upon successful deletion
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }
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