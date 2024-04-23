const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user in db', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'kostas',
      name: 'konstantinos papathanasiou',
      password: 'smaro',
    }

    await api 
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert.ok(usernames.includes(newUser.username))

  })

  test('creation fails with proper statuscode and message if username already taken', async () => {

    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'kostas',
      name: 'Superuser',
      password: 'smaro',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })
})