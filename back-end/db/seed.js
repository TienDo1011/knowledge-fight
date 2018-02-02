require('./connect');
const uuidv4 = require('uuid/v4');
const Room = require('./roomModel');

const answer1 = uuidv4();
const answer2 = uuidv4();

const room1 = new Room({
  answers: [answer1, answer2],
  started: false,
  finished: false,
  questions: [
    {
      question: 'Who is the best?',
      no: 0,
      answerOptions: [
        {
          optionId: uuidv4(),
          optionName: 'A',
          optionValue: 'Me'
        },
        {
          optionId: uuidv4(),
          optionName: 'B',
          optionValue: 'You'
        },
        {
          optionId: answer1,
          optionName: 'C',
          optionValue: 'Hai ba trung'
        },
        {
          optionId: uuidv4(),
          optionName: 'D',
          optionValue: 'Someone else'
        }
      ]
    },
    {
      question : "The value of Pi (π) is approximately to?",
      no: 1,
      answerOptions : [ 
          {
            optionId: uuidv4(),
              optionName : "A",
              optionValue : "3.13"
          }, 
          {
            optionId: answer2,
              optionName : "B",
              optionValue : "3.14"
          }, 
          {
            optionId: uuidv4(),
              optionName : "C",
              optionValue : "3.15"
          }, 
          {
            optionId: uuidv4(),
              optionName : "D",
              optionValue : "3.17"
          }
      ]
  }
  ]
});

room1.save().then(() => console.log('done!'));