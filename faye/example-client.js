var Faye   = require('faye'),
    sys = require('sys');

var client = new Faye.Client('http://localhost:8000/');

client.subscribe('/messages', function(message) {
  sys.log('Got a message: ' + message.text);
});

