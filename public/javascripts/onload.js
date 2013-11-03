window.onload = function(){
  // initialize google map
  var gmap = App.GMap("map_background");
  gmap.setMapCenter(38.739618, -9.149655);

  // create and open socket connection
  var socket = io.connect(window.location.hostname);
  socket.on('tweet', function (data) {
    $("#text").text(data.text);
    $("#handle").text(data.user.screen_name);
  });
}