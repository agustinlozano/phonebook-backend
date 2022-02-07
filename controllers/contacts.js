const contactsRouter = require('express').Router()
const Contact = require('../models/Contact')

contactsRouter.get('/', async (req, res) => {
  const contacts = await Contact.find({})
  res.json(contacts)
})

contactsRouter.get('/:id', async (req, res) => {
  const currentID = req.params.id

  const contact = await Contact.findById(currentID)
  if (contact) {
    return res.json(contact)
  } else {
    res.status(404).end()
  }
})

contactsRouter.delete('/:id', async (req, res) => {
  const currentID = req.params.id

  const deletedContact = await Contact.findByIdAndRemove(currentID)
  if (deletedContact) {
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

contactsRouter.post('/', async (req, res) => {
  const body = req.body
  const newContac = new Contact({
    name: body.name,
    phone: body.phone
  })

  /* Modificar -agrega un nuevo contact- la iformacion en la db */
  const savedContact = await newContac.save()
  res.json(savedContact)
})

/* Para actualizar la informacion de un contacto */
contactsRouter.put('/:id', async (req, res) => {
  const currentID = req.params.id
  const currentContact = req.body

  const newContactInfo = {
    name: currentContact.name,
    phone: currentContact.phone
  }

  const result = await Contact.findByIdAndUpdate(currentID, newContactInfo, { new: true })
  res.json(result)
})

module.exports = contactsRouter
