const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  avgRank: {
    type: String,
    default: 0
  },
  highestRank: {
    type: String,
    default: 0
  },
  avgPoint: {
    type: String,
    default: 0
  },
  highestPoint: {
    type: String,
    default: 0
  },
  avgTime: {
    type: String,
    default: 0
  },
  highestTime: {
    type: String,
    default: 0
  },
  count: {
    type: String,
    default: 0
  }
});
const User = mongoose.model('User', UserSchema);
module.exports = User;