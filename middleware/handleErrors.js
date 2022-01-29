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

module.exports = handleErrors
