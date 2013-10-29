var twitter = require('ntwitter');
var twitter_keys = require('./twitter_keys');
var twit = new twitter({
  consumer_key: twitter_keys.consumer_key,
  consumer_secret: twitter_keys.consumer_secret,
  access_token_key: twitter_keys.access_token_key,
  access_token_secret: twitter_keys.access_token_secret
});
var last_tweet;
var tweet_queue = [];

var TwitterStream = function(){
  twit.stream('statuses/filter', {'track':'#cat'}, function(stream) {
    stream.on('data', function (data) {
      last_tweet = data;
      tweet_queue.push(data);
    });
  });

  // return last tweet fetched from the stream
  // useful for quick tweet push for new clients
  this.getLastTweet = function() {
    return last_tweet;
  };

  this.getTweet = function(io) {
    if(tweet_queue.length > 0) {
      io.sockets.emit('tweet', tweet_queue.shift());
    }
  };
};

module.exports = TwitterStream;