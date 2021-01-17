function LoadJavaScript(src)
{
    var el = document.createElement("script");
    el.setAttribute("src", src);
    document.getElementsByTagName("head")[0].appendChild(el);
}

function gfwSocket( server_http )
{
    LoadJavaScript( server_http + "/socket.io/socket.io.js" );
   setTimeout( function()
    {
        gfwSocket.socket = io.connect( server_http );
    }, 1000);
    
     
    gfwSocket = this;
}

gfwSocket.prototype.On = function( event, func )
{
    this.socket.on( event, func );
}

gfwSocket.prototype.Emit = function( event, data )
{
    this.socket.emit( event, data );
}

gfwSocket.prototype.Disconnect = function()
{
      console.log( "[Client Disconnected] " );
    if( this.socket ) 
        this.socket.disconnect();
}


var gfwSocket;