require('dotenv').config()

const PORT = process.env.PORT
const MONGO_DB_URI = process.env.MONGO_DB_URI
const LOCAL = 3001

module.exports = {
  PORT,
  MONGO_DB_URI,
  LOCAL
}
