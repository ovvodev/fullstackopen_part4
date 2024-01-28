
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
  let savedBlog = await Blog.findOne({ title: 'New Blog Post' })

  // Verify that the unique identifier property 'id' exists in the new blog post
  expect(savedBlog.id).toBeDefined()
  // Verify that the default unique identifier property '_id' does not exist in the new blog post
  expect(savedBlog._id).toBeUndefined()

  // Reset the toJSON transform to evaluate the saved blog object without the transform
  blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  // Retrieve the new blog post from the database again to test without the transform
  savedBlog = await Blog.findOne({ title: 'New Blog Post' })

  // Verify that the unique identifier property 'id' exists in the new blog post without the transform
  expect(savedBlog.id).toBeDefined()
  // Verify that the default unique identifier property '_id' exists in the new blog post without the transform
  expect(savedBlog._id).toBeDefined()
})

test('creating a new blog post increases the total number of blogs by one', async () => {
  const initialBlogs = await Blog.find({})

  const newBlog = {
    title: 'Test Blog Post',
    author: 'Test Author',
    url: 'www.testblogpost.com',
    likes: 20
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const finalBlogs = await Blog.find({})
  expect(finalBlogs).toHaveLength(initialBlogs.length + 1)
})

test('blog posts has the like property or not and the default value is 0', async () => {
  const allBlogs = await Blog.find({})

  for(let blog of allBlogs) {
    if (!blog.likes) {
      const { likes, ...blogWithoutLikes } = blog.toJSON()

      const response = await api
        .post('/api/blogs')
        .send(blogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(response.body.likes).toBe(0)
    }
  }
})

afterAll(async () => {
  await mongoose.connection.close()
})