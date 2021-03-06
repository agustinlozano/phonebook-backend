const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const contactsRouter = require('./controllers/contacts')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

/* conexion a mongoDB */
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })
process.on('uncaughtException', () => mongoose.connection.close())

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/persons', contactsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

/* Middleware para capturar los endpoints que no son manejados por la app */
app.use(middleware.notFound)
/* Middleware para capturar el resto de errores */
app.use(middleware.handleErrors)

module.exports = app
