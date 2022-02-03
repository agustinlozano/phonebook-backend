const contactsRouter = require('express').Router()
const Contact = require('../models/Contact')

contactsRouter.get('/', async (req, res) => {
  const contacts = await Contact.find({})
  res.json(contacts)
})

contactsRouter.get('/:id', async (req, res, next) => {
  const currentID = req.params.id

  try {
    const contact = await Contact.findById(currentID)
    if (contact) {
      return res.json(contact)
    } else {
      res.status(404).end()
    }
  } catch (exception) { next(exception) }
})

contactsRouter.delete('/:id', async (req, res, next) => {
  const currentID = req.params.id

  try {
    await Contact.findByIdAndRemove(currentID)
    res.status(204).end()
  } catch (exception) { next(exception) }
})

contactsRouter.post('/', async (req, res, next) => {
  const body = req.body
  const newContac = new Contact({
    name: body.name,
    phone: body.phone
  })

  /* Modificar -agrega un nuevo contact- la iformacion en la db */
  try {
    const savedContact = await newContac.save()
    res.json(savedContact)
  } catch (exception) { next(exception) }
})

/* Para actualizar la informacion de un contacto */
contactsRouter.put('/:id', async (req, res, next) => {
  const currentID = req.params.id
  const currentContact = req.body

  const newContactInfo = {
    name: currentContact.name,
    phone: currentContact.phone
  }

  try {
    const result = await Contact.findByIdAndUpdate(currentID, newContactInfo, { new: true })
    res.json(result)
  } catch (exception) { next(exception) }
})

module.exports = contactsRouter
