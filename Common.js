/////////////////////////////////////////////////////////////////////////////////////
/////////////////공통함수 정의 2019.03 add by JohnRed/////////////////
/////////////////////////////////////////////////////////////////////////////////////
//OS체크
function getOSInfo()
{
   var ua = window.navigator.userAgent;
  
   if(ua.indexOf("NT 6.0") != -1) return "Windows Vista/Server 2008";
   else if(ua.indexOf("NT 5.2") != -1) return "Windows Server 2003";
   else if(ua.indexOf("NT 5.1") != -1) return "Windows XP";
   else if(ua.indexOf("NT 5.0") != -1) return "Windows 2000";
   else if(ua.indexOf("NT") != -1) return "Windows NT";
   else if(ua.indexOf("9x 4.90") != -1) return "Windows Me";
   else if(ua.indexOf("98") != -1) return "Windows 98";
   else if(ua.indexOf("95") != -1) return "Windows 95";
   else if(ua.indexOf("Win16") != -1) return "Windows 3.x";
   else if(ua.indexOf("Windows") != -1) return "Windows";
   else if(ua.indexOf("Linux") != -1) return "Linux";
   else if(ua.indexOf("Macintosh") != -1) return "Macintosh";
   else return "";
 
} 

// //현재 파일명+확장자 얻기		
// var thisfilefullname = document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.length);

// //현재 파일이름의 폴더명 얻기		
// var thisfilefoldername = thisfilefullname.substring(thisfilefullname.lastIndexOf('.'), 0);

// //안드로이드일경우 앱종료버튼 클릭시 종료(뒤로가기실행).
// //if (getOSInfo().indexOf("Windows") < 0){
//   //alert("os:"+getOSInfo().indexOf("Windows"))
//   onLoad();

//   function onLoad() {
//     //alert("onLoad")
//     document.addEventListener("deviceready", onDeviceReady, false);
//   }
//   function onDeviceReady() {
//     //alert("onDeviceReady")
//     document.addEventListener("backbutton", onBackKeyDown, true);
//   }
//   function onBackKeyDown() {
//     //alert("onBackKeyDown")
//     navigator.notification.confirm('앱을 종료하시겠습니까?', onBackKeyDownMsg, '건닷지', '취소, 종료');
//   }
//   function onBackKeyDownMsg(button) {
//     //alert("onBackKeyDownMsg")
//     if(button == 2) {
//         navigator.app.exitApp();
//     }
//   }
// //}  
 
// // 뒤로가기 버튼 방지 
// var killBackSpace = function(e) { e = e ? e : window.event; var t = e.target ? e.target : e.srcElement ? e.srcElement : null; if(t && t.tagName && (t.type && /(password)|(text)|(file)/.test(t.type.toLowerCase())) || t.tagName.toLowerCase() == 'textarea') { return true; } var k = e.keyCode ? e.keyCode : e.which ? e.which : null; if(k == 8) { if(e.preventDefault) { e.preventDefault(); } return false; } return true; }; if(typeof document.addEventListener != 'undefined') { document.addEventListener('keydown', killBackSpace, false); }else if(typeof document.attachEvent != 'undefined') { document.attachEvent('onkeydown', killBackSpace); }else { if(document.onkeydown != null) { var oldOnkeydown = document.onkeydown; document.onkeydown = function(e) { oldOnkeydown(e); killBackSpace(e); }; }else { document.onkeydown = killBackSpace; } }

// //if (thisfilefullname != 'index.html'){ 
//   //Back 버튼방지
//   history.pushState(null, document.title, location.href); window.addEventListener('popstate', function(event) { history.pushState(null, document.title, location.href); });
// //}

// //우클릭, 드래그, 선택 방지
// $(document).on("contextmenu dragstart selectstart",function(e){
//     return false;
// }); 

// //화면 드래그 방지
// //$('html, body, totdiv').css({'overflow': 'hidden', 'height': '100%'});
// $('#totdiv').on('scroll touchmove mousewheel', function(event) {
//     event.preventDefault();
//     event.stopPropagation();
//     return false;
// });	


/////////////////음악및 효과음 관련.////////////////////////////////// 
// var bgsound;
// var stsound;

//f_bgsound();

//메인화면 사운드객체(멈춘상태에서 이어서 재생하기위해 전역으로 선언)
// bgsound = document.getElementById('bgsound'); //시작화면배경음악.
// stsound = document.getElementById('stsound'); //스타트버튼효과음.
 
 
// function f_bgsound(){

//     //메인화면 사운드객체
//      //bgsound = document.getElementById('bgsound'); //시작화면배경음악.
//      //stsound = document.getElementById('stsound'); //스타트버튼효과음.

//   //bgsound.oncanplaythrough = function(){      //냅다 스타트(play 눌러버리리때의 인터런트 에러가 방지.
//       //bgsound.play(); 
//   //}

//     if (bgsound == null){
//        bgsound = document.getElementById('bgsound'); //시작화면배경음악.
//      } 

//     if (stsound == null){
//       stsound = document.getElementById('stsound'); //시작화면배경음악.
//     }

//     // Show loading animation.
//     var playPromise = bgsound.play(); 

//     if (playPromise !== undefined) {
//       playPromise.then(_ => {
    
//         // Automatic playback started!
//         // Show playing UI.
  
//         //bgsound.currentTime = 0; //재생위치
        
//         bgsound.play(); 
//         bgsound.loop = true; // 반복여부	
//       })
//       .catch(error => {
//         // Auto-play was prevented
//         // Show paused UI.
//       });
//     };
    
// };

//가로~세로 변경시 이벤트 자동 감지 
var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

window.addEventListener(orientationEvent, function() {
  
  f_search_landmode();
  
}, false);

//가로,세로모드를 전환해도 변경된 화면 모드 유지
//window.orientation.lock();
//screen.lockOrientation("orientation");

/////////////////가로, 새로 모드 감지.////////////////////////////////// 
function f_search_landmode(){ 
  
  var lstotdiv = document.getElementById("totdiv");           //화면 가리개
    //var lsGameCanvas = document.getElementById("GameCanvas");
    
    // if (bgsound == null){
    //   bgsound = document.getElementById('bgsound'); //시작화면배경음악.
    // }

    //가로모드일때
    if(Math.abs(parseInt(window.orientation)) == 90){
      //alert("가로")
      lstotdiv.style.visibility = "hidden";     
                        
      //f_bgsound();   
      //lsGameCanvas.SetActive(true);
      //bgsound.play();
    } else {
         
      //세로모드 
      //윈도우일경우.
      if (getOSInfo().indexOf("Windows") >= 0) {
        //alert("세로1")
        lstotdiv.style.visibility = "hidden"; 
      }else { 
        //alert("세로2")
        lstotdiv.style.visibility = "visible"; 
      }
      
      // bgsound.pause();
      //lsGameCanvas.SetActive(false);
    }

    //lstotdiv.style.width = screen.availWidth;   //화면 드래그시 여백 보임 방지
    //lstotdiv.style.height = screen.availHeight;   //화면 드래그시 여백 보임 방지 
    //화면 드래그 방지
    //$('html, body, totdiv').css({'overflow': 'hidden', 'height': '100%'});
    $('#totdiv').on('scroll touchmove mousewheel', function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    });	     
}

//전체화면으로 실행하기
function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

