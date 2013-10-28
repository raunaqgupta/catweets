var twitter = require('ntwitter');
var twitter_keys = require('./twitter_keys');
var twit = new twitter({
  consumer_key: twitter_keys.consumer_key,
  consumer_secret: twitter_keys.consumer_secret,
  access_token_key: twitter_keys.access_token_key,
  access_token_secret: twitter_keys.access_token_secret
});
var last_tweet;

var TwitterStream = function(io){
  twit.stream('statuses/filter', {'track':'#cat'}, function(stream) {
    stream.on('data', function (data) {
      last_tweet = data;
      io.sockets.emit('tweet', data);
    });
  });

  this.getLastTweet = function() {
    return last_tweet;
  };
};

module.exports = TwitterStream;