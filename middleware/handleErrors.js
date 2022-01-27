const handleErrors = (error, req, res, next) => {
  if (error.name === 'CastError') {
    console.log(error.message)
    res.status(400).send({ error: 'id used is malformed' })
  } else {
    res.status(500).end()
  }
}

module.exports = handleErrors
