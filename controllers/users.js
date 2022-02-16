const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('contacts', {
    name: 1,
    phone: 1,
    _id: 0
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  try {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json(error)
  }
})

module.exports = usersRouter
