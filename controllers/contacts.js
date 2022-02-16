const contactsRouter = require('express').Router()
const Contact = require('../models/Contact')
const User = require('../models/User')

contactsRouter.get('/', async (req, res) => {
  const contacts = await Contact.find({}).populate('user', {
    username: 1,
    name: 1
  })
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
  const {
    name,
    phone,
    user: userId
  } = req.body

  const user = await User.findById(userId)

  const newContac = new Contact({
    name,
    phone,
    user: user._id
  })

  /* Modificar -agrega un nuevo contact- la informacion de contactos en la db */
  const savedContact = await newContac.save()

  user.contacts = user.contacts.concat(savedContact._id)

  const newUserInfo = {
    username: user.username,
    name: user.name,
    contacts: user.contacts
  }

  /* actualizar la informacion del user en la db */
  await User.findByIdAndUpdate(userId, newUserInfo, { new: true })

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

  const updatedContact = await Contact.findByIdAndUpdate(currentID, newContactInfo, { new: true })
  if (updatedContact) {
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

module.exports = contactsRouter
