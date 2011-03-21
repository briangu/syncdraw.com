var pressed = false;
var client;
var uid = Faye.random(128);
var channel;
var pubsub;
var cmds = new Array();
var p;
var host='http://unilium.com:8000/f';

function init() {
        channel = getChannel();
        pubsub = '/m/' + pathArray[pathArray.length-1];
	client = new Faye.Client(host);
	client.subscribe(pubsub, function(message) {
		onRemoteDraw(JSON.parse(message.text));
	});
	var canvas = document.getElementById("canvas1");  
	p = new Processing(canvas, sketchProc); 
};

var qX = -1;
var qY = -1;

function onRemoteDraw(msg) {
	if (msg[1] == -2) {
		cmds.push([-2, msg[2]]);
		return;
	}
	if (msg[0] == uid) return;
	cmds.push(msg[1]);
};

function doClear() {
        var coords = [uid, -2, 102];
        client.publish(pubsub, {
                text: JSON.stringify(coords)
        });
};

function getChannel() {
        pathArray = window.location.pathname.split( '/' );
        return pathArray[pathArray.length-1];
};

function sketchProc(processing) {

processing.setup = function() {
	cmds.push([-2, 102]);
	cmds.push([-3, 255]);
};

processing.mousePressed = function() {
    pressed = true;
    qX = processing.mouseX;
    qY = processing.mouseY;
};

processing.mouseReleased = function() {
    pressed = false;
	var coords = [uid, -1, -1];
	client.publish(pubsub, {
        	text: JSON.stringify(coords)
        	});
	qX = -1;
	qY = -1;
};

processing.draw = function() {
  	if(pressed) {
		var curX = processing.mouseX;
		var curY = processing.mouseY;
		var arr = [0, qX, qY, curX, curY];
		cmds.push(arr);
		qX = curX;
		qY = curY;
		var coords = [uid, arr];
	       	client.publish(pubsub, {
                		text: JSON.stringify(coords) 
        		});
	}
	while(cmds.length > 0) {
		cmd = cmds.shift();
		switch (cmd[0]) {
			case 0:
				processing.stroke(255);
				processing.line(cmd[1], cmd[2], cmd[3], cmd[4]);
				break;
			case -2:
				processing.background(cmd[1]);
				break;
			case -3:
				processing.stroke(cmd[1]);
				break;
		}
	}
};
};


