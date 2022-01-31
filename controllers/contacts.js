const contactsRouter = require('express').Router()
const Contact = require('../models/Contact')

contactsRouter.get('/', (req, res) => {
  Contact.find({})
    .then(contacts => res.json(contacts))
})

/**
*  Aqui aparece el metodo params que en este caso
*  lo utilizamos para obtener el id de la request.
*
*  Es importante saber que este metodo es conocido
*  como un Middleware, es decir una funcion que es
*  llamada entre el procesamiento de la request y
*  el envio de la respuesta.
*/
/* GET -> person */
contactsRouter.get('/api/persons/:id', (req, res, next) => {
  const currentID = req.params.id

  Contact.findById(currentID).then(contact => {
    if (contact) {
      return res.json(contact)
    } else {
      res.status(404).end()
    }
  }).catch(err => { next(err) })
})

/**
 *  Luego de obtener el id filtramos con el metodo
 *  filter el array de contactos devolviendo todos
 *  miembros excepto aquel que contiene dicho id.
 *
 *  Finalmente actualizamos el valor de la lista de
 *  contactos.
 */
/* DELETE -> person */
contactsRouter.delete('/:id', (req, res, next) => {
  const currentID = req.params.id

  Contact.findByIdAndRemove(currentID)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

/**
 *  Para alterar los datos en el servidor en nuestro
 *  caso tenemos que asegurarnos de generar un id
 *  para el nuevo recurso.
 *
 *  Luego, con el metodo body podemos acceder al cuerpo
 *  de la request y asi setear el nuevo contacto en un
 *  nuevo objeto. Finalente modificamos nuestra lista
 *  de contactos concatenando con el metodo concat.
 */
/* POST -> persons */
contactsRouter.post('/', (req, res, next) => {
  const body = req.body
  const newContac = new Contact({
    name: body.name,
    phone: body.phone
  })

  /* Modificar -agrega un nuevo contact- la iformacion en la db */
  newContac.save()
    .then(savedContact => {
      res.json(savedContact)
    })
    .catch(err => next(err))
})

/* Para actualizar la informacion de un contacto */
contactsRouter.put('/:id', (req, res, next) => {
  const currentID = req.params.id
  const currentContact = req.body

  const newContactInfo = {
    name: currentContact.name,
    phone: currentContact.phone
  }

  Contact.findByIdAndUpdate(currentID, newContactInfo, { new: true })
    .then(result => res.json(result))
    .catch(err => next(err))
})

module.exports = contactsRouter