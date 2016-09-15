require('./config/setupLogging');

var env = require('./config/env');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var comb = require('comb');
var http = require('http');

var logger = comb.logger('ge.app');
logger.info(`group-eat starting up in '${env.env}' mode.`);

// Import middleware and routing files.
var mw = require('./routes/middleware');
var routes = require('./routes/index');

var app = express();

// Configure view engine.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Configure 3rd party middlewares and parsers.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  if (!req.cookies.uid) {
    require('crypto').randomBytes(48, function(err, buffer) {
      res.cookie('uid', buffer.toString('hex'), { maxAge: 900000, httpOnly: true });
      next();
    });
  }
  else next();
});

// Add routes to express configuration.
app.use('/', routes);

app.use(mw.error.handler_404);

if (env.env === 'dev')
  app.use(mw.error.handler_dev);

app.use(mw.error.handler_prod);

var port = normalizePort(process.env.PORT || env.config.appSettings.port);
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  logger.info(`Polar now listening at ${env.host} on ${bind}`)
}