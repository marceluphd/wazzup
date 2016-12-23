/* global io Mustache moment urlQueryToObject */
var socket = io();

/* ****************************************************
  Template for normal message and location message
***************************************************** */
var template = {
  messageTemplate: function() {
    return "<div class='message-title'>" +
             "<h4>{from}</h4>" +
             "<span>{date}</span>" +
           "</div>" +
           "<div class='message__body'>" +
              "<p>{body}</p>" +
           "</div>";
  },

  locationTemplate: function() {
    return "<div class='message-title'>" +
             "<h4>{from}</h4>" +
             "<span>{date}</span>" +
           "</div>" +
           "<div class='message__body'>" +
              "<p><a href='{url}' target='_blank'>My current location</a></p>" +
           "</div>";
  },

  displayMessage: function(msg, date) {
    var view = '';
    var messageView = this.messageTemplate();
    messageView = messageView.replace('{body}', msg.body);
    messageView = messageView.replace('{from}', msg.from);
    messageView = messageView.replace('{date}', date);
    return view += messageView;
  },

  displayLocationMessage: function(msg, date) {
    var view = '';
    var messageView = this.locationTemplate();
    messageView = messageView.replace('{url}', msg.url);
    messageView = messageView.replace('{from}', msg.from);
    messageView = messageView.replace('{date}', date);
    return view += messageView;
  },
};

/* ****************************************************
    Scroll to the bottom when new message comes in
***************************************************** */
function scrollToBottom() {
  // Selectors
  var messages = document.getElementById('messages');
  var newMessage = messages.lastElementChild;

  // Heights
  var clientHeight = messages.clientHeight;
  var scrollTop = messages.scrollTop;
  var scrollHeight = messages.scrollHeight;
  var newMessageHeight = newMessage.clientHeight;
  var prevMessageHeight = 0;

  if (newMessage.previousElementSibling) {
    prevMessageHeight = newMessage.previousElementSibling.clientHeight;
  }

  if (clientHeight +
      scrollTop +
      newMessageHeight +
      prevMessageHeight >= scrollHeight) {
        messages.scrollTop = scrollHeight;
  }
}

/* ****************************************************
          Socket connection is established
***************************************************** */
socket.on('connect', function () {
  // Check user name and room to join
  var newUserObj = urlQueryToObject(window.location.search);
  socket.emit('join', newUserObj, function (data) {
    // Username and Room name are returned
    if (data && data.username && data.room) {
      // Set username to room change form
      document
        .getElementById('username-hidden')
        .setAttribute('value', data.username);
      document
        .getElementById('profile-username')
        .setAttribute('value', data.username);
      document
        .getElementById('room-hidden')
        .setAttribute('value', data.room);
      document
        .getElementById('profile-room')
        .setAttribute('value', data.room);
    }

    // Error is returned
    if (typeof data === 'string') {
      window.location.href = '/';
      alert(data);
    }
  });
});

/* ****************************************************
                  Update User list
***************************************************** */
socket.on('updatedUsersList', function (users) {
  var ul = document.createElement('ul');
  document.getElementById('users').innerHTML = '';

  users.forEach(function (user) {
    var li = document.createElement('li');
    li.innerHTML = user;
    ul.appendChild(li);
  });

  document.getElementById('users').appendChild(ul);
});

/* ****************************************************
              Update Rooms list
***************************************************** */
socket.on('updatedRoomsList', function (rooms) {
  var ul = document.createElement('ul');
  document.getElementById('rooms').innerHTML = '';

  rooms.forEach(function (room) {
    var li = document.createElement('li');
    li.innerHTML = room;
    ul.appendChild(li);
  });

  document.getElementById('rooms').appendChild(ul);
});

/* ****************************************************
      Create and Send New Message + Display it
***************************************************** */
// Sending
document
  .getElementById('message-form')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
      body: document.getElementById('message-body').value,
    }, function () {
      document.getElementById('message-body').value = '';
    });
  });

// Receiving and Displaying
socket.on('newMessage', function (msg) {
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  // Set message template
  var html = template.displayMessage(msg, formattedTime);
  var li = document.createElement('li');
  li.setAttribute('class', 'message');
  li.innerHTML = html;
  document.getElementById('messages').appendChild(li);
  // Scroll to bottom if there are new messages that are hidden
  scrollToBottom();
});


/* ****************************************************
   Create and Send New Location Message + Display it
***************************************************** */
// Sending
document
  .getElementById('send-location')
  .addEventListener('click', function () {
    if (!navigator.geolocation) {
      return alert('Geolocation API is not supported in your browser');
    }
    // While sending the location, disable the button and
    // display 'Sending...' text on the button
    document.getElementById('send-location').setAttribute('disabled', 'disabled');
    document.getElementById('send-location').innerHTML = 'Sending...';

    navigator.geolocation.getCurrentPosition(function (position) {
      // Set the 'Send Location' back to normal
      document.getElementById('send-location').removeAttribute('disabled');
      document.getElementById('send-location').innerHTML = 'Send Location';

      // Send the location to server
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    }, function () {
      alert('Unabled to fetch the location');
    });
  });

// Receiving and Displaying
socket.on('newLocationMessage', function (msg) {
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  // Set message template
  var html = template.displayLocationMessage(msg, formattedTime);
  var li = document.createElement('li');
  li.setAttribute('class', 'message');
  li.innerHTML = html;
  document.getElementById('messages').appendChild(li);
  // Scroll to bottom if there are new messages that are hidden
  scrollToBottom();
});

/* ****************************************************
                Socket disconnection
***************************************************** */
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});
