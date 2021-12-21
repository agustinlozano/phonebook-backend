const express = require('express');
const res = require('express/lib/response');
const app = express();

let personsList = [
  {
    id: 1,
    name: 'Arto hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-534323'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234563'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-642344'
  }
]

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(personsList);
})

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
app.get('/api/persons/:id', (req, res) => {
  const currentID = Number(req.params.id)
  const contact = personsList.find(person =>
    person.id === currentID
  )
  
  if (contact) {
    // res.send(`<p>Contact <strong>${contact.name}</strong></p>`)
    res.json(contact) 
  } else {
    res.status(404).send('Not faund')
  }
})

/*  Luego de obtener el id fultramos con el metodo
 *  filter el array de contactos devolviendo todos
 *  miembros excepto aquel que contiene dicho id.
 *  
 *  Finalmente actualizamos el valor de la lista de
 *  contactos.
 */
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
app.post('/api/persons', (req, res) => {
  const id = Math.round(Math.random()*1000)
  const body = req.body
  const newContac = {
    id: id,
    name: body.name || `unnamed ${id}`,
    phone: body.number
  }
  const newList = personsList.concat(newContac)

  personsList = newList
  res.json(personsList)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})