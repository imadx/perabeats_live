var socket = io();
var socket_id = "";
socket.on('new_control', function(msg){
	console.log(msg);
	socket_id = msg;
	socket.emit('new_control', msg);
})