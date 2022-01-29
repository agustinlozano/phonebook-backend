const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const server = require('../index')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /json/)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
