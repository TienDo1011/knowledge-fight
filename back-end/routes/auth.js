var express = require('express');
var router = express.Router();
const userHandler = require('../controllers/userController');

/* GET users listing. */
router.post('/register', userHandler.register);
router.post('/sign-in', userHandler.signIn);

module.exports = router;
