const supertest = require('supertest')
const app = require('../app')

/**
 * La prueba importa la aplicación Express del módulo
 * app.js y la envuelve con la función supertest en un
 * objeto llamado superagent. Este objeto se asigna a la
 * variable api y las pruebas pueden usarlo para realizar
 * solicitudes HTTP al backend
 */
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

const getAllFromUsers = async () => {
  const response = await api.get('/api/users')
  const names = response.body.map(user => user.name)
  const usernames = response.body.map(user => user.username)
  return { response, usernames, names }
}

module.exports = {
  api,
  initialContacts,
  getAllFromContacts,
  getAllFromUsers
}
