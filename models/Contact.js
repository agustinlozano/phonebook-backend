const { model, Schema } = require('mongoose')

const contactSchema = new Schema({
  name: String,
  number: String
})

/**
 *  Aca seteamos la forma del objeto justo antes de ser devuelto
 *  Es decir, en esta linea de express:
 *  ->           res.json(contacts)
 */
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

/* creamos nuestro modelo llamado Contact segun el esquema que creamos */
const Contact = model('contact', contactSchema)

module.exports = Contact
