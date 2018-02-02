var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const { jwtSecretKey } = require('./config'); 
require('./db/connect');

var index = require('./routes/index');
var auth = require('./routes/auth');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', '*');
//   res.setHeader('Content-Type', 'application/json');
//   res.setHeader('content-type', 'application/json');
  
//   next();
// } )

app.use((req, res, next) => {
  if(req.headers && req.headers.authorization
    && req.headers.authorization.split(' ')[0] === 'Bearer') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], jwtSecretKey, (err, decode) => {
        if (err) {
          req.user = undefined;
        } else {
          req.user = decode;
        }
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
})

app.use((req, res, next) => {
  res.io = io;
  next();
})

app.use('/', index);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {
  app,
  server
};
