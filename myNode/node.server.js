var express = require('express');
var app = express(); 
var http = require('http'); 

var server = http.Server(app);       //익스프레스를 탑제한 http서버
var socket = require('socket.io');   //소켓 IO
var io = socket(server);             //웹서버를 탑제한 소켓 IO
var i = 0;

app.use('/', function(req, resp) {   //익스프레스 라우팅
    resp.sendFile(__dirname + '/nodejs.html');
});  

server.listen(8088, function() {
    console.log('Server On !');
});

io.on('connection', function(socket) {  
      
    //i = i + 1;

    socket.on('SEND', function(msg) {
        console.log(msg); 
        i= msg;
    }); 

        
    socket.emit('getusername', "홍길동" + i); 


    // socket.on('disconnect', function() { 
    //     console.log("사용자 연결 해제");
    // }); 

});

// var socketio  = require("socket.io");
// var io2 = socketio.listen(server);       
// io2.sockets.on("connection",function(socket){
//     console.log("test");
// })   