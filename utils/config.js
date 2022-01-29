require('dotenv').config()

const LOCAL = 3001
const PORT = process.env.PORT
const MONGO_DB_URI = process.env.MONGO_DB_URI
const MONGO_DB_URI_TEST = process.env.MONGO_DB_URI_TEST

module.exports = {
  PORT,
  MONGO_DB_URI,
  MONGO_DB_URI_TEST,
  LOCAL
}
