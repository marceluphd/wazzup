const socketio = require('socket.io');

const {
  generateMessage,
  generateLocationMessage,
  isRealString,
} = require('./utils');
const User = require('./user');

const users = new User();

// Join a new user
// Chatting starts
function handleJoinAndStartChatting(io, socket) {
  socket.on('join', (userObj, cb) => {
    if (!isRealString(userObj.username) || !isRealString(userObj.room)) {
      return cb('Name and room name are required.');
    }

    if (users.isUsernameTaken(userObj.username)) {
      return cb('This username is taken.');
    }

    if (userObj.username.length > 13) {
      return cb('The username must be shorter than 14 characters.');
    }

    if (userObj.room.length > 13) {
      return cb('The room name must be shorter than 14 characters.');
    }

    userObj.username = userObj.username.toLowerCase();
    userObj.room = userObj.room.toLowerCase();

    // If inputs are fine, let the user join
    socket.join(userObj.room);

    // -------- Add User --------
    users.removeUser(socket.id);
    users.addUser(socket.id, userObj.username, userObj.room);
    io.to(userObj.room).emit('updatedUsersList', users.getUsers(userObj.room));

    const roomsArr = users.getRooms();
    const rooms = roomsArr.filter((el, i) => roomsArr.indexOf(el) === i);
    io.emit('updatedRoomsList', rooms);

    // -------- Send 'welcome to chat' message --------
    socket.emit('newMessage',
      generateMessage('Admin', `Hi ${userObj.username}. You joined room: ${userObj.room}`));

    // -------- Send notification to others anout new user --------
    socket.broadcast.to(userObj.room).emit('newMessage',
      generateMessage('Admin', `${userObj.username} joined`));

    // Callback
    return cb(userObj);
  });
}

// Create New Message
function createMessage(io, socket) {
  socket.on('createMessage', (newMessage, cb) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(newMessage.body)) {
      // Send to all except me
      io.to(user.room).emit('newMessage',
        generateMessage(user.username, newMessage.body));
    }
    cb();
  });
}

// Create New Location Message
function createLocationMessage(io, socket) {
  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage',
        generateLocationMessage(user.username, coords.latitude, coords.longitude)
      );
    }
  });
}

// When a client is disconnected
function handleDisconnection(io, socket) {
  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updatedUsersList', users.getUsers(user.room));
      io.to(user.room).emit('newMessage',
        generateMessage('Admin', `${user.username} left`)
      );
    }
  });
}

exports.listen = (server) => {
  const io = socketio.listen(server);

  io.on('connection', (socket) => {
    handleJoinAndStartChatting(io, socket);
    createMessage(io, socket);
    createLocationMessage(io, socket);
    handleDisconnection(io, socket);
  });
};
