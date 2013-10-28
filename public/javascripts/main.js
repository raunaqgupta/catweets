var socket = io.connect(window.location.hostname);
socket.on('tweet', function (data) {
  $("#text").text(data.text);
  $("#handle").text(data.user.screen_name);
});