/* global io Mustache moment urlQueryToObject */
const socket = io();

/* ****************************************************
  Template for normal message and location message
***************************************************** */
const template = {
  messageTemplate: function() {
    return (
      "<div class='message-title'>" +
      '<h4>{from}</h4>' +
      '<span>{date}</span>' +
      '</div>' +
      "<div class='message__body'>" +
      '<p>{body}</p>' +
      '</div>'
    );
  },

  locationTemplate: function() {
    return (
      "<div class='message-title'>" +
      '<h4>{from}</h4>' +
      '<span>{date}</span>' +
      '</div>' +
      "<div class='message__body'>" +
      "<p><a href='{url}' target='_blank'>My current location</a></p>" +
      '</div>'
    );
  },

  displayMessage: function(msg, date) {
    let view = '';
    let messageView = this.messageTemplate();
    messageView = messageView.replace('{body}', msg.body);
    messageView = messageView.replace('{from}', msg.from);
    messageView = messageView.replace('{date}', date);
    return (view += messageView);
  },

  displayLocationMessage: function(msg, date) {
    let view = '';
    let messageView = this.locationTemplate();
    messageView = messageView.replace('{url}', msg.url);
    messageView = messageView.replace('{from}', msg.from);
    messageView = messageView.replace('{date}', date);
    return (view += messageView);
  }
};

/* ****************************************************
    Scroll to the bottom when new message comes in
***************************************************** */
function scrollToBottom() {
  // Selectors
  const messages = document.getElementById('messages');
  const newMessage = messages.lastElementChild;

  // Heights
  const clientHeight = messages.clientHeight;
  const scrollTop = messages.scrollTop;
  const scrollHeight = messages.scrollHeight;
  const newMessageHeight = newMessage.clientHeight;
  let prevMessageHeight = 0;

  if (newMessage.previousElementSibling) {
    prevMessageHeight = newMessage.previousElementSibling.clientHeight;
  }

  if (
    clientHeight + scrollTop + newMessageHeight + prevMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop = scrollHeight;
  }
}

/* ****************************************************
          Socket connection is established
***************************************************** */
socket.on('connect', () => {
  // Check user name and room to join
  const newUserObj = urlQueryToObject(window.location.search);
  socket.emit('join', newUserObj, data => {
    // Username and Room name are returned
    if (data && data.username && data.room) {
      // Set username to room change form
      document
        .getElementById('username-hidden')
        .setAttribute('value', data.username);
      document
        .getElementById('profile-username')
        .setAttribute('value', data.username);
      document.getElementById('room-hidden').setAttribute('value', data.room);
      document.getElementById('profile-room').setAttribute('value', data.room);
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
socket.on('updatedUsersList', users => {
  const ul = document.createElement('ul');
  document.getElementById('users').innerHTML = '';

  users.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = user;
    ul.appendChild(li);
  });

  document.getElementById('users').appendChild(ul);
});

/* ****************************************************
              Update Rooms list
***************************************************** */
socket.on('updatedRoomsList', rooms => {
  const ul = document.createElement('ul');
  document.getElementById('rooms').innerHTML = '';

  rooms.forEach(room => {
    const li = document.createElement('li');
    li.innerHTML = room;
    ul.appendChild(li);
  });

  document.getElementById('rooms').appendChild(ul);
});

/* ****************************************************
      Create and Send New Message + Display it
***************************************************** */
// Sending
document.getElementById('message-form').addEventListener('submit', e => {
  e.preventDefault();
  socket.emit(
    'createMessage',
    {
      body: document.getElementById('message-body').value
    },
    function() {
      document.getElementById('message-body').value = '';
    }
  );
});

// Receiving and Displaying
socket.on('newMessage', msg => {
  const formattedTime = new Date().toLocaleString();
  // Set message template
  const html = template.displayMessage(msg, formattedTime);
  const li = document.createElement('li');
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
document.getElementById('send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation API is not supported in your browser');
  }
  // While sending the location, disable the button and
  // display 'Sending...' text on the button
  document.getElementById('send-location').setAttribute('disabled', 'disabled');
  document.getElementById('send-location').innerHTML = 'Sending...';

  navigator.geolocation.getCurrentPosition(
    function(position) {
      // Set the 'Send Location' back to normal
      document.getElementById('send-location').removeAttribute('disabled');
      document.getElementById('send-location').innerHTML = 'Send Location';

      // Send the location to server
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      alert('Unabled to fetch the location');
    }
  );
});

// Receiving and Displaying
socket.on('newLocationMessage', msg => {
  const formattedTime = new Date().toLocaleString();
  // Set message template
  const html = template.displayLocationMessage(msg, formattedTime);
  const li = document.createElement('li');
  li.setAttribute('class', 'message');
  li.innerHTML = html;
  document.getElementById('messages').appendChild(li);
  // Scroll to bottom if there are new messages that are hidden
  scrollToBottom();
});

/* ****************************************************
                Socket disconnection
***************************************************** */
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
