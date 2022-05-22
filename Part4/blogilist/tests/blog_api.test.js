const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

jest.setTimeout(10000)

beforeEach(async () => {
  await Blog.deleteMany({})
  helper.initialBlogs.forEach(async (blog) => {
    let blogObject = new Blog(blog)
    await blogObject.save()
  })
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('identifying field is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added ', async () => {

  const user = await helper.initialUsers[0]._id
  console.log(user)
  const newBlog = {
    title: 'FullStackOpen',
    author: 'MOOC',
    url: 'https://fullstackopen.com/en/',
    likes: 4,
    userId: user
  }
  console.log(newBlog.userId)
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const title = blogsAtEnd.map(n => n.title)
  expect(title).toContain(
    'FullStackOpen'
  )
})

test('if blog are missing likes it will show 0', async () => {
  const newBlog ={
    title: 'FullStackOpen',
    author: 'MOOC',
    url: 'https://fullstackopen.com/en/',
  }
  await api
    .post('/api/blogs')
    .send(newBlog)

  const blogsAtEnd = await helper.blogsInDb()
  const blogLikes = blogsAtEnd.pop()
  expect(blogLikes.likes).toBe(0)
})
test('if blog are missing title and url response with 400 Bad Request', async () => {
  const newBlog ={
    author: 'MOOC',
    likes: 2
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('deleting a blog', async () => {
  const newBlog = {
    title: 'FullStackOpen',
    author: 'MOOC',
    url: 'https://fullstackopen.com/en/',
    likes: 4
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()
  const blogToDelete = blogsAtEnd[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd2 = await helper.blogsInDb()

  expect(blogsAtEnd2.length).toBe(
    helper.initialBlogs.length
  )
  const urls = blogsAtEnd2.map(b => b.url)

  expect(urls).not.toContain(blogToDelete.url)
})

test('update a blog', async () => {
  const newBlog = {
    title: 'FullStackOpen',
    author: 'MOOC',
    url: 'https://fullstackopen.com/en/',
    likes: 4
  }

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  newBlog.likes += 1

  await api
    .put(`/api/blogs/${result.body.id}`)
    .send(newBlog)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd[6].likes).toBe(5)
})


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'SudoLuser',
      password: 'siikret',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username has less than 3 letters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'SudoLuser',
      password: 'siikret',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username or password missing or length less than 3')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})
afterAll(() => {
  mongoose.connection.close()
})