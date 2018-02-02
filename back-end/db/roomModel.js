const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  users: {
    type: [{
      _id: false,
      name: String,
      email: String,
      ready: Boolean,
      finished: Boolean,
      answers: Array,
      score: Number
    }],
    validate: [arrayLimit, '{users} exceeds the limit of 2']
  },
  started: Boolean,
  finished: Boolean,
  questions: [
    {
      _id: false,
      no: Number,
      question: String,
      answerOptions: [{
        _id: false,
        optionId: String,
        optionName: String,
        optionValue: String
      }]
    }
  ],
  answers: [String]
})

function arrayLimit(val) {
  return val.length <=2;
}

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;