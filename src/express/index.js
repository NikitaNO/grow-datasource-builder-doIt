'use strict';
const express      = require('express');
const app          = express();
const path         = require('path');
const http         = require('http');
const fs           = require('fs');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const session      = require('express-session');
app.set('env', process.env.NODE_ENV || 'development');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', process.env.VIEWS_ENGINE || 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'AzynxWMTqa y8uPb1XlWc HTuGahSImX',
  resave: false,
  saveUninitialized: true
}));
app.use(require(path.join(__dirname, 'middleware', 'res-locals')));
app.use(require(path.join(__dirname, 'middleware', 'webpack-dev-middleware')));
require('./utils/passport').init();
app.use(require(path.join(__dirname, 'routes')));
app.use((req, res, next) => {
  let err = new Error(`${req.method} ${req.url} Not Found`);
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status);
  } else {
    res.status(500);
  }
  res.format({
    html() {
      res.render('error', {
        message: err.message,
        error: err
      });
    },
    json() {
      res.json({
        error: {
          message: err.message
        }
      });
    }
  });
});
let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
function normalizePort(val) {
  let p = parseInt(val, 10);
  if (isNaN(p)) {
    return val;
  }
  if (p >= 0) {
    return p;
  }
  return false;
}
const server = http.createServer(app);
module.exports.start = () => {
  return new Promise((resolve, reject) => {
    server.listen(port);
    server.on('listening', () => {
      const addr = server.address();
      const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
      console.log(`Express Server Port : ${bind} | Environment : ${app.get('env')}`);
      resolve();
    });
  });
};
module.exports.stop = () => server.close();
