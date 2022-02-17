const supertest = require('supertest')
const app = require('../app')
const Contact = require('../models/Contact')

/**
 * La prueba importa la aplicación Express del módulo
 * app.js y la envuelve con la función supertest en un
 * objeto llamado superagent. Este objeto se asigna a la
 * variable api y las pruebas pueden usarlo para realizar
 * solicitudes HTTP al backend
 */
const api = supertest(app)

const nonExistingId = async () => {
  const contact = new Contact({
    name: 'A contact',
    phone: '2477 - 23234232'
  })
  await contact.save()
  await contact.remove()

  return contact.id.toString()
}

module.exports = {
  api,
  nonExistingId
}
