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
  //Previous game data
  prevGamepoint: {
    type: Number,
    default: 0
  },
  prevGamekills: {
    type: Number,
    default: 0
  },
  prevGametime: {
    type: Number,
    default: 0
  },
  prevGamerank: {
    type: Number,
    default: 0
  },
    //Avg game data
    avgGamepoint: {
      type: Number,
      default: 0
    },
    avgGametime: {
      type: Number,
      default: 0
    },
    avgGamerank: {
      type: Number,
      default: 0
    },
    //Best game data
    bestGamepoint: {
      type: Number,
      default: 0
    },
    bestGametime: {
      type: Number,
      default: 0
    },
    bestGamerank: {
      type: Number,
      default: 0
    },
    //game played
    played: {
      type: Number,
      default: 1
    },
});
const User = mongoose.model('User', UserSchema);
module.exports = User;