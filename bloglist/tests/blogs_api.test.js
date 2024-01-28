
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'nnw theme',
    author: 'Rolin',
    url: 'www.tolking.com',
    likes: 5,
  },
  {
    title: 'Robin Hood',
    author: 'petro',
    url: 'www.petro.com',
    likes: 8,
  },
]

beforeEach(async () => {
  await Blog.collection.drop({})
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
}, 20000)

test('blog posts are returned as json', async () => {
  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  // Assuming the response body is an array of blog posts
  const blogPosts = res.body
  // Verify the correct amount of blog posts
  expect(blogPosts.length).toBe(initialBlogs.length)
})

/*test('blog posts have unique identifier property named id', async () => {
  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogPosts = res.body;
  expect(blogPosts.length).toBe(initialBlogs.length);

  for (let post of blogPosts) {
    // Verify that the unique identifier property 'id' exists in each blog post
    expect(post.id).toBeDefined();
    // Verify that the default unique identifier property '_id' does not exist in each blog post
    expect(post._id).toBeUndefined();
  }
})*/

test('blog posts have unique identifier property named id', async () => {
  // Create a new blog post using the Mongoose model
  const newBlog = new Blog({
    title: 'New Blog Post',
    author: 'Test Author',
    url: 'www.testblogpost.com',
    likes: 10
  })

  // Save the new blog post to the database
  await newBlog.save()

  // Retrieve the new blog post from the database
  const savedBlog = await Blog.findOne({ title: 'New Blog Post' })

  // Verify that the unique identifier property 'id' exists in the new blog post
  expect(savedBlog.id).toBeDefined()
  // Verify that the default unique identifier property '_id' does not exist in the new blog post
  expect(savedBlog._id).toBeUndefined()
})
afterAll(async () => {
  await mongoose.connection.close()
})