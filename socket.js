function LoadJavaScript(src)
{
    var el = document.createElement("script");
    el.setAttribute("src", src);
    document.getElementsByTagName("head")[0].appendChild(el);
}
 
LoadJavaScript("/socket.io/socket.io.js" );

function gfwSocket( server_http )
{
    //var src = "/socket.io/socket.io.js";

   //LoadJavaScript( server_http + "/socket.io/socket.io.js" );

   setTimeout( function()
    { 

        //gfwSocket = this; 

        console.log("gfwSocket",gfwSocket)

    }, 1000);
     
        //this.socket = io.connect( server_http );
        //gfwSocket.socket = io();  
        this.socket = io.connect( server_http );
        //console.log("this.socket",this.socket)

    //gfwSocket = this;

    
    //console.log("gfwSocket",gfwSocket)

}

gfwSocket.prototype.On = function( event, func )
{
    this.socket.on( event, func );
}

gfwSocket.prototype.Emit = function( event, func )
{
    this.socket.emit(  event, func );
}

gfwSocket.prototype.Disconnect = function()
{
      console.log( "[Client Disconnected] " );
    if( this.socket ) 
        this.socket.disconnect();
}


var gfwSocket;