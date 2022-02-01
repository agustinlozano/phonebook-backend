const mongoose = require('mongoose')
const server = require('../index')
const Contact = require('../models/Contact')
const ContactModel = require('../models/Contact')
const {
  api,
  initialContacts,
  getAllFromContacts
} = require('./helpers')

beforeEach(async () => {
  await ContactModel.deleteMany({})

  /**
   * Para cada contacto del initialContact
   * crear un nuevo conctactObject del modelo
   * y guardarlo en la base de datos
   *
   * De esta manera si agrego nuevos contactos
   * al inicialConcact, mis test no se rompen
   */
  for (const contact of initialContacts) {
    const contactObject = new Contact(contact)
    await contactObject.save()
  }
})

test('contacts are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /json/)
})

test('there are three contacts', async () => {
  const { response } = await getAllFromContacts()
  expect(response.body).toHaveLength(initialContacts.length)
})

test('a contact have my name', async () => {
  const { names } = await getAllFromContacts()
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

  const { names } = await getAllFromContacts()
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

  const { names } = await getAllFromContacts()
  expect(names).toHaveLength(initialContacts.length)
})

test('a invalid id return 404 status code', async () => {
  const invalidID = '61f85179ff08013914dd882d'

  await api
    .get(`/api/persons/${invalidID}`)
    .expect(404)
})

test('a contact can be deleted', async () => {
  const { response: firstResponse } = await getAllFromContacts()
  const contacts = firstResponse.body
  const firstContact = contacts[0]

  await api
    .delete(`/api/persons/${firstContact.id}`)
    .expect(204)

  const { names, response: secondResponse } = await getAllFromContacts()
  expect(secondResponse.body).toHaveLength(initialContacts.length - 1)

  expect(names).not.toContain(firstContact.name)
})

test('a contact that not exist cannot be deleted', async () => {
  const invalidPATH = '/api/persons/1234'

  await api
    .delete(invalidPATH)
    .expect(400)

  const { response } = await getAllFromContacts()
  expect(response.body).toHaveLength(initialContacts.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
