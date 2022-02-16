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
  test('fails with status code 400 if username is already taken', async () => {
    const { response: usersAtStart } = await getUserResponse()
    const userAlreadyTaken = initialUsers[0]

    console.log(userAlreadyTaken)

    await api
      .post('/api/users')
      .send(userAlreadyTaken)
      .expect(400)
      .expect('Content-Type', /json/)

    const { response: usersAtEnd } = await getUserResponse()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('works as expected creating a fresh username', async () => {
    const { response: usertAtStart } = await getUserResponse()

    const newUser = {
      username: 'MobBebe',
      name: 'Bebe',
      password: 'catoIsAnIdiot'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /json/)

    const { response: userstAtEnd, usernames, names } = await getUserResponse()

    expect(userstAtEnd).toHaveLength(usertAtStart.length + 1)
    expect(usernames).toContain('MobBebe')
    expect(names).toContain('Bebe')
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
