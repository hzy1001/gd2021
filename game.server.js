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
var socketIdList = [];

//신규접속
io.on('connection', function(socket) {  
<<<<<<< HEAD
    console.log("connection id : " + socket.id );   

    //멀티요청
    socket.on('multi_want', function() {  
        console.log("multi_want id : " + socket.id );    
          
        socketList.push(socket); 
        socketIdList.push(socket.id);    

        //intro시작
        //if (socketList.length > 1){        
        //    socketList.forEach(function(item, i) {  
                    //if (item != socket) {
                      
                        socket.emit('start_intro',{ id: socket.id });    
                        console.log('start_intro',socket.id);                  
                    //} 
        //    }); 
=======
      
    socketList.push(socket);
      

    //신규접속자
    console.log("[New Client Connected] id : " + socket.id ); 
    //socket.emit("get_user_data",ls_names);
    socketList.forEach(function(item, i) {
        console.log("보낸 id:",item.id);
        //if (item != socket) {
            item.emit('get_user_data', item.id);
>>>>>>> c2eed8380159c4d6a72ed0bc0976595efa6e63e3
        //}
            
    });

<<<<<<< HEAD
    //멀티시작
    socket.on('multi_start', function() {   
        console.log("multi_start");

        //게임시작(1명이상 접속해야 멀티 가능)
        if (socketList.length <= 1){   
            console.log('ready_game',socketList.length);
            socket.emit('ready_game', socketList.length);
        
        }else {
            socketList.forEach(function(item, i) {  
                    if (item != socket) {
                        item.emit('start_game', item.id);
                        console.log('start_game id',item.id);
                    } 
            }); 
        }  
    });    
=======

    //받은메세지
    socket.on("multi_want",function(id){  
       
        // console.log("socket",socket.id);
   
        console.log("multi_want:" + id) 

        // socket.emit("get_user_data",ls_names + ls_send_message);
        //console.log("받은id:",id);

        //if (socketList.length > 0){


            socketList.forEach(function(item, i) {
                


                //if (item.id == id) {
                                
                    console.log("multi_start"+i,item.id);
                    item.emit('MdrawScreen', item.id);
                    //item.emit("multi_start",item.id);
                    //io.sockets.sockets[socketList[i].id].emit("multi_start",i; 
                //}
            });
        //}
                

    });    


    // //받은메세지
    // socket.on("server_get",function(id){  
        
    //     console.log("받은 id:",id); 

    // });    

 
>>>>>>> c2eed8380159c4d6a72ed0bc0976595efa6e63e3

    // //접속해제
    // socket.on('disconnect', function() {
    //     console.log('disconnect id',socket.id);
    //     socketList.splice(socketList.indexOf(socket), 1);
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