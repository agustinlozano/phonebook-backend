const { model, Schema } = require('mongoose')

const contactSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    required: true
  },
  phone: {
    type: String,
    minlength: 8,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
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
const Contact = model('Contact', contactSchema)

module.exports = Contact
