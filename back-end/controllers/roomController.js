const Room = require('../db/roomModel');

exports.enterRoom = function(req, res) {
 const data = req.body;
 Room.findOne({
   _id: data.roomId
 }, (err, room) => {
   if (err) return res.status(500).json({message: 'Server error'})
   if (!room) {
     return res.status(400).json({message: 'Room not found'})
   } else {
    const users = room.users;
    if (users.findIndex(user => user.email === data.email) === -1) {
      const roomId = data.roomId;
     data.roomId = null;
      users.push({
        ...data, 
        ready: false,
        finished: false,
        answers: []
      });
      Room.update({
        _id: roomId
      }, {
        users
      }, err => {
        if (err) return res.status(500).json({ message: 'Enter room failed'})
        res.io.emit(`${roomId}:updated`, {
          started: room.started,
          finished: room.finished,
          users
        });
        return res.json(users);
      })
    } else {
      return res.status(409).json({message: 'You\'re already in there'})
    }
   }
 })
}

exports.leaveRoom = function(req, res) {
  const data = req.body;
  Room.findOne({
    _id: data.roomId
  }, (err, room) => {
    if (err) return res.status(500).json({message: 'Server error'})
    if (!room) {
      return res.status(400).json({message: 'Room not found'})
    } else {
     const users = room.users;
     const removedUsers = users.filter(user => user.email !== data.email);
     const roomId = data.roomId;
     Room.update({
      _id: roomId
    }, {
      users: removedUsers,
      started: false,
      finished: false,
    }, err => {
      if (err) return res.status(500).json({ message: 'Leave room failed'})
      res.io.emit(`${roomId}:updated`, {
        started: false,
        finished: false,
        users: removedUsers
      });
      return res.json(removedUsers);
    })
    }
  })
 }

 exports.start = function(req, res) {
  const data = req.body;
  Room.findOne({
    _id: data.roomId
  }, (err, room) => {
    if (err) return res.status(500).json({message: 'Server error'})
    if (!room) {
      return res.status(400).json({message: 'Room not found'})
    } else {
      const users = room.users;
      const roomId = data.roomId;
      let started = false;
      const updatedUsers = users.map(user => {
        if (user.email === data.email) {
          user.ready = true;
          return user;
        }
        return user;
      })
      if (updatedUsers.every(user => user.ready === true)) {
        started = true;
      }
      Room.update({
        _id: roomId
      }, {
        users: updatedUsers,
        started
      }, err => {
        if (err) return res.status(500).json({ message: 'Enter room failed'})
        res.io.emit(`${roomId}:updated`, {
          started,
          finished: room.finished,
          users: updatedUsers
        });
        return res.json(updatedUsers);
      })
    }
  })
 }

 exports.finish = function(req, res) {
  const data = req.body;
  Room.findOne({
    _id: data.roomId
  }, (err, room) => {
    if (err) return res.status(500).json({message: 'Server error'})
    if (!room) {
      return res.status(400).json({message: 'Room not found'})
    } else {
      const users = room.users;
      const roomId = data.roomId;
      const correctAnswers = room.answers;
      let finished = false;
      let usersWithScore;
      const updatedUsers = users.map(user => {
        if (user.email === data.email) {
          user.finished = true;
          user.answers = data.answers;
          return user;
        }
        return user;
      })

      if (updatedUsers.every(user => user.finished === true)) {
        finished = true;
        usersWithScore = updatedUsers.map(user => {
          let score = 0;
          const answers = user.answers;
          for (let i = 0; i < answers.length; i++) {
            if (answers[i] === correctAnswers[i]) {
              score++;
            }
          }
          user.score = score;
          return user;
        })
      }
      Room.update({
        _id: roomId
      }, {
        users: usersWithScore ? usersWithScore : updatedUsers,
        finished
      }, err => {
        if (usersWithScore) {
          const info = usersWithScore.map(user => ({
            email: user.email,
            score: user.score
          }));
        }
        res.io.emit(`${roomId}:updated`, {
          started: room.started,
          finished,
          users: usersWithScore ? usersWithScore : updatedUsers,
        });
        if (err) return res.status(500).json({ message: 'Something wrong, try to finish again'})
        return res.json({users: usersWithScore ? usersWithScore : updatedUsers});
      })
    }
  })
 }