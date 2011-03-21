
var Faye   = require('faye');
var client = new Faye.Client('http://localhost:8000/');
client.publish('/messages', {
  text: 'Hello world'
});


