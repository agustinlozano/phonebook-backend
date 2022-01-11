const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())

/*  Configure morgan para que también muestre los
 *  datos enviados en las solicitudes HTTP POST:
 *    - No funciona
 */
app.use(express.json())
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :param[name] :param[number]'))

// morgan.token('param', (req, res, param) =>
//   res.params[param]
// )

/* Estos datos serian los que le llegan al servidor
 * cuando comienza la ejecucion de la aplicacion
 */
let personsList = [
  {
    name: 'Arto Hellas',
    phone: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    phone: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    phone: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    phone: '39-23-6423122',
    id: 4
  },
  {
    name: 'Agustin Lozano',
    phone: '2477-635371',
    id: 5
  },
  {
    name: 'Celeste Tessone',
    phone: '2477-397271',
    id: 6
  },
  {
    name: 'Cato y Bebe',
    phone: '2477-444740',
    id: 7
  },
  {
    name: 'Abuelo Martin',
    phone: '2477-427026',
    id: 8
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(personsList)
})

/*  Un GET -> /info devuelve un fragmento HTML  */
app.get('/info', (req, res) => {
  const totalContacts = personsList.length
  const date = new Date()
  res.send(`
    <h4>Phonebook has info for ${totalContacts} contacts</h4>
    <p>${date}</p>
  `)
})

/*  Aqui aparece el metodo params que en este caso
 *  lo utilizamos para obtener el id de la request.
 *
 *  Es importante saber que este metodo es conocido
 *  como un Middleware, es decir una funcion que es
 *  llamada entre el procesamiento de la request y
 *  el envio de la respuesta.
 */
/* GET -> person */
app.get('/api/persons/:id', (req, res) => {
  const currentID = Number(req.params.id)
  const contact = personsList.find(person =>
    person.id === currentID
  )

  console.log('contactID: ', contact)

  if (contact) {
    // res.send(`<p>Contact <strong>${contact.name}</strong></p>`)
    res.json(contact)
  } else {
    res.status(404).send('Not faund')
  }
})

/*  Luego de obtener el id filtramos con el metodo
 *  filter el array de contactos devolviendo todos
 *  miembros excepto aquel que contiene dicho id.
 *
 *  Finalmente actualizamos el valor de la lista de
 *  contactos.
 */
/* DELETE -> person */
app.delete('/api/persons/:id', (req, res) => {
  const currentID = Number(req.params.id)
  const newContacs = personsList.filter(person =>
    person.id !== currentID
  )

  personsList = newContacs
  res.status(204).end()
})

/*  Para alterar los datos en el servidor en nuestro
 *  caso tenemos que asegurarnos de generar un id
 *  para el nuevo recurso.
 *
 *  Luego, con el metodo body podemos acceder al cuerpo
 *  de la request y asi setear el nuevo contacto en un
 *  nuevo objeto. Finalente modificamos nuestra lista
 *  de contactos concatenando con el metodo concat.
 */
/* POST -> persons */
app.post('/api/persons', (req, res) => {
  const id = Math.round(Math.random() * 1000)
  const body = req.body

  console.log('body: ', body)
  /* body = { id, name, phone } */

  const sameName = personsList.find(person =>
    person.name === body.name
  )

  /* validaciones */
  if (sameName) {
    res.status(400).json({
      error: 'name must be unique'
    })
  } else if (!body.name || !body.phone) {
    res.status(400).json({
      error: 'name or number missing'
    })
  } else {
    const newContac = {
      id: id,
      name: body.name,
      phone: body.phone
    }

    /* Modificar -actualiza- la iformacion en el servidor */
    const newList = personsList.concat(newContac)

    personsList = newList
    res.json(personsList)
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

/* Middleware para capturar los endpoints que no son manejados por la app */
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
