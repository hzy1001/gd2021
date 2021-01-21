var express = require('express');
var app = express(); 
var http = require('http'); 

var server = http.Server(app);       //익스프레스를 탑제한 http서버
var socket = require('socket.io');   //소켓 IO
var io = socket(server);             //웹서버를 탑제한 소켓 IO
var i = 0;

// app.use('/', function(req, resp) {   //익스프레스 라우팅
//     resp.sendFile(__dirname + '/index.html');
// });  

//정적 페이지로 연결되도록 한다.
//app.use(express.static('정적으로 서비스할 폴더'));
app.use(express.static(__dirname + '/'));

//heroku서버에서 제공되는  포트를 자동으로 설정하려면...
var port = process.env.PORT || 3000;

server.listen(port, function() {
    console.log('Server On !');
});

var socketList = [];

io.on('connection', function(socket) {  
      
    socketList.push(socket); 
  
    //socketList.forEach(function(item, i) {
      //  console.log("신규 접속 id:",item.id);
        //if (item != socket) {
            socket.emit('get_user_data',socketList.length);
        //}
    //});

    console.log("신규 접속자 수:",socketList.length);


    socket.on('disconnect', function() {
        socketList.splice(socketList.indexOf(socket), 1);
    });

    //받은메세지
    socket.on("multi_want",function(id){   
   
        console.log("multi_want:" + id) 
 
        //if (socketList.length > 0){ 

            socketList.forEach(function(item, i) { 

                if (item != socket) {
                                
                    console.log("multi_start"+i,item.id);
                    item.emit('multi_start', item.id);
                    //item.emit("multi_start",item.id);
                    //io.sockets.sockets[socketList[i].id].emit("multi_start",i; 
                }
            });
        //} 

    });    


    // //받은메세지
    // socket.on("server_get",function(id){  
        
    //     console.log("받은 id:",id); 

    // });    

 

});

// function Player(id)
// {
//     this.id = id;
//     this.isWantGame = false;
//     this.rival_id = 0;
// }


// import.sockets.on("connection",function(socket)
// {
//     var player;
//     socket.get("user_data", function(error, user_data)
//     {
//         player = user_data;
//     });

//     player.isWantGame = true;

//     for(var i = 0; i < arrPlayers.length; i++)
//     {
//         if(arrPlayers[i].id == player.id)
//         {
//             continue;

//             if(arrPlayers[i].isWantGame == true)
//             {
//                     console.log("[start game]");
//                     player.isWantGame = false;
//                     arrPlayers[i].isWantGame = false;

//                     player.rival_id = arrPlayers[i].id;
//                     arrPlayers[i].isWantGame = false;

//                     io.sockets.sockets[player.id].emit("start_game");
//                     io.sockets.sockets[arrPlayers[i].id].emit("start_gmae");
//             } 
//         }
//     } 
// });