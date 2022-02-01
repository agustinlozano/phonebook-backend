const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialContacts = [
  {
    name: 'Agustin Lozano',
    phone: '2477 - 635371'
  },
  {
    name: 'Celeste Tessone',
    phone: '2477 - 397271'
  },
  {
    name: 'Vicente Lozano',
    phone: '2477 - 639430'
  }
]

const getAllFromContacts = async () => {
  const response = await api.get('/api/persons')
  const names = response.body.map(contact => contact.name)

  return { response, names }
}

module.exports = {
  api,
  initialContacts,
  getAllFromContacts
}
