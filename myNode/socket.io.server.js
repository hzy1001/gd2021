var http = require("http");
var fs = require('fs');   //File System 함수를 node js에 가져오는 방법은 require('fs'); 이다. 출처: https://dydals5678.tistory.com/96 [아빠개발자의 노트]
const { isObject } = require("util");
//var socketio = require("socket.io");  ==> 이와같이하면 socketio 모듈을 직접 핸들하게 되고, 에러가 발생한다. 아래에 var socketio = require("socket.io")(server); 로 변경

//노드 웹서버 실행
var server = http.createServer(
    function(request, response){

        var url = "/nodejs.html";

        //response.end('<b>Hello NodeJs WebServer</b>&nbsp;<button onclick="location.href=./nodejs.html">Click</button>');
        response.end(fs.readFileSync(__dirname + url));   //첫패이지 라우팅
    }
); 

//노드 서버 실행
server.listen(9892, function(){
    console.log('NodeJS Server Start port:9892'); 
}) 

//socketio모듈을 인스턴스화 하여 핸들해야한다
var socketio = require("socket.io")(server); //참조url: https://stackoverflow.com/questions/41623528/io-on-is-not-a-function
var io = socketio.listen( server ); 

var socketList = [];

//socketio.on("connection", function(socket)
io.on("connection", function(socket)
{
    console.log('Socket Client Connected 크크크')
})

//접속자 랜덤
function RandomNextInt(max)
{
    return 1 + Math.floor( Math.random() * max);
}

//접속자
var names = ['길동','동수','승기','채윤','지완'];
var ls_names = "";
var i = 0;

var j = 0;

//클라이언트 접속
io.sockets.on("connection", function( socket )
{
    socketList.push(socket);
    
    var random = RandomNextInt(5) - 1;
 
    ls_names = ls_names + " ID : " + socket.id + " | Name : " + names[random] + "<br>"; 

    //신규접속자
    console.log("[New Client Connected] name : " + names[random]); 
    //socket.emit("get_user_data",ls_names);
    socketList.forEach(function(item, i) {
        console.log(item.id);
        //if (item != socket) {
            item.emit('get_user_data', ls_names);
        //}
    });

    
    //받은메세지
    socket.on("get_send_message",function(send_message){  
       
        // console.log("socket",socket.id);
   
        // var ls_send_message = " -> " + send_message;
       
        // console.log("[Send Client Message] message : " + ls_send_message);

        // socket.emit("get_user_data",ls_names + ls_send_message);
        console.log("socket.id:",socket.id);
        socketList.forEach(function(item, i) {
            console.log(item.id);
            //if (item != socket) {
                var ls_send_message = ls_names + " -> " + send_message;
                item.emit('get_user_data', ls_send_message);
            //}
        });
                

    });


    setInterval(fn_test, 1000/60);

    function fn_test(){
      
        console.log("j",j) 
        socket.emit("get_move_message",j);   
        j = j + 1;
    }


    //접속 해제
    socket.on('disconnect',function(){
        console.log(" 접속 해제]");
        i--;
        socketList.splice(socketList.indexOf(socket), 1);
    })
});


 