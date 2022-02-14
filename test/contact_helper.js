const Contact = require('../models/Contact')
const initialContacts = [
  {
    name: 'Agustin Lozano',
    phone: '2477 - 635371'
  },
  {
    name: 'Celeste Tessone',
    phone: '2477 - 397271'
  },
  {
    name: 'Vicente Lozano',
    phone: '2477 - 639430'
  }
]

const getContactResponse = async () => {
  const response = await Contact.find({})
  const names = response.map(contact => contact.name)

  return { response, names }
}

module.exports = {
  initialContacts,
  getContactResponse
}
