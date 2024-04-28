
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

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

/*beforeEach(async () => {
  await Blog.collection.drop({})
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
}, 20000)
*/

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('Adding a new blog post', () => {test('succeeds with valid token', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'James Bond',
    url: 'http://example.com/new-blog',
    likes: 30
  }

  const user = await User.findOne({})
  const loginResponse = await api
    .post('/api/login')
    .send({ username: user.username, password: 'password' })
    .expect(200)

  const token = loginResponse.body.token

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(blog => blog.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(newBlog.title)
})

test('fails with status code 401 if token is not provided', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'James Bond',
    url: 'http://example.com/new-blog',
    likes: 30
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})
})


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

test('blog posts are missing url or title', async () => {
  const allBlogs = await Blog.find({})

  for(let blog of allBlogs) {
    if (!blog.title) {
      const { title, ...blogWithoutTitle } = blog.toJSON()
      await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400)
    }
  }
  for(let blog of allBlogs) {
    if (!blog.url) {
      const { url, ...blogWithoutUrl } = blog.toJSON()
      await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400)
    }
  }
})

test('deleting a blog post returns status code 204', async () => {
  const blogsBeforeDelete = await Blog.find({})
  const blogToDelete = blogsBeforeDelete[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAfterDelete = await Blog.find({})
  expect(blogsAfterDelete).toHaveLength(blogsBeforeDelete.length - 1)
})

test('deleting a non-existing blog post returns status code 404', async () => {
  const nonExistingId = '5f25d897b6c9bb03d8e4a8f1' // Assuming this ID does not exist

  await api
    .delete(`/api/blogs/${nonExistingId}`)
    .expect(404)
})
test('updating a blog post returns status code 200', async () => {
  const blogsBeforeUpdate = await Blog.find({})
  const blogToUpdate = blogsBeforeUpdate[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({
      likes: 10
    })
    .expect(200)
})
afterAll(async () => {
  await mongoose.connection.close()
})