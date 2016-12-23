// @flow
var token = window.localStorage.getItem('token');
if (token) {
  console.log('TOKEN!');
} else {
  console.log('No Token');
  // if (window.location.pathname !== '/') {
  //   window.location.pathname = '/';
  // }
}

var socket = io();

// Set username
if (document.getElementById('username-form')) {
document.getElementById('username-form')
  .addEventListener('submit', function(e) {
    e.preventDefault();

    socket.emit('set username', document.getElementById('username').value);
    document.getElementById('username').value = '';

    // Show chat form
    // document.getElementById('main-container').className = 'show main-box';
    return false;
  });
}


// Receive a new usersname
if (document.getElementById('usernames')) {
  socket.on('username', function(msg){
    var node = document.createElement('p');
    var text = document.createTextNode(msg);
    node.appendChild(text);
    document.getElementById('usernames').appendChild(node);
    // document.getElementById('usernames').innerHTML = msg;
  });
}


// Send message
if (document.getElementById('chat-form')) {
  document.getElementById('chat-form')
    .addEventListener('submit', function(e) {
      e.preventDefault();

      socket.emit('chat message', 
        document.getElementById('message').value,
        document.getElementById('your-room').innerHTML);

      document.getElementById('message').value = '';
      return false;
    });
}

// Receive message
if (document.getElementById('messages')) {
  socket.on('chat message', function(msg){
    var node = document.createElement('li');
    var text = document.createTextNode(msg);
    node.appendChild(text);
    document.getElementById('messages').appendChild(node);
  });
}


// Todo: Send chat room creation
if (document.getElementById('chat-room-form')) {
  document.getElementById('chat-room-form')
    .addEventListener('submit', function(e) {
      e.preventDefault();

      socket.emit('room name', document.getElementById('room-name').value);
      document.getElementById('room-name').value = '';
      return false;
    });
}


// Todo: Join a room
if (document.getElementById('room-list')) {
  document.getElementById('room-list')
    .addEventListener('change', function(e) {
      e.preventDefault();

      document.getElementById('your-room').innerHTML = e.target.value;
      socket.emit('join room', e.target.value);
      document.getElementById('messages').innerHTML = '';
      return false;
    });

  // Todo: Receive chat room creation
  socket.on('room creation', function(room){
    var node = document.createElement('option');
    node.setAttribute('value', room);
    var text = document.createTextNode(room);
    node.appendChild(text);
    document.getElementById('room-list').appendChild(node);
  });
}


// Todo: Leave chat
if (document.getElementById('leave-btn')) {
  document.getElementById('leave-btn')
    .addEventListener('click', function(e) {
      e.preventDefault();

      socket.emit('leave chat');
      return false;
    });
}


// Todo: Send Private message

// Todo: Receive Private message