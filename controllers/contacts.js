const contactsRouter = require('express').Router()
const Contact = require('../models/Contact')

contactsRouter.get('/', (req, res) => {
  Contact.find({})
    .then(contacts => res.json(contacts))
})

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

contactsRouter.delete('/:id', (req, res, next) => {
  const currentID = req.params.id

  Contact.findByIdAndRemove(currentID)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

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
