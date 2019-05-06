const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  playersEaten: {
    type: Number,
    required: true
  },
  timeLived: {
    type: Number,
    required: true
  }
});
const userData = mongoose.model('gameData', UserSchema);
module.exports = userData;