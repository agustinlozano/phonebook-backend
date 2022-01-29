// const logger = require('./logger')

const requestLogger = (request, response, next) => {
  console.log('---------------')
  console.log(request.method)
  console.log(request.path)
  console.log(request.body)
  console.log('---------------')
  next()
}

const notFound = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const handleErrors = (error, req, res, next) => {
  // console.log(error.name)
  // console.log(error.message)
  if (error.name === 'CastError') {
    console.log(error.message)
    res.status(400).send({ error: 'id used is malformed' })
  } else if (error.name === 'ValidationError') {
    console.log(error.message)
    res.status(400).send({ error: error.message })
  } else {
    res.status(500).end()
  }
}

module.exports = {
  requestLogger,
  handleErrors,
  notFound
}
