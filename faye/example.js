var Faye   = require('faye'),
    sys = require('sys'),
    server = new Faye.NodeAdapter({mount: '/'});

server.listen(8000);

sys.log('here');

var client = new Faye.Client('http://localhost:8000/');

client.subscribe('/messages', function(message) {
  sys.log('Got a message: ' + message.text);
});

client.publish('/messages', {
  text: 'Hello world'
});

sys.log('waiting');

