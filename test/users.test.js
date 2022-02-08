const mongoose = require('mongoose')
const server = require('../index')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getAllFromUsers } = require('./helpers')

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('asd', 10)
    const userTest = new User({
      username: 'Ninito',
      name: 'Gordo Gris',
      passwordHash
    })

    await userTest.save()
  })

  test('works as expected creating a fresh username', async () => {
    const { response: fistResponse } = await getAllFromUsers()
    const usertAtStart = fistResponse.body

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

    const { response: lastResponse } = await getAllFromUsers()
    const userstAtEnd = lastResponse.body

    expect(userstAtEnd).toHaveLength(usertAtStart.length + 1)

    const { usernames } = await getAllFromUsers()
    const { names } = await getAllFromUsers()

    expect(usernames).toContain('CatitoX')
    expect(names).toContain('Cato')
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
