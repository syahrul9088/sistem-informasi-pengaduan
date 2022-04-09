const mongoose = require('mongoose')
var randomize = require('randomatic');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  email: {
    type: String
  },
  googleId: {
    type: String,
  },
  password: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('users', UserSchema)
