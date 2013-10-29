var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, {log: false});
var TwitterStream = require('./twitter_stream');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// for heroku websocket support
io.configure(function(){
  io.set('transports', ['xhr-polling']);
  io.set("polling duration", 10);
});

// setup twitter stream
var twitter_stream = new TwitterStream();

setInterval(function(){
  twitter_stream.getTweet(io);
}, 2000);

// on new client connections
io.sockets.on('connection', function(socket){
  console.log("New client connection");
  if(undefined != twitter_stream.getLastTweet()) {
    socket.emit('tweet', twitter_stream.getLastTweet());
  }
});

// make server listen to specified port
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});