require('dotenv').config()
require('./mongo')

const express = require('express')
// const morgan = require('morgan')
const logger = require('./middleware/loggerMiddleware')
const cors = require('cors')
const app = express()
const Contact = require('./models/Contact')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(logger)
app.use(express.json())
app.use(express.static('build'))

/**
 *  Configure morgan para que también muestre los
 *  datos enviados en las solicitudes HTTP POST:
 *    - No funciona
 */
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :param[name] :param[number]'))

// morgan.token('param', (req, res, param) =>
//   res.params[param]
// )

app.get('/', (req, res) => {
  res.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (req, res) => {
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
app.get('/api/persons/:id', (req, res, next) => {
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
app.delete('/api/persons/:id', (req, res, next) => {
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
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  /* validaciones */
  if (!body.name || !body.number) {
    res.status(400).json({
      error: 'name or number missing'
    })
  } else {
    const newContac = new Contact({
      name: body.name,
      number: body.number
    })

    /* Modificar -actualiza- la iformacion en la db */
    newContac.save()
      .then(savedContact => {
        res.json(savedContact)
      })
      .catch(err => next(err))
  }
})

/* Para actualizar un contacto: NO FUNCIONA */
app.put('api/notes/:id', (req, res, next) => {
  const { currentID } = req.params.id
  const currentContact = req.body

  const newContactInfo = {
    name: currentContact.name,
    number: currentContact.number
  }

  Contact.findByIdAndUpdate(currentID, newContactInfo)
    .then(result => res.json(result))
    .catch(err => next(err))
})

/* Middleware para capturar los endpoints que no son manejados por la app */
app.use(notFound)

/* Middleware para capturar el resto de errores */
app.use(handleErrors)

const PORT = process.env.LOCAL
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
