const mongoose = require('mongoose')

const server = require('../index')
const ContactModel = require('../models/Contact')
const {
  api,
  initialContacts,
  getAllNamesFromContacts
} = require('./helpers')

beforeEach(async () => {
  await ContactModel.deleteMany({})

  const contact1 = new ContactModel(initialContacts[0])
  await contact1.save()

  const contact2 = new ContactModel(initialContacts[1])
  await contact2.save()

  const contact3 = new ContactModel(initialContacts[2])
  await contact3.save()
})

test('contacts are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /json/)
})

test('there are three contacts', async () => {
  const { response } = await getAllNamesFromContacts()
  expect(response.body).toHaveLength(initialContacts.length)
})

test('a contact have my name', async () => {
  const { names } = await getAllNamesFromContacts()
  expect(names).toContain('Agustin Lozano')
})

test('a valid conctact can be added', async () => {
  const newContact = {
    name: 'Carlos Lozano',
    phone: '2477 - 677392'
  }

  await api
    .post('/api/persons')
    .send(newContact)
    .expect(200)
    .expect('Content-Type', /json/)

  const { names } = await getAllNamesFromContacts()

  expect(names).toContain(newContact.name)
  expect(names).toHaveLength(initialContacts.length + 1)
})

test('a invalid contact cannot be added', async () => {
  const newBadConctact = {
    name: 'bad user',
    phone: undefined
  }

  await api
    .post('/api/persons')
    .send(newBadConctact)
    .expect(400)

  const { names } = await getAllNamesFromContacts()

  expect(names).toHaveLength(initialContacts.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
