var http = require('http');

var app = require('./server/server');
var chatServer = require('./server/chatServer');

var PORT = process.env.PORT || 3000;

// Start express server
var server = http.createServer(app);
server.listen(PORT, function () {
  console.log('Express server listening on port ' + PORT);
});

// Start chat server
chatServer.listen(server);
