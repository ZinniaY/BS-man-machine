/**
 * Created by wangziying on 2017/9/21.
 */
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 9000 });

wss.on('connection', function connection(ws) {
	// 从客户端接收的数据
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});
	
	var msg = [
		{id:10001222,value:"456"},
		{id:10001223,value:"789"},
		{id:10001221,value:"999"}
	];
	
	setTimeout(function(){
		// 服务器端发送的数据
		ws.send(JSON.stringify(msg));
	},5000);
	
});