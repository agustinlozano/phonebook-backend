const express = require('express');
const res = require('express/lib/response');
const app = express();

const personsList = [
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})