const mongoose = require('mongoose')
var randomize = require('randomatic');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    trim: true,
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
