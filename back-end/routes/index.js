var express = require('express');
var router = express.Router();
const Room = require('../db/roomModel');
const roomController = require('../controllers/roomController');

/* GET home page. */
router.get('/rooms', async function(req, res, next) {
  const rooms = await Room.find();
  res.send({rooms});
});

router.post('/enter-room', roomController.enterRoom);

router.post('/leave-room', roomController.leaveRoom);

router.post('/start', roomController.start);

router.post('/finish', roomController.finish);

module.exports = router;
