
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: "nnw theme",
    author: "Rolin",
    url: "www.tolking.com",
    likes: 5,
  },
  {
    title: "Robin Hood",
    author: "petro",
    url: "www.petro.com",
    likes: 8,
  },
];

beforeEach(async () => {
  await Blog.collection.drop({});
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
}, 20000);

test('blog posts are returned as json', async () => {
  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  // Assuming the response body is an array of blog posts
  const blogPosts = res.body;
  // Verify the correct amount of blog posts
  expect(blogPosts.length).toBe(initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});