const mongoose = require('mongoose')
const server = require('../index')
const Contact = require('../models/Contact')
const ContactModel = require('../models/Contact')
const { api, nonExistingId } = require('./helper')
const { initialContacts, getContactResponse } = require('./contact_helper')
const { getUserResponse } = require('./users_helper')
const getAnUserToken = require('./login_helper')

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
    const token = await getAnUserToken()
    const { ids } = await getUserResponse()
    const newContact = {
      name: 'Carlos Lozano',
      phone: '2477 - 677392',
      user: ids[0]
    }

    await api
      .post('/api/persons')
      .set('Authorization', 'Bearer ' + token)
      .send(newContact)
      .expect(200)
      .expect('Content-Type', /json/)

    const { names } = await getContactResponse()

    expect(names).toContain('Carlos Lozano')
    expect(names).toHaveLength(initialContacts.length + 1)
  })

  test('a invalid contact cannot be added', async () => {
    const token = await getAnUserToken()
    const { ids } = await getUserResponse()
    const newBadConctact = {
      name: 'bad user',
      phone: undefined,
      user: ids[0]
    }

    await api
      .post('/api/persons')
      .set('Authorization', 'Bearer ' + token)
      .send(newBadConctact)
      .expect(400)

    const { response: contacts } = await getContactResponse()

    expect(contacts).toHaveLength(initialContacts.length)
  })

  test('fails with status code 401 when userId is missing', async () => {
    const token = undefined
    const invalidContact = {
      name: 'User without id',
      phone: '2477 - 2434323'
    }

    await api
      .post('/api/persons')
      .set('Authorization', 'Bearer ' + token)
      .send(invalidContact)
      .expect(401)
      .expect({ error: 'jwt malformed' })
  })
})

describe('GET /api/persons/id', () => {
  test('a single contact can be viewed', async () => {
    const token = await getAnUserToken()
    const { response: contacts } = await getContactResponse()
    const existingContact = contacts[0]

    await api
      .get(`/api/persons/${existingContact.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('a nonexisting id return 404 status code', async () => {
    const token = await getAnUserToken()
    const validNonexistingId = await nonExistingId()

    await api
      .get(`/api/persons/${validNonexistingId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  })

  test('an invalid id return 400 status code', async () => {
    await api
      .get('/api/persons/1234')
      .expect(400)
  })
})

describe('DELETE /api/persons/id', () => {
  test('a existing contact can be deleted', async () => {
    const token = await getAnUserToken()
    const { response: contactsAtStart } = await getContactResponse()
    const existingContact = contactsAtStart[0]

    await api
      .delete(`/api/persons/${existingContact.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const { names, response: contactsAtEnd } = await getContactResponse()

    expect(contactsAtEnd).toHaveLength(initialContacts.length - 1)
    expect(names).not.toContain(existingContact.name)
  })

  test('fails with status code 400 with a invalid ID', async () => {
    const token = await getAnUserToken()

    await api
      .delete('/api/persons/1234')
      .set('Authorization', 'Bearer ' + token)
      .expect(400)

    const { response: contacts } = await getContactResponse()

    expect(contacts).toHaveLength(initialContacts.length)
  })

  test('fails with status code 404 with a nonexisting ID', async () => {
    const token = await getAnUserToken()
    const validNonexistingId = await nonExistingId()

    await api
      .delete(`/api/persons/${validNonexistingId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)

    const { response: contacts } = await getContactResponse()

    expect(contacts).toHaveLength(initialContacts.length)
  })
})

describe('PUT /api/contact/id', () => {
  test('a contact body can ben updated', async () => {
    const token = await getAnUserToken()
    const { response: contacts } = await getContactResponse()
    const contact = contacts[0]

    const updatedContact = {
      name: 'updated name',
      phone: '2477 - 12312312'
    }

    await api
      .put(`/api/persons/${contact.id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(updatedContact)
      .expect(204)

    const { names } = await getContactResponse()

    expect(names).toContain('updated name')
  })

  test('fails with status code 404 when a nonexisting id is passed', async () => {
    const token = await getAnUserToken()
    const id = await nonExistingId()

    await api
      .put(`/api/persons/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  })

  test('fails with status code 400 when an ivalid id is passed', async () => {
    const token = await getAnUserToken()

    await api
      .put('/api/persons/12345')
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
  })
})

describe('test the initial contacts list', () => {
  test('there are three contacts', async () => {
    const { response: contacts } = await getContactResponse()
    expect(contacts).toHaveLength(initialContacts.length)
  })

  test('a contact have my name', async () => {
    const { names } = await getContactResponse()
    expect(names).toContain('Agustin Lozano')
  })
})

describe('when an unknown endpoint is passed as a route', () => {
  test('returns a status code 404', async () => {
    const unknownEndpoint = '/an/Invalid/RouteLikeThis'

    await api
      .get(unknownEndpoint)
      .expect(404)
      .expect({ error: 'unknown endpoint' })
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
