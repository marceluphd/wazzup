// var express = require('express')
// var app = express();
var http = require('http');
// var path = require('path');

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function(req, res) {
//   res.render(__dirname + '/views/index.pug');
// });

var app = require('./server/server');

// Start express server
var server = http.createServer(app);
server.listen(3000, function(){
  console.log('Express server listening on port ' + 3000);
});

// Start chat server
var chatServer =  require('./server/chatServer');
chatServer.listen(server);