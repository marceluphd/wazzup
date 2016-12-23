// @flow
var socketio = require('socket.io');
var users = [];
var rooms = [];

exports.listen = function(server){
  io = socketio.listen(server);
  io.on('connection', function(socket){
    // Once connected show all active users and rooms
    socket.emit('username', Object.keys(users));
    rooms.forEach(function(room) {
      socket.emit('room creation', room);
    });

    loginUser(socket);
    createRoom(socket);
    joinRoom(socket);
    sendChat(socket);
    logoutUser(socket);
    handleDisconnection(socket)
  });
};

function loginUser(socket){
  socket.on('set username', function(name, callback){
    if (name in users){
      // callback(false);
    } else {
      // callback(true);
      socket.username = name;
      users[socket.username] = socket;
      io.sockets.emit('username', Object.keys(users));
    }
  });
}

function createRoom(socket) {
  socket.on('room name', function(data, callback){
    if (data in rooms){
      // callback(false);
    } else {
      // callback(true);
      rooms.push(data);
      io.sockets.emit('room creation', data);
    }
  });
}

function joinRoom(socket) {
  socket.on('join room', function(room, callback) {
    if (socket.room && socket.room === room) {
      return;
    }

    if (socket.room && socket.room !== room) {
      socket.leave(socket.room)
    }

    if (room) {
      socket.room = room;
      socket.join(room);
    }
  });
}

function sendChat(socket) {
  socket.on('chat message', function(msg, room){
    if(msg.substr(0,1) === '@') {
      var spaceIndex = msg.indexOf(' ');
      var user = msg.substring(1, spaceIndex);
      var message = msg.substring(spaceIndex + 1);
      if(user in users){
        users[user].emit('chat message', '(PRIVATE)' + socket.username + ' : ' + message);
        users[socket.username].emit('chat message', '(PRIVATE)' + socket.username + ' : ' + message);
        return;
      } else {
        return 
      }
    } else {
      io.sockets.in(socket.room).emit('chat message', socket.username + ' : ' + msg);
    }
  });
}


function sendPrivateMessage() {

}

function logoutUser(socket) {
  socket.on('leave chat', function() {
    if(!socket.username) return;
    socket.leave(socket.room);
    delete users[socket.username];
    io.sockets.emit('username', Object.keys(users));
  });
}

function handleDisconnection(socket) {
  socket.on('disconnect', function(data){
    if(!socket.username) return;
    socket.leave(socket.room);
    delete users[socket.username];
    io.sockets.emit('username', Object.keys(users));
  });
}