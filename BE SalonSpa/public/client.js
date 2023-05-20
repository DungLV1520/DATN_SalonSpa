const username = document.getElementById('username').innerHTML.substr(6);
const room = document.getElementById('room').innerHTML.substr(6);

var socket = io.connect('localhost:3000');
socket.on('connect', function (data) {
  socket.emit('join', room);
});

//listen thread event
socket.on('thread', function (data) {
  $('#thread').append(`<li>${data}</li>`);
});

$('form').submit(function () {
  var message = $('#message').val();
  socket.emit('messages', `${username}: ${message}`);
  this.reset();

  return false;
});
