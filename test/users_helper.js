const User = require('../models/User')

const getUserResponse = async () => {
  const response = await User.find({})
  const names = response.map(user => user.name)
  const usernames = response.map(user => user.username)

  return { response, usernames, names }
}

const initialUsers = [
  {
    username: 'CatitoX',
    name: 'Cato',
    passwordHash: 'BebeIsMyFriend'
  },
  {
    username: 'Ninito',
    name: 'Gordo Gris',
    passwordHash: 'DadIsTheBest'
  }
]

module.exports = {
  initialUsers,
  getUserResponse
}
