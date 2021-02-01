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
    console.log("connection id : " + socket.id );    


    socketList.push(socket); 
    socketIdList.push(socket.id);   
    
    // //멀티 게임 요청
    // socket.on('multi_want', function() {  
    //     console.log("multi_want id : " + socket.id );    
          
    //     //socketList.push(socket); 
    //     //socketIdList.push(socket.id);    

    //     //intro시작
    //     //if (socketList.length > 1){        
    //     //    socketList.forEach(function(item, i) {  
    //                 //if (item != socket) {
                      
    //                     socket.emit('start_intro',{ id: socket.id });    
    //                     console.log('start_intro',socket.id);                  
    //                 //} 
    //     //    }); 
    //     //}
            
    // });

    //멀티 요청 및 대기
    socket.on('multi_ready', function() {   
        console.log("multi_ready 접속인원",socketList.length);

        //게임시작(1명이상 접속해야 멀티 가능)
        if (socketList.length <= 1){   
            console.log('wait_game',socketList.length);
            socket.emit('wait_game', socketList.length);
        
        }else {
            socketList.forEach(function(item, i) {  
                    if (item != socket) {
                        item.emit('multi_connect', item.id);
                        console.log('multi_connect id',item.id);
                    } 
            }); 
        }  
    });    

    var serverTime = 0;    
    //멀티 수락 및 시작
    socket.on('multi_allowed', function() {   
        console.log("multi_allowed",socketList.length);  

            socketList.forEach(function(item, i) {  
                    //if (item != socket) {
                        item.emit('multi_start', item.id);
                        console.log('multi_start id',item.id);
                
                    //} 

                    //이러게 하니깐 부하많이걸림
                    //setInterval(serverFrame, 1000/10);
                    
                    //serverTime = 0;  
            });  

          
    });      


    //멀티 게임 플레이
    socket.on('multi_play', function(game_time) {    

            socketList.forEach(function(item, i) {  
                    if (item != socket) {
                        item.emit('show_time', game_time);
                        console.log("share time :"+game_time)
                
                    }  
            });  

          
    });       

    //이러게 하니깐 부하많이걸림
    //setInterval(serverFrame, 1000/10);
    
    //var serverTime = 0;

    function serverFrame(){

        serverTime++;

        console.log("serverFrame : ", serverTime)
        //socket.emit('serverFrame', server_i);
        //socket.emit('serverFrame', function(){
            socket.emit('serverFrame', serverTime);
            socketList.forEach(function(item, i) {  
                //if (item != socket) {
                    item.emit('serverFrame', serverTime);
            
                //} 
            });      
    }   

    /*
    // 클라이언트에서 받은다음 보내주면.... ==> 이것도 부하가 많이걸리지만 위보다는 적은거 같음. 
    var serverTime = 0;
    socket.on('clientFrame', function(multiTime) {   
            //시간은 현재 접속된 첫번째 소켓 기준으로 증가
 
            //console.log("serverFrame : ", multiTime)

            serverTime++;

            // socketList.forEach(function(item, i) {  

            //     //모든 클라이언트 공용
            //     item.emit('serverFrame', serverTime);    
            // });       

      
            console.log("serverFrame : ", serverTime)

            //socket.emit('serverFrame', serverTime);            
        
    });    
    */

    //접속해제(브라우저 종료시?)
    socket.on('disconnect', function() {
        console.log('disconnect id',socket.id);
        socketList.splice(socketList.indexOf(socket), 1);
    });    

     //접속해제(게임 종료시?)
    socket.on('gameDisconnect', function() {
        console.log('gameDisconnect id',socket.id);
        socket.disconnect();
    })    
       
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