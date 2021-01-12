window.addEventListener("load", onPageLoaded, false);
 

 function onPageLoaded(){  
      
     var socket = io.connect("//127.0.0.1:9892");

     //이게 외안되지 ??
     socket.on("get_user_data",function(name){
          alert("내이름은" + name + "입니다.");
     });
    
 }