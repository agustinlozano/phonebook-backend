const mongoose = require('mongoose')
const server = require('../index')
const User = require('../models/User')
const { api } = require('./helpers')
const { initialUsers, getUserResponse } = require('./users_helper')

beforeEach(async () => {
  await User.deleteMany({})

  for (const user of initialUsers) {
    const userObject = new User(user)
    await userObject.save()
  }
})

describe('getting all users', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)
  })
})

describe('creating a new user', () => {
  test('works as expected creating a fresh username', async () => {
    const { response: usertAtStart } = await getUserResponse()

    const newUser = {
      username: 'CatitoX',
      name: 'Cato',
      password: 'bebeIsMyFriend'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /json/)

    const { response: userstAtEnd, usernames, names } = await getUserResponse()

    expect(userstAtEnd).toHaveLength(usertAtStart.length + 1)
    expect(usernames).toContain('CatitoX')
    expect(names).toContain('Cato')
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
