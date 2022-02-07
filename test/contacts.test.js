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

describe('GET /api/persons', () => {
  test('contacts are returned as json', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /json/)
  })
})

describe('POST /api/persons', () => {
  test('a valid contact can be added', async () => {
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

    expect(names).toContain('Carlos Lozano')
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

    const { response } = await getAllFromContacts()
    const contacts = response.body

    expect(contacts).toHaveLength(initialContacts.length)
  })
})

describe('GET /api/persons/:id', () => {
  test('a single contact can be viewed', async () => {
    const { response } = await getAllFromContacts()
    const contacts = response.body
    const existingContact = contacts[0]

    await api
      .get(`/api/persons/${existingContact.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('a nonexisting id return 404 status code', async () => {
    const invalidID = '61f85179ff08013914dd882d'

    await api
      .get(`/api/persons/${invalidID}`)
      .expect(404)
  })

  test('an invalid id return 400 status code', async () => {
    const invalidID = '1234'

    await api
      .get(`/api/persons/${invalidID}`)
      .expect(400)
  })
})

describe('DELETE /api/persons/:id', () => {
  test('a existing contact can be deleted', async () => {
    const { response: firstResponse } = await getAllFromContacts()
    const contacts = firstResponse.body
    const existingContact = contacts[0]

    await api
      .delete(`/api/persons/${existingContact.id}`)
      .expect(204)

    const { names, response: secondResponse } = await getAllFromContacts()

    expect(secondResponse.body).toHaveLength(initialContacts.length - 1)
    expect(names).not.toContain(existingContact.name)
  })

  test('fails with status code 400 with a invalid ID', async () => {
    const invalidPATH = '/api/persons/1234'

    await api
      .delete(invalidPATH)
      .expect(400)

    const { response } = await getAllFromContacts()

    expect(response.body).toHaveLength(initialContacts.length)
  })

  test('fails with status code 404 with a nonexisting ID', async () => {
    const validNonexistingId = '61f85179ff08013914dd882d'

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .expect(404)

    const { response } = await getAllFromContacts()

    expect(response.body).toHaveLength(initialContacts.length)
  })
})

// describe('PUT /api/persons/:id', () => {})

describe('test the initial contacts list', () => {
  test('there are three contacts', async () => {
    const { response } = await getAllFromContacts()
    expect(response.body).toHaveLength(initialContacts.length)
  })

  test('a contact have my name', async () => {
    const { names } = await getAllFromContacts()
    expect(names).toContain('Agustin Lozano')
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
