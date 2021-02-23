var express = require('express');
var app = express(); 
var http = require('http'); 

var server = http.Server(app);       //익스프레스를 탑제한 http서버
var socket = require('socket.io');   //소켓 IO
var io = socket(server);             //웹서버를 탑제한 소켓 IO
var i = 0;

var client_time = 0;
var client_enemy_idx;

var clientObject = {};
var serverObject = {};
var multi_master_yn = 'N';
var multi_master_id = '';

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
//시간 맞추기
 var server_game_time = 0;
var server_enemy_idx;
var servar_enemy_type;

//멀티 화면 싱크 맞추기 
var sRandoms = new Array; //서버랜덤값
 
function f_sRandoms(){

    for (var i=0;i<10;i++){
        sRandoms[i] = Math.floor(Math.random() * (i+1)) + 1; 
        //console.log(i,sRandoms[i])
    }  
}

//신규접속
io.on('connection', function(socket) {  
    console.log("connection id : " + socket.id );    
    socketList.push(socket); 
    socketIdList.push(socket.id);   

    //접속해제(브라우저 종료시?)
    socket.on('disconnect', function() {
        console.log('Disconnect id',socket.id);
        socketList.splice(socketList.indexOf(socket), 1);
    });    

     //접속해제(게임 종료시?)
    socket.on('gameDisconnect', function() {
        console.log('gameDisconnect id',socket.id);
        socket.disconnect();
    })       
     
    //멀티 요청 및 대기
    socket.on('multi_request', function() {   

        console.log("multi_request 접속인원",socketList.length);

        //게임시작(1명 이상 접속해야 멀티 가능)
        if (socketList.length <= 1){  

            console.log('multi_wait',socketList.length);
            socket.emit('multi_wait',socketList.length); 

        }else {

            //2명이상 접속이 되면 각 접속자에게 소켓id를 넘겨준다.
            socketList.forEach(function(item, i) {  
                  
                    if (item != socket) { 
                        item.emit('multi_connect', item.id);
                        console.log('multi_connect id',item.id);
                    } 
            });  
        }  
    });    

    //멀티 수락 및 시작(수락하면 수락한의 멀티마스터의 시간을 공유하고 서버랜덤값을 던져준다.)
    socket.on('multi_allowed', function(multi_game_time) {    

 
        console.log("multi_allowed : ",multi_game_time);   

            f_sRandoms();

            socketList.forEach(function(item, i) {  
                    //서버 랜덤값은 모두에게 나누어준다.
                    //if (item != socket) { 
                        item.emit('multi_start', multi_game_time, sRandoms);
                        console.log(multi_game_time, sRandoms);
                    //}  
            });   
    });   

    //클라이언트에서 시간과 적(배열)을 받아서 다시 상대편으로 넘겨줘서 싱크를 맞춘다.
    //socket.on('client_drawscreen', function(client_time,client_enemy_idx) {    
        socket.on('client_drawscreen', function(clientObject) {    
        
            socketList.forEach(function(item, i) {  
                    
                    //멀티 마스터 기준으로 싱크를 맞춘다. 
                    if (clientObject.multi_master_yn == 'Y'){  

                        serverObject = clientObject; 

                        item.emit('server_drawscreen', serverObject);

                        console.log("multi_master_yn :", serverObject.multi_master_yn);
                        console.log("multi_game_time :", serverObject.multi_game_time);
                        //console.log("enemy_index :", serverObject.enemy_index);    
                        //console.log("enemy_cnt :", serverObject.enemy_cnt);     
                        //console.log("enemy_type :", serverObject.enemy_type);    
                        //console.log("enemy_array :", serverObject.enemy_array);  
                        //console.log("weapponArray :", serverObject.weapponArray);                                            

                    } 
            });  

            // //시간이 빠른쪽 기준으로 싱크를 맞춘다.
            // if(game_time1  > game_time2){
            //     server_game_time = game_time1;
            //     server_enemy_idx = enemy_idx1;
            // }else {
            //     server_game_time = game_time2;
            //     server_enemy_idx = enemy_idx2;
            // }
            
            //console.log(game_time1,game_time2);
            //f_sRandoms();
            // socketList.forEach(function(item, i) {  
            //     //if (item != socket) {
            //     if (i > 0){
            //          console.log("server_game_time :", server_game_time);
            //          console.log("server_enemy_idx :", server_enemy_idx);                    
            //          item.emit('server_drawscreen', server_game_time, server_enemy_idx);
            //     }
            //     //}   
            // });  
    });       

    //이러게 하니깐 부하많이걸림
    //setInterval(serverFrame, 1000/10);
    //var serverTime = 0;

    // function serverFrame(){

    //     serverTime++;

    //     console.log("serverFrame : ", serverTime)
    //     //socket.emit('serverFrame', server_i);
    //     //socket.emit('serverFrame', function(){
    //         socket.emit('serverFrame', serverTime);
    //         socketList.forEach(function(item, i) {  
    //             //if (item != socket) {
    //                 item.emit('serverFrame', serverTime);
            
    //             //} 
    //         });      
    // }   

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