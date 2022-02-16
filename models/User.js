const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  username: {
    type: String,
    minlength: 1,
    required: true,
    unique: true
  },
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  passwordHash: String,
  contacts: [{
    type: Schema.Types.ObjectId,
    ref: 'Contact'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

module.exports = User
