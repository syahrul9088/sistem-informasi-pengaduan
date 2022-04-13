const mongoose = require('mongoose')
var randomize = require('randomatic');

const setDate = new Date((new Date).toLocaleString("en-US", {
  timeZone: "Asia/Jakarta"
}));

const StorySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  reports: {
    type: String,
    required: true,
    trim: true,
  },
  reportStatus: {
    type: String,
    default: 'Belum diproses'
  },
  idReport: {
    type: String
  },
  additional: {
    type: String
  },
  createdAt: {
    type: String,
    default: `${setDate.toDateString()} ${setDate.getHours()}:${setDate.getMinutes()}`,
  },
})

module.exports = mongoose.model('stories', StorySchema)
