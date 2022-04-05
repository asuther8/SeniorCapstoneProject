const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  readings: {
    type: Number,
    required: true
  },
  average: {
    type: Number
  },
  Min: {
    type: Number
  },
  q25: {
    type: Number
  },
  median: {
    type: Number
  },
  q75: {
    type: Number
  },
  max: {
    type: Number
  },
  std: {
    type: Number
  },
  updated_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);