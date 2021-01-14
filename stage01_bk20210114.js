/////////////////////////////게임용 캔버스 관련 설정///////////////////////////////////////////
// var GAME_STATE_READY = 0; // 준비
// var GAME_STATE_GAME = 1;  // 게임 중
// var GAME_STATE_OVER = 2;  // 게임 오버

// 게임 상태값을 저장하는 변수
//var GameState = GAME_STATE_READY; // 초깃값은 준비 상태

//게임 진행시 필요한 이벤트 선언
window.addEventListener("load",drawScreen, false);
window.addEventListener("keydown",onkeyDown, false);
window.addEventListener("keyup",onkeyUp, false);

//제일 처음 페이지 load 여부
var first_load_yn = "Y";

//필요한 이벤트 객체 선언
var strKeyEventType = "None";
var strKeyEventValue = "None";

//게임 캠퍼스
var theCanvas = document.getElementById("GameCanvas");

//전체 화면 크기에 맞추기(화면 가로/세로)
var ls_width = window.innerWidth;
var ls_height = window.innerHeight;	        	//터치 드래그시 상단 주소창 숨기기위해 높이값 더줌.
// var ls_width = document.innerWidth;
// var ls_height = document.innerHeight;	        	//터치 드래그시 상단 주소창 숨기기위해 높이값 더줌.

var docV = document.documentElement;

//윈도우 리사이징 호출
window.addEventListener("resize",  fit_resize);

//게임 로드시 켐퍼스 리사이징 조정
fitToContainer(theCanvas);

//게임 진행 컨텍스트(게임 오브젝트(플레이어 및 적) 진행  + 컨트롤 + 스코어)
var Context = theCanvas.getContext("2d");
//게임 상태 컨텍스트(게임 상태 표시 : 시작, 진행, 멈춤, 종료 메세지)
var Context2 = theCanvas.getContext("2d");
//게임배경 컨텍스트(게임 배경(우주 및 콜로니))
var Context3 = theCanvas.getContext("2d");

//게임 화면 경계
var minX = theCanvas.offsetLeft;
var maxX = theCanvas.clientWidth - minX;
var minY = theCanvas.offsetTop;
var maxY = theCanvas.clientHeight - minY;
var add_borderX = 0;
var add_borderY = 0;

/////////////////////////////////////////게임 컨트롤 관련 설정//////////////////////////////////////////
//캔버스 엘리먼트로 게임 컨트롤 버튼 변경 => 둠객체사용시 화면 확대 축소됨 에 따른 불편 생김(기존 조종 컨트롤 돔객체는 hidden 처리)
//키입력 저장 array
var isKeyDown = [];
var isKeyCode = null;

var directonUp = null;
var directonDown = null;
var directonLeft = null;
var directonRight = null;
var directonUpLeft = null;
var directonUpRight = null;
var directonDownLeft = null;
var directonDownRight = null;
var directonMiddle = null;

var button01 = null;
var button02 = null;

//컨트롤 색상
var ls_CColor = localStorage.getItem('control_color'); 
 
//DEV 색상
var ls_DColor = localStorage.getItem('dev_color'); 

// //전체화면
// var ls_TColor = localStorage.getItem('total_color'); 
// if (ls_TColor == "yellow"){ 	
//     toggleFullScreen();
// }

directonUp = new Path2D();
directonUp.fillStyle = "rgb(242, 255, 0)";; 
directonUp.rect(minX + 120, maxY - 330, 100, 140);

directonLeft = new Path2D();
directonLeft.fillStyle = "rgb(242, 255, 0)";;
directonLeft.rect(minX + 10, maxY - 220, 140, 100);

directonRight = new Path2D();
directonRight.fillStyle = "rgb(242, 255, 0)";;
directonRight.rect(minX + 190, maxY - 220, 140, 100);

directonDown = new Path2D();
directonDown.fillStyle = "rgb(242, 255, 0)";;
directonDown.rect(minX + 120, maxY - 150, 100, 140);

directonUpLeft = new Path2D();
directonUpLeft.fillStyle = "rgb(242, 255, 0)";;
directonUpLeft.rect(minX + 40, maxY - 300, 80, 80);

directonUpRight = new Path2D();
directonUpRight.fillStyle = "rgb(242, 255, 0)";;
directonUpRight.rect(minX + 220, maxY - 300, 80, 80);

directonDownLeft = new Path2D();
directonDownLeft.fillStyle = "rgb(242, 255, 0)";;
directonDownLeft.rect(minX + 40, maxY - 120, 80, 80);

directonDownRight = new Path2D();
directonDownRight.fillStyle = "rgb(242, 255, 0)";;
directonDownRight.rect(minX + 220, maxY - 120, 80, 80);

directonMiddle = new Path2D();
directonMiddle.fillStyle = "rgb(242, 255, 0)";;
directonMiddle.arc(minX + 170, maxY - 170, 18, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)

button01 = new Path2D();
button01.fillStyle = "rgb(242, 255, 0)";;
//button01.arc(maxX - 250, maxY - 180, 80, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
button01.arc(maxX - 250, maxY - 180, 100, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)

button02 = new Path2D();
button02.fillStyle = "rgb(242, 255, 0)";;
//button02.arc(maxX - 80, maxY - 180, 80, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
button02.arc(maxX - 80, maxY - 180, 70, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)

/////////////////////////////////////////게임 관련 상태 설정 시작////////////////////////////////////////
//초기 게임 상태
var init_status = 1;  //1:Start,   2:ing,  3:Pause
//기본 게임 프래임
var ini_gameFrame = 60;  //60프레임
//진행시간(=거리)
var init_gameTime = 0;
var gameTime = 0;
var init_gameScore = 0;
var gameScore = 0;
//화면 타이머 id
var init_Timer_Id = 0;  //var Timer_Id = setInterval(drawScreen, 1000/gameFrame); <= 재일 처음 시작시에는 움지기지 않는다.
var Timer_Id = 0;
//게임 배경의 진행 시점(목적지)
var init_cityEnd_size = 100;       //게임 진행 방향 타겟 사이즈
var init_cityEnd_x = 0;            //게임 진행 방향 타겟 x좌표
var init_cityEnd_y = 0;            //게임 진행 방향 타겟 y좌표
var init_Pdistance = 0;            //게임 진행 방향 타겟에서 플레이어까지 거리(플레이어 원근 설정을 위해)
var init_Edistance = 0;            //게임 진행 방향 타켓에서 적까지의 거리

//게임 계속 or 종료 버튼
var button_play = null;
button_play = new Path2D();
button_play.fillStyle = "rgb(242, 255, 0)";
button_play.rect(ls_width/2 - 300, ls_height/2 - 250 , 300, 150);
var button_end = null;
button_end = new Path2D();
button_end.fillStyle = "rgb(242, 255, 0)";
button_end.rect(ls_width/2 + 10, ls_height/2 - 250 , 300, 150);

var button_continue = null;
button_continue = new Path2D();
button_continue.fillStyle = "rgb(242, 255, 0)";
button_continue.rect(ls_width/2 - 250, ls_height/2 - 80 , 500, 150);


//초기설정 게임 변수에 저장
var gameFrame = ini_gameFrame;
var cityEnd_size = init_cityEnd_size;
var cityEnd_x = init_cityEnd_x;
var cityEnd_y = init_cityEnd_y;
var Pdistance = init_Pdistance;
var Edistance = init_Edistance;

//좌우측 상하단선 백그라운드 거리
var back_distance = 0;
var back_distance2 = 0;

///////////////////////////////////배경 초기 설정//////////////////////////////////////////////////////////
//무공간(투명)이미지
var noneImage = new Image();
noneImage.src = "./img/none.png";
noneImage.addEventListener("load",drawScreen, false);

//게임 배경(우주) 이미지
var backgroundImage = new Image();
backgroundImage.src = "./img/background01.png";
backgroundImage.addEventListener("load",drawScreen, false);

//게임 배경(도로) 이미지
var cityImage = new Image();
cityImage.src = "./img/city01.png";
cityImage.addEventListener("load",drawScreen, false);

var city01Image = new Image();
city01Image.src = "./img/city01.png";
city01Image.addEventListener("load",drawScreen, false);

var city02Image = new Image();
city02Image.src = "./img/city02.png";
city02Image.addEventListener("load",drawScreen, false);

var city03Image = new Image();
city03Image.src = "./img/city03.png";
city03Image.addEventListener("load",drawScreen, false);

var cityEndImage = new Image();
cityEndImage.src = "./img/cityEnd.png";
cityEndImage.addEventListener("load",drawScreen, false);

//땅
var groundImage = new Image();
groundImage.src = "./img/ground.png";
groundImage.addEventListener("load",drawScreen, false);

//강
var riverImage = new Image();
riverImage.src = "./img/river.png";
riverImage.addEventListener("load",drawScreen, false);

///////////////////////////////////플레이어 초기 설정///////////////////////////////////////////////////////
var playerImage = new Image();
playerImage.src = "./img/player.png";
//playerImage.src = "player29.png";
playerImage.addEventListener("load",drawScreen, false);

var player = new Image();
player.src = "./img/player.png";
//playerImage.src = "player29.png";
player.addEventListener("load",drawScreen, false);

var player_90 = new Image();
player_90.src = "./img/player_90.png";
player_90.addEventListener("load",drawScreen, false);

var player_135 = new Image();
player_135.src = "./img/player_135.png";
player_135.addEventListener("load",drawScreen, false);

var player_180 = new Image();
player_180.src = "./img/player_180.png";
player_180.addEventListener("load",drawScreen, false);

var player_270 = new Image();
player_270.src = "./img/player_270.png";
player_270.addEventListener("load",drawScreen, false);

var player_360 = new Image();
player_360.src = "./img/player_360.png";
player_360.addEventListener("load",drawScreen, false);

var player_45 = new Image();
player_45.src = "./img/player_45.png";
player_45.addEventListener("load",drawScreen, false);

var player_warp = new Image();
player_warp.src = "./img/player_warp.png";
player_warp.addEventListener("load",drawScreen, false);

var warp = new Image();
warp.src = "./img/player_warp.png";
warp.addEventListener("load",drawScreen, false);


//폭파이미지01
var explosionImage01 = new Image();
explosionImage01.src = "./img/explosion01.png";
explosionImage01.addEventListener("load",drawScreen, false);

//엔진이미지01
var enginImage = new Image();
enginImage.src = "./img/engin01.png";
enginImage.addEventListener("load",drawScreen, false);

//이전 플레이어 진행방향 키값 => 속도변경시 방향키 새로 안눌러두 이전 방향으로 계속해서 진행되도록 하기위해 필요
var wayBefore = 'None;'

//플레이어 초기값( 크기, 위치 및 기본 이동거리, 스피트)
//var ini_player_width = 70;
//var ini_player_height = 45;
var ini_player_width = 130;
var ini_player_height = 200;
//var ini_player_width = 160;   //319
//var ini_player_height = 250;  //503
var ini_playerX = (theCanvas.clientWidth - ini_player_width)/ 2 - theCanvas.offsetLeft; //X좌표
var ini_playerY = theCanvas.clientHeight - 100;  //Y좌표
var ini_player_size = 100;    //플레이어 초기 크기 배율

//플레이어크기
var playerWidth = ini_player_width;
var playerHeight = ini_player_height;
var player_size = ini_player_size;

//플레이어 시작 위치
var playerX = ini_playerX;
var playerY = ini_playerY;

//플레이어 이동 거리
var pmovex = 0;
var pmovey = 0;
var ini_Pspeed = 1;         //플레이어 초기 스피드
var Pspeed = ini_Pspeed;
var before_pspeed = 0;      //이전 스피트(스트드 업버튼 누르면 바로 속도 증가하도록 하기위해)
var ini_player_life = 5;    //플레이어 생명
var player_life = ini_player_life;
var penerge_bar = ini_energe_bar;

var ini_player_cnt = 0;    //초기 플레이어 갯수(보너스)
var player_cnt = ini_player_cnt;

//플레이어 공간이동(warp) 거리
var ini_warp_distance = 15;
var warp_distance = ini_warp_distance;

//플레이어 미사일 충돌 여부
var player_collision_yn = 'N';

//보너스 발생 전후 여부
var bonus_cnt = 1; 

/////////////////////////////////////////플레이어 레이져 초기 설정///////////////////////////////////////////
var laserImage = new Image();
laserImage.src = "./img/laser01.png";
laserImage.addEventListener("load",drawScreen, false);

var laser = new Image();
laser.src = "./img/laser01.png";
laser.addEventListener("load",drawScreen, false);

//레이져 초기 생성 위치
var laserX = playerX + playerWidth/2;
var laserY = playerY;

//레이져 초기 이동위치 = 생성위치
var lmovex;
var lmovey;

//레이져 초기 크기
var l_size = 1;

//레이져 초기 속도
var lspeed = 1;

//레이져 발사 여부
var laser_yn = 'N';

//레이져 각도
var laser_r = 0;
var laser_d = 0;

///////////////////////////////////전함01 초기 설정////////////////////////////////////////////////////////////////
//전함01 이미지
var ship01_Image = new Image();
    ship01_Image.src = "./img/ship01.png";
    ship01_Image.addEventListener("load",drawScreen, false);
//var enemyGunImage = new Image();
//var weapponImage = new Image();

//전함01 이동좌표
var ini_ship01x = maxX;
var ini_ship01y = maxY/5;
var ship01x = ini_ship01x;
var ship01y = ini_ship01y/5;

///////////////////////////////////적 초기 설정////////////////////////////////////////////////////////////////
//적 이미지
var enemyImage = new Image();
    enemyImage.src = "./img/enemy01.png";

var enemyGunImage = new Image();
var weapponImage = new Image();

//적01 이미지
var enemy01Image = new Image();
enemy01Image.src = "./img/enemy01.png";
enemy01Image.addEventListener("load",drawScreen, false);

//적01 건 이미지
var enemy01GunImage = new Image();
enemy01GunImage.src = "./img/bullet01.png";
enemy01GunImage.addEventListener("load",drawScreen, false);

//적 미사일 이미지
//var weapponImage = new Image();

//적01 총알 이미지 및 로드
var weappon01Image = new Image();
weappon01Image.src = "./img/bullet01.png";
weappon01Image.addEventListener("load",drawScreen, false);

//적01 엔진 이미지
var engin01Image = new Image();
engin01Image.src = "./img/engin01.png";
engin01Image.addEventListener("load",drawScreen, false);

//적02 이미지
var enemy02Image = new Image();
enemy02Image.src = "./img/enemy02.png";
enemy02Image.addEventListener("load",drawScreen, false);

//적02 건 이미지
var enemy02GunImage = new Image();
enemy02GunImage.src = "./img/missile01.png";
enemy02GunImage.addEventListener("load",drawScreen, false);

//적02 미시일 이미지 및 로드
var weappon02Image = new Image();
weappon02Image.src = "./img/missile01.png";
weappon02Image.addEventListener("load",drawScreen, false);

//적02 엔진 이미지
var engin02Image = new Image();
engin02Image.src = "./img/engin01.png";
engin02Image.addEventListener("load",drawScreen, false);

//적 크기
var enemy_size = 1;

//적 스피드
var enemy_speed = 1;

//적 초기 위치
var ini_enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + Math.floor(Math.random() * 100) - Math.floor(Math.random() * 100); //시작  x
var ini_enemyy = parseInt(theCanvas.clientHeight / 4 + cityEnd_y) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 30); //시작 y

//적 이동위치
var enemyxx = 0;
var enemyyy = 0;

//적 크기
// var ini_enemyw = 40;
// var ini_enemyh = 55;
// var ini_enemyw = 20;
// var ini_enemyh = 25;
var ini_enemyw = 42;
var ini_enemyh = 55;
//var ini_enemyw = 60;
//var ini_enemyh = 80;
var enemyw = ini_enemyw;
var enemyh = ini_enemyh;

//적 생명
var ini_enemy_life = 5;
var enemy_life = ini_enemy_life;
var ini_energe_bar = ''  // '■□';   //에너지 바
var energe_bar = ''  // '■□';   //에너지 바

//적 미시일 초기 생성 위치
var weapponX = theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x;
var weapponY = theCanvas.clientHeight / 5 + cityEnd_size/5;

//적 미시일 초기 이동위치 = 생성위치
var move_weapponX = weapponX;
var move_weapponY = weapponY;

//적 미시일 초기 크기
var weappon_size = 1;

//적 미시일 초기 속도
var weappon_speed = 1;

//적 미시일 초기 방향값
var weappon_Randon = 0;   //적 미사일 방향값은 랜덤하게

//적 새로 출몰 간격
var enemy_dealy_time = 1000;

//화면에 나타나는 적 미시일수(배열)
var weapponArray = new Array();
var weappon_index = 0;     //현재 미사일 인덱스
var weappon_cnt = 1;
var ini_max_weappon_cnt = 6;
var max_weappon_cnt = ini_max_weappon_cnt;
var enemy_collision_yn = "N";

//적 (고유)순번
var enemy_index = null;

//적 타입
var enemy_type = 1;

//적 폭파중 여부
var enemy_collision_yn = 'N';

//적 객체 인스턴스 생성
//적 초기 출현 갯수
var enemy_cnt = 1;
var enemy_array = [];

create_enemy();

//적 미사일 방향 설정 초기 변수
var weappon_upDown = 1;
var weappon_leftRight = 1;
var weappon_tmp_random = Math.floor(Math.random() * 7)/10;    //플레이어 위치에 따른 미사일 Y축 이동 좌표

// ////////////////// 윈도우 os의 경우 둠 터치버튼 숨기기
// if (navigator.platform.substr(0,3) != "Win" ){

//     //$("#TopCtl").hide();
//     $("#MainCtl").hide();
//     //$("#MainCtl2").hide();

//     $("#startCtl").hide();
//     //$(".directCtl").hide();
//     $("#attackCtl").hide();

// }

////////////////// 게임 화면 터치 버튼 매핑 시작
function addJavascript(jsname) {

	var th = document.getElementsByTagName('head')[0];
	var s = document.createElement('script');

	s.setAttribute('type','text/javascript');
	s.setAttribute('src',jsname);
	th.appendChild(s);

}

////////////////// 게임 시작
function gameStart(as_keycode) { 

    //최초 페이지 로드 여부
    //first_load_yn = "N";
 
    //키코드 널
    isKeyDown[as_keycode] = false;  

    //게임시작사운드
    //start_sound.play();

    //게임 변수 초기화
    game_init(); 

    //사운드 초기화
    audio.play();
    //audio.currentTime  = 0;

    //플레이어 변수 초기화
    player_init();

    //적 생성
    create_enemy();
    
    //진행 상태
    status = 2;         

    //타이머 초기화
    clearInterval(Timer_Id); 

    Timer_Id = setInterval(drawScreen, 1000/gameFrame);   //게임 프레임(gameFrame은  초기 ini_gameFram 설정값)

}


////////////////// 게임 종료
function gameEnd(as_keycode) {

    if (as_keycode == 13){

        gameStart(13); 

    }else {

        audio.pause();
        //onReady();

        $("#GameCanvas").fadeOut( "slow", function() {

            //window.location = 'end.html';
            location.replace("end.html");

        });

    }
}

////////////////// 화면버튼 이벤트발생시 키코드와  맵핑
function moveDirection(as_keycode) {

isKeyCode = as_keycode;
isKeyDown[as_keycode] = true;

}

////////////////// 화면버튼 이벤트발생 종료시 키코드와  맵핑 제거
function moveDirection2(as_keycode) {

isKeyCode = null;
isKeyDown = [];
isKeyDown[as_keycode] = false;

}

////////////////// 화면 리사이징(캠퍼스 재조정)
function fit_resize(theCanvas){

ls_height = window.innerHeight + 30;      //터치 드래그시 상단 주소창 숨기기위해 높이값 더줌.

window.scrollTo(0,1);

//세로모드 일경우 가로모드로 전환유도 메세지 보여줌.
if (window.matchMedia('(orientation: portrait)').matches) {

    document.getElementById('tot_div').style.visibility = 'hidden';
    document.getElementById('tot_hidden').style.display = 'block';

} else {

    document.getElementById('tot_div').style.visibility = 'visible';
    document.getElementById('tot_hidden').style.display = 'none';

}

////////////////// 게임 캠퍼스 재조정
fitToContainer(theCanvas);
}

////////////////// 게임 캠퍼스 재조정(화면 꽉차게)
function fitToContainer(canvas){

//브라우져 사이즈에 맞게 캠퍼스 확장
$("#tot_div").width(ls_width);
$("#tot_div").height(ls_height);
$("#can_div").width(ls_width);
$("#can_div").height(ls_height);
$("#game_div").width(ls_width);
$("#game_div").height(ls_height);
$("#GameCanvas").width(ls_width);
$("#GameCanvas").height(ls_height );

canvas.style.width='100%';
canvas.style.clientHeight='100%';
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

}

////////////////// 게임 변수 초기화
function game_init(){

    //플레이어 초기화
    player_init(); 

    //게임 초기화(플레이어 갯수(보너스)가 더이상 없는경우만 수행한다.) 
    if (parseInt(player_cnt) > 0){  
        return;
    }

    //게임 제일 처음 로드 여부
    first_load_yn = "N";

    //오디오 처음부터
    audio.currentTime  = 0;

    status = init_status;
    gameFrame = ini_gameFrame;
    gameTime = init_gameTime;
    gameScore = init_gameScore; 
    Timer_Id = init_Timer_Id;
    cityEnd_size = init_cityEnd_size;
    cityEnd_x = init_cityEnd_x;
    cityEnd_y = init_cityEnd_y;
    enemy_size = enemy_size;
    enemy_speed = enemy_speed;

    //남은 플레이어 갯수(보너스)
    //ini_player_cnt = 0;  
    player_cnt = ini_player_cnt;

    //enemyx = parseInt(theCanvas.clientWidth / 2); //시작  x
    //enemyy = parseInt(theCanvas.clientHeight / 4); //시작 y

    //전함01 초기화
    ship01x = ini_ship01x;
    ship01y = ini_ship01y;

    //보너스 발생 여부
    bonus_cnt = 1;

    //적 생명
    ini_enemy_life = 5;
    enemy_life = ini_enemy_life;
    ini_energe_bar = ''  // '■□';   //에너지 바
    energe_bar = ''  // '■□';   //에너지 바

    //적 미시일 초기 생성 위치
    weapponX = theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x;
    weapponY = theCanvas.clientHeight / 5 + cityEnd_size/5;

    //적 미시일 초기 이동위치 = 생성위치
    move_weapponX = weapponX;
    move_weapponY = weapponY;

    //적 미시일 초기 크기
    weappon_size = 1;

    //적 미시일 초기 속도
    weappon_speed = 1;

    //적 미시일 초기 방향값
     weappon_Randon = 0;   //적 미사일 방향값은 랜덤하게

    //적 새로 출몰 간격
    enemy_dealy_time = 1000;

    //화면에 나타나는 적 미시일수(배열)

    enemy_type = 1;
    enemy_cnt = 1;
    enemy_array = [];

    enemyx = ini_enemyx;
    enemyy = ini_enemyy;

    enemyxx = enemyxx;
    enemyyy = enemyyy;

    enemy_life = ini_enemy_life;

    isKeyCode = null;
    isKeyDown = [];
	strKeyEventValue = "None";
    weapponArray = [];
    weappon_cnt = 1;
    ini_max_weappon_cnt = 8;
    max_weappon_cnt = ini_max_weappon_cnt;
    warp_distance = ini_warp_distance;

    back_distance = 0;
    back_distance2 = 0;
    back_distance3 = 0;

    //배경종점으로부터의 플레이어 거리
    Pdistance = init_Pdistance;

    //배경종점으로부터의 적 거리
    Edistance = init_Edistance;

    //적 타입
    enemy_type = 1;

    //적 크기
    enemyw = ini_enemyw;
    enemyh = ini_enemyw;

    //적 초기 위치
    //enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + (Math.floor(Math.random() * 100))  + (Math.floor(Math.random() * 300)) - (Math.floor(Math.random() * 300)); //시작  x
    //enemyy = parseInt(theCanvas.clientHeight / 4) + (Math.floor(Math.random() * 300)) - (Math.floor(Math.random() * 300)); //시작 y

    //적 생명
    ini_enemy_life = 5;
    enemy_life = ini_enemy_life;
    ini_energe_bar = ''  // '■□';   //에너지 바
    energe_bar = ''  // '■□';   //에너지 바

    //적 미시일 초기 생성 위치
    weapponX = theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x;
    weapponY = theCanvas.clientHeight / 5 + cityEnd_size/5;
    //적 미시일 초기 이동위치 = 생성위치
    move_weapponX = weapponX;
    move_weapponY = weapponY;


    weappon_upDown = 1;
    weappon_leftRight = 1;
    weappon_tmp_random = Math.floor(Math.random() * 5)/10;    //플레이어 위치에 따른 미사일 Y축 좌표

    enemy_dealy_time = 1000;

    //화면에 나타나는 적 미시일수(배열)
    //weapponArray = [];
    weappon_cnt = 1;
    //ini_max_weappon_cnt = 5;
    max_weappon_cnt = ini_max_weappon_cnt;
    enemy_collision_yn = "N";
    enemy_index = null;

}

////////////////// 플레이어 변수 초기화
function player_init(){

    //이전 플레이어 진행방향 키값 => 속도변경시 방향키 새로 안눌러두 이전 방향으로 계속해서 진행되도록 하기위해 필요
    wayBefore = 'None;'
    playerWidth = ini_player_width;
    playerHeight = ini_player_height;
    player_size = ini_player_size;
    playerX = ini_playerX;
    playerY = ini_playerY;
    pmovex = 0;
    pmovey = 0;
    Pspeed = ini_Pspeed;
    before_pspeed = 0;
    player_life = ini_player_life;
    playerImage = player;
    laserImage = laser;
    player_warp = warp;
    //player_cnt = ini_player_cnt;
}

////////////////// 플레이어 경계 이탈 방지
function player_border(){

    ////플레이어 켐퍼스 배경 이탈방지 => 키다운 이벤트에서 선언하면 경계를 빠져나가는 경향이 있어서 스크린 로드에 선언///////
    if (playerX + playerWidth >= maxX){
        playerX = maxX - playerWidth - 1;  //1 은 반동
        pmovex = 0;
    };
    if (playerX <= minX){
        playerX = minX + 1;
        pmovex = 0;
    };
    if (playerY + playerHeight >= maxY ){
        playerY = maxY  - playerHeight - 1;
        pmovey = 0;
    };
    if (playerY <= minY){
        playerY = minY  + 1;
        pmovey = 0;
    };
}

////////////////// 플레이어 거리
function player_didtance(){

    //게임방향타겟(배경 중심점)으로부터의 거리
    Pdistance = Math.sqrt(Math.pow(Math.abs(parseInt(((theCanvas.clientWidth / 2  + cityEnd_x) - playerX))),2) + Math.pow(Math.abs(parseInt(theCanvas.clientHeight / 4 - playerY)),2));

}

////////////////// 적 거리
function enemy_didtance(){

    //게임방향타겟(배경 중심점)으로부터의 거리
    this.Edistance = Math.sqrt(Math.pow(Math.abs(parseInt(((theCanvas.clientWidth / 2  + cityEnd_x) - this.enemyx))),2) + Math.pow(Math.abs(parseInt(theCanvas.clientHeight / 4 - this.enemyy)),2));

}

////////////////// 플레이어 이동
function player_move(){

    //방향이동(키이벤트보다는 프레임에 설정하는게 더 부드러움.)
    //좌
    if (strKeyEventValue == "ArrowLeft"  || isKeyCode == 37){
        //--pmovex;
        wayBefore = 'L';
        pmovex = pmovex - 0.1 * Pspeed / 2;
        playerImage = player_180;

    }

	//우
    if (strKeyEventValue == "ArrowRight"  || isKeyCode == 39){
        //++pmovex;
        wayBefore = 'R';
        pmovex = pmovex + 0.1 * Pspeed / 2;
        playerImage = player_360;
    }

	//상
    if (strKeyEventValue == "ArrowUp"   || isKeyCode == 38){
        wayBefore = 'U';
        pmovey = pmovey - 0.1 * Pspeed / 2;
        playerImage = player_90;
    }

	//하
    if (strKeyEventValue == "ArrowDown"   || isKeyCode == 40){
        wayBefore = 'D';
        pmovey = pmovey + 0.1 * Pspeed / 2;
        playerImage = player_270;
    }

	//대각선방향 => 상하좌우키 동시 누른것과 같음.
	//좌상
	if (isKeyDown[103] || isKeyCode == 36 ) {
        wayBefore = 'LU';
		pmovex = pmovex - 0.1 * Pspeed/2;
        pmovey = pmovey - 0.1 * Pspeed/2;
        playerImage = player_135;
	}

	//우상
	if (isKeyDown[105] || isKeyCode == 33  ) {
        wayBefore = 'RU';
		pmovex = pmovex + 0.1 * Pspeed/2;
        pmovey = pmovey - 0.1 * Pspeed/2;
        playerImage = player_45;
	}

	//좌하
	if (isKeyDown[97] || isKeyCode == 35 ) {
        wayBefore = 'LD';
		pmovex = pmovex - 0.1 * Pspeed/2;
        pmovey = pmovey + 0.1 * Pspeed/2;
        //playerImage = player;
        playerImage = player_135;
	}

	//우하
	if (isKeyDown[99] || isKeyCode == 34 ) {
        wayBefore = 'RD';
		pmovex = pmovex + 0.1 * Pspeed/2;
        pmovey = pmovey + 0.1 * Pspeed/2;
        //playerImage = player;
        playerImage = player_45;
	}

	//와프(공간 이동)
	if (isKeyDown[17] || isKeyCode == 17) {

        warp_sound.currentTime  = 0;
        warp_sound.play();

        //와프 이미지로 변경
        for (var i=0;i<=warp_distance;i++){

            //공간이동 이미지
            Context.drawImage(player_warp,playerX,playerY,playerWidth + Math.floor(Math.random() * 2),playerHeight + Math.floor(Math.random() * 3))

            //warp_sound.play();   //공간이동시 사운드

            if (wayBefore == "U"){
                playerY = playerY - i;
            }if (wayBefore == "D"){
                playerY = playerY + i;
            }else if (wayBefore == "R"){
                playerX = playerX + i;
            }else if(wayBefore == "L"){
                playerX = playerX - i;
            }else if (wayBefore == "LU"){
                playerX = playerX - i;
                playerY = playerY - i;
            }else if (wayBefore == "RU"){
                playerX = playerX + i;
                playerY = playerY - i;
            }else if(wayBefore == "LD"){
                playerX = playerX - i;
                playerY = playerY + i;
            }else if (wayBefore == "RD"){
                playerX = playerX + i;
                playerY = playerY + i;
            }else {
                //playerY = playerY - i /2;
                playerX = playerX;
                playerY = playerY;
            }

            //playerY = playerY - i;
        }

        isKeyDown = [];
        isKeyCode = null;
        //wayBefore = null;
        //pmovex = 0;
        //pmovey = 0;

	}

    //레이저
	if (isKeyDown[32] || isKeyCode == 32 ) {

        //게임상태가 진행중이 않은(종료 또틑 멈춤) 경우 레이저버튼 클릭시 재시작
		if (status != 2)
		{
            gameStart(13); 
		}

        //레이져 변수 초기화
        laser_init();
        laser_yn = 'Y';
        laser_move();
		laser_sound.currentTime  = 0;
        laser_sound.play();
	}

    //브래이크
    if(isKeyCode == 16 || isKeyCode == 12){
        pmovex = 0;
        pmovey = 0;
        playerImage = player;
    }

    //이동좌표에 따른 플레이어 사이즈 조정
    playerX = playerX + pmovex;
    playerY = playerY + pmovey;

    playerWidth = ini_player_width * player_size/100000*Pdistance*0.8
    playerHeight = ini_player_height * player_size/100000*Pdistance*0.8

    //멀리 가도 플레이어 최소크기는 유지
    if (parseInt(playerWidth) <= parseInt(ini_player_width/3)){
        playerWidth = parseInt(ini_player_width/3);
    }
    if (parseInt(playerHeight) <= parseInt(ini_player_height/3)){
        playerHeight = parseInt(ini_player_height/3);
    }

    Context.drawImage(playerImage,playerX,playerY,playerWidth + Math.floor(Math.random() * 2),playerHeight + Math.floor(Math.random() * 3));

    //엔진 부스터 방향
    //전진,좌상,우상
    if (strKeyEventValue == "ArrowUp" || isKeyCode == 38 || isKeyDown[103] || isKeyCode == 36 || isKeyDown[105] || isKeyCode == 33){
        engin01_sound.currentTime  = 2;
        engin01_sound.play();   //엔진 점화 사운드
        Context.drawImage(enginImage,playerX + playerWidth/2,playerY + playerHeight/30,playerWidth/5 + Math.floor(Math.random() * 3),playerHeight/4 + Math.floor(Math.random() * 4));
        Context.drawImage(enginImage,playerX + playerWidth/3,playerY + playerHeight/30,playerWidth/5 + Math.floor(Math.random() * 3),playerHeight/4 + Math.floor(Math.random() * 4));
        Context.drawImage(enginImage,playerX + playerWidth/2,playerY + playerHeight/15,playerWidth/5 + Math.floor(Math.random() * 5),playerHeight/4 + Math.floor(Math.random() * 3));
        Context.drawImage(enginImage,playerX + playerWidth/3,playerY + playerHeight/15,playerWidth/5 + Math.floor(Math.random() * 6),playerHeight/4 + Math.floor(Math.random() * 5));
    }
    //좌
    if (strKeyEventValue == "ArrowLeft"  || isKeyCode == 37){
        //engin01_sound.currentTime  = 1;
        //engin01_sound.play();
        Context.drawImage(enginImage,playerX  + playerWidth/9,playerY + playerHeight/8,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(enginImage,playerX + playerWidth/5,playerY + playerHeight/10,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));
        Context.drawImage(enginImage,playerX  + playerWidth/8,playerY + playerHeight/6,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(enginImage,playerX + playerWidth/4,playerY + playerHeight/6,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));
    }
	//우
    if (strKeyEventValue == "ArrowRight"  || isKeyCode == 39){
        //engin01_sound.currentTime  = 1;
        //engin01_sound.play();
        Context.drawImage(enginImage,playerX  + playerWidth/1.9,playerY + playerHeight/8,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(enginImage,playerX + playerWidth/4,playerY + playerHeight/10,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));
        Context.drawImage(enginImage,playerX  + playerWidth/2,playerY + playerHeight/6,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(enginImage,playerX + playerWidth/4,playerY + playerHeight/6,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));

    }
	// //하
    // if (strKeyEventValue == "ArrowDown"   || isKeyCode == 40){
    //     //engin01_sound.currentTime  = 1;
    //     engin01_sound.play();
    // }
    //플레이어 에너지 표시
    //enemy_energe(player_life);
    player_energe();
    Context.fillText(penerge_bar,playerX,playerY - 10);

}

////////////////// 플레이어 레이져 초기화
function laser_init(){
    laserX = playerX + playerWidth/2;
    laserY = playerY;
    //레이져 초기 이동위치 = 생성위치
    lmovex = laserX;
    lmovey = laserY - 5;
    //레이져 초기 크기
    l_size = 1;
    //레이져 초기 속도
    lspeed = 1;
    //레이져 발사 여부
    laser_yn = 'N';
}

////////////////// 플레이어 레이져 경로
function laser_move(){

    if (laser_yn == 'Y'){

        //ld = Math.floor(Pdistance/10);

        for (i=0;i<=150;i++){

            //플레이어 거리에 따른 레이져 크기 변경
            l_size = 1;
            l_size = l_size*(Pdistance/300);

            /*
            //플레이어 위치에 따른 미사일 방향 변경
            //타켓이 플레이어보다 상단에 있으면 미사일은 상단으로
            if (playerY >= ty + th/2 + theCanvas.clientHeight / 20){
                //l_size = 30;

                //playerImage.src = "player.png";
                playerImage = player;
                //lmovey = lmovey - 1;

            //타켓이 플레이어보다 하단에 있으면 미사일은 상단으로
            }
            if (playerY < ty - th/2 - theCanvas.clientHeight / 15){
                //playerImage.src = "player_180.png";
                playerImage = player_180;
                //l_size = 30;
                //lmovey = lmovey + 1;

            //타켓이 플레이어 우측
            }
            if(playerX >= tx  + tw/2  + theCanvas.clientWidth / 3)
            {
                //playerImage.src = "player_90.png";
                playerImage = player_90;
                //l_size = 5;
                //lmovex = lmovex - 1.5;
            //타켓이 플레이어 좌측
            }
            if (playerX < tx - tw/2 - theCanvas.clientWidth / 3){
                //l_size = 5;


                //playerImage.src = "player_360.png";
                playerImage = player_360;
                //lmovex = lmovex + 1.5;
            }
			*/

            //레이저 버튼 각도에 따라 방향 전환
            //lmovex = lmovex + 1; //(코사인 * 루트(x제곱 + y제곱)
            //lmovey = lmovey + 1; //(사인 * 루트(x제곱 + y제곱)
            //lmovex = 100;
            //lmovey = 100;

            //레이저 버튼 누른 각도의 위치를 라디안값으로 변환한다.
            lmovex = lmovex + Math.cos(laser_d * Math.PI / 180); //(코사인 * 루트(x제곱 + y제곱)
            lmovey = lmovey + Math.sin(laser_d * Math.PI / 180) * - 1; //(사인 * 루트(x제곱 + y제곱)

            Context.drawImage(laserImage,lmovex,lmovey,2,l_size);
        }
    }
}

////////////////// 적 객체 생성
////////////////// 적 1th
function create_enemy(index){

    //this.enemy_index = index;
    //적의 인덱스가 없는경우 전체 새로 생성.
    if (index == null || index == ""  || index == undefined){
        //alert("1")
        for (var i=0;i<=enemy_cnt;i++){

            enemy_array[i] = new enemy_init(i);
            //enemy.enemy_index = i;
            enemy_array[i].weappon_create();
            enemy_array[i].weappon_init();
        }
    //인덱스가 기존에 있는거나 추가된경우 해당 인덱스건에 대하여만 새로 생성.
    }else {

        enemy_array[index] = new enemy_init(index);
        //enemy.enemy_index = i;
        enemy_array[index].weappon_create();
        enemy_array[index].weappon_init();

    }

 }

////////////////// 적 초기화
function enemy_init(index){

    //객체내에서 사용되는 모든 참조객체(변수,이미지,배열,함수등을 모두 생성자 함수에 넣어준다.)
    //참조 개체내에서의 this.propoerty는 해당 생성자함수(클래스)의 현재실행객체의 property를 가리킨다.
    //참조 객체체 외에서의 propoerty는 생성자(클래스)명.property 식으로 가져온다.
    this.enemy_array = enemy_array;
    this.create_enemy = create_enemy;
    //this.create_enemy = create_enemy;
    //this.create_enemy03 = create_enemy03;

    //this.enemy02Image = new Image();
    //this.enemy02Image.src = enemy02Image.src;

    //적 고유 index
    this.enemy_index = index;

    //적 고유 index에 따른 적 타입 변경
    if ((this.enemy_index + 1) <= 2){
        this.enemy_type = 1;

    }else {

        if (this.enemy_index % 2 == 0){
            this.enemy_type = 2;
        }else {
            this.enemy_type = 1;
        }
    }

    //적 타입에 따른 특성(모양,속도,무기등 변경)
    if (this.enemy_type == 1){
        //적 이미지
        this.enemyImage = enemy01Image;
        this.enemyImage.src = enemy01Image.src;

        //적 무기 이미지
        this.enemyGunImage = enemy01GunImage;
        this.enemyGunImage.src = enemy01GunImage.src

        //적 엔진 이미지
        this.enginImage = engin01Image;
        this.enginImage.src = enginImage.src;

        //적 미시일 이미지 및 로드
        this.weapponImage = weappon01Image;
        this.weapponImage.src = weappon01Image.src;

        //적 초기 크기
        this.enemyw = ini_enemyw + Math.floor(Math.random() * 3);
        this.enemyh = ini_enemyh + Math.floor(Math.random() * 4);

        //적 미사일 크기
        this.weappon_size = weappon_size;

        //적 미사일 속도
        this.weappon_speed = weappon_speed;

        //적 동시  발사수는 랜덤하게
        this.weappon_cnt = Math.floor(Math.random() * 4) + 4;
        this.max_weappon_cnt = 8;


    }else {

        //적 이미지
        this.enemyImage = enemy02Image;
        this.enemyImage.src = enemy02Image.src;

        //적 무기 이미지
        this.enemyGunImage = enemy02GunImage;
        this.enemyGunImage.src = enemy02GunImage.src

        //적 엔진 이미지
        this.enginImage = engin02Image;
        this.enginImage.src = enginImage.src;

        //적 미시일 이미지 및 로드
        this.weapponImage = weappon02Image;
        this.weapponImage.src = weappon02Image.src;

        //적 초기 크기
        this.enemyw = ini_enemyw + Math.floor(Math.random() * 3);
        this.enemyh = ini_enemyh + Math.floor(Math.random() * 4);

        //적 미사일 크기
        this.weappon_size = weappon_size;

        //적 미사일 속도
        this.weappon_speed = weappon_speed;

        //적 동시 미사일 발사수는 랜덤하게
        this.weappon_cnt = Math.floor(Math.random() * 4) + 2;
        this.max_weappon_cnt = 6;

    }


    //무(없음)이미지
    //this.noneImage = new Image();
    this.noneImage = noneImage;
    this.noneImage.src = noneImage.src;

    //폭파이미지01
    //this.explosionImage01 = new Image();
    this.explosionImage01 = explosionImage01;
    this.explosionImage01.src = explosionImage01.src;

    //적 미사일 이동 간격
    this.weappon_upDown = weappon_upDown;
    this.weappon_leftRight = weappon_leftRight;
    this.weappon_tmp_random = weappon_tmp_random;


    //적 레이져 폭파중 여부
    this.enemy_collision_yn = 'N';

    //적 출현 지연시간
    this.enemy_dealy_time = enemy_dealy_time;

    //적 초기 위치
    //this.enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + (Math.floor(Math.random() * 10))  + (Math.floor(Math.random() * 30)) - (Math.floor(Math.random() * 300)); //시작  x
    //this.enemyy = parseInt(theCanvas.clientHeight / 4) + (Math.floor(Math.random() * 100)) - (Math.floor(Math.random() * 100)); //시작 y
    this.enemyx = ini_enemyx  + (Math.floor(Math.random() * 100)) - (Math.floor(Math.random() * 100));
    this.enemyy = ini_enemyy  + (Math.floor(Math.random() * 100)) - (Math.floor(Math.random() * 100));


    //ld = 0;

    //적 크기(배율)
    this.enemy_size =  Math.floor(Math.random() * 3);
    //적 스피드
    this.enemy_speed =  Math.floor(Math.random() * 2);
    //적 x축 이동 위치
    this.enemyxx = Math.floor(Math.random() * 2);
    //적 x축 이동 위치
    this.enemyyy = Math.floor(Math.random() * 2);

    //적 생명
    this.enemy_life = ini_enemy_life;
    this.energe_bar = ini_energe_bar;
    this.enemy_energe = enemy_energe;
    this.enemy_move = enemy_move;

    //타겟에서 적까지 거리
    this.Edistance = Edistance;

    //적 미사일 발사 시작 위치
    this.weapponX = this.enemyx;
    this.weapponY = this.enemyy;

    this.weapponArray = weapponArray;
    //this.weapponArray  = [];

    //적 미사일 객체(배열) 생성
    this.weappon_create = weappon_create;
    //this.weappon_create();


    //적 미사일 난수
    this.weappon_Randon = weappon_Randon;

    //적 미사일 객체(배열) 초기화
    this.weappon_init = weappon_init;
    //this.weappon_init();

    this.weappon_move = weappon_move;
    this.weappon_index = weappon_index;
    //weappon_move();

    //적 충돌
    this.enemy_collision = enemy_collision;

    //플레이어 레이져
    this.laser_move = laser_move;

    //플레이어 충돌
    this.player_collision = player_collision;

    //배경종점에서 적까지 거리
    this.enemy_didtance = enemy_didtance;

}

////////////////// 적 폭파(레이져 충돌)
function enemy_collision(){

    //적 위치
    //this.enemyx = this.weapponX;
    //this.enemyy = this.weapponY;

    //적 크기
    this.enemyw = ini_enemyw;
    this.enemyh = ini_enemyh;

    //레이져 크기
    l_size = 1;
    l_size = 100;  //사이즈가 1이면 적이 잘 않맞는다.

    //적 레이져 폭파중 여부
    if (this.enemy_collision_yn == 'Y') return;                  //적이 폭파되고 새로출현할깨까지 않보이는경우 수행하지 않는다.

    //레이져와 적 X좌표 충돌시
    if (parseInt(lmovex) <= (parseInt(this.enemyx) + parseInt(this.enemyw)) && ((parseInt(lmovex) + parseInt(l_size)) >= parseInt(this.enemyx))){

        //레이져와 적 Y좌표 충돌시
        if ((parseInt(lmovey) <= (parseInt(this.enemyy)  + parseInt(this.enemyh)) ) && ((parseInt(lmovey)  + parseInt(l_size)) >= parseInt(this.enemyy)   )){

             //충돌시 carsh 효과 이미지로
             Context.drawImage(this.explosionImage01,this.enemyx-Math.floor(Math.random()*20),this.enemyy+Math.floor(Math.random()*20),20,10);
             Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*20),this.enemyy+Math.floor(Math.random()*10),10,10);
             Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*20),this.enemyy-Math.floor(Math.random()*30),20,10);

             //적 총알 충돌 사운드는 좀 짧게
             crash01_sound.currentTime = 0;
             crash01_sound.play();

             laser_init();

             //적 파괴되면 새로운 타겟 등장
             if (this.enemy_life == 1){

                //타겟 새로 생성
                //enemy_init();
                explosion_sound.play();
                explosion_sound.currentTime  = 0;
                //this.weapponArray = [];     //적 폭파되도 발생된 총알은 사라지지 않도록 한다.
                this.energe_bar = '';

                //콜로니 밖 우주 배경그려주기(투명도 적용)
                Context.save();

                Context.globalAlpha = 0.8;

                Context.drawImage(backgroundImage,0, 0 ,theCanvas.clientWidth + Math.floor(Math.random() * 3) ,theCanvas.clientHeight);
                //적이 강할수록 i를 높게한다.(i = 점수)
                for (var i=0;i<=ini_enemy_life*10*(this.enemyh/20);i++){

                    Context.drawImage(this.explosionImage01,this.enemyx-Math.floor(Math.random()*30),this.enemyy+Math.floor(Math.random()*40),100 - i,100 - i);
                    Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*60),this.enemyy+Math.floor(Math.random()*50),20 - i,20 - i);
                    Context.drawImage(this.explosionImage01,this.enemyx-Math.floor(Math.random()*30),this.enemyy+Math.floor(Math.random()*40),100 - i,100 - i);
                    Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*60),this.enemyy+Math.floor(Math.random()*50),20 + i,20 + i);

                    //Context.fillText("Score : " + gameTime,theCanvas.clientWidth - 250,50);

                }

                //적의 생명 * 10 만큼 보너스 스코어
                Context.font = '100px Arial';
                Context.fillText( " + " + ini_enemy_life * 10,this.enemyx,this.enemyy-10);
                //alert(this.enemyx + "," +  this.enemyy)            
                gameScore = parseInt(gameScore) + ini_enemy_life*10;

                //타겟 새로 출현 시간.
                this.enemy_dealy_time = parseInt((Math.floor(Math.random()*3) + 2)) * 1000;

                Context.restore();

                //폭파되면 새로 출현할때까지 이미지 않보이게
                this.enemyImage = this.noneImage;
                this.enemyGunImage = this.noneImage;
                this.enginImage = this.noneImage;

                //적 레이져 폭파중 여부
                this.enemy_collision_yn = 'Y';

                //폭파후 적 출현
                setTimeout(this.create_enemy,this.enemy_dealy_time,this.enemy_index);   //넘겨줄 인수는 지연시간 뒤에다가 넘겨준다.

             }

             //적 에너지 차감
             this.enemy_life = this.enemy_life - 1;

             //적 에너지를 다시 그려준다.
             this.enemy_energe();

        }
    }

}

////////////////// 플레이어 에너지 표시
function player_energe(){

    Context.font = '10px Arial';

    penerge_bar = '';

    for(var i = 1;i<=player_life;i++){
        penerge_bar += '■';
    }

    return penerge_bar;
}

////////////////// 적 에너지 표시
function enemy_energe(){

    Context.font = '10px Arial';

    this.energe_bar = '';

    for (var i=1;i<=this.enemy_life;i++){
        this.energe_bar += '■';
    }

    return this.energe_bar;
}

////////////////// 적 이동 
function enemy_move(){
//alert(String(gameTime*100).substr(0,2));
//alert(parseInt(String(gameTime*100).substr(0,2)) % 5)

//console.log(String(gameTime).substr(String(gameTime).length-3,1)) 

    //적(enemy) 왔다같다 이동
    if (String(gameTime).substr(String(gameTime).length-3,1) == 1){
        this.enemyx = this.enemyx + this.enemyxx - 1;
        this.enemyy = this.enemyy + this.enemyyy;
    }else if (String(gameTime).substr(String(gameTime).length-3,1) == 2){
        this.enemyx = this.enemyx - this.enemyxx * this.enemy_speed;
        this.enemyy = this.enemyy - this.enemyyy * this.enemy_speed;
    }else if (String(gameTime).substr(String(gameTime).length-3,1) == 3){
        this.enemyx = this.enemyx + this.enemyxx;
        this.enemyy = this.enemyy + this.enemyyy * this.enemy_speed;
    }else if (String(gameTime).substr(String(gameTime).length-3,1) == 4){
        this.enemyx = this.enemyx - this.enemyxx * this.enemy_speed;
        this.enemyy = this.enemyy - this.enemyyy;
    }else if (String(gameTime).substr(String(gameTime).length-3,1) == 5){
        this.enemyx = this.enemyx + this.enemyxx * (Math.floor(Math.random() * 1)==0?1:-1);   ;
        this.enemyy = this.enemyy - this.enemyyy * (Math.floor(Math.random() * 1)==0?1:-1);
    }else if (String(gameTime).substr(String(gameTime).length-3,1) == 6){
        this.enemyx = this.enemyx - this.enemyxx;
        this.enemyy = this.enemyy + this.enemyyy;
    }else if (String(gameTime).substr(String(gameTime).length-3,1) == 7){
        this.enemyx = this.enemyx - this.enemyxx * this.enemy_speed;
        this.enemyy = this.enemyy - this.enemyyy * this.enemy_speed;
    }else if (String(gameTime).substr(String(gameTime).length-3,1) == 8){
        this.enemyx = this.enemyx - this.enemyxx * this.enemy_speed;
        this.enemyy = this.enemyy + this.enemyyy * this.enemy_speed;
    }else if (String(gameTime).substr(String(gameTime).length-3,1) == 9){
        this.enemyx = this.enemyx - this.enemyxx * this.enemy_speed;
        this.enemyy = this.enemyy + this.enemyyy;
    }else {
        this.enemyx = this.enemyx + this.enemyxx + 1;
        this.enemyy = this.enemyy + this.enemyyy - 1;
    }

    this.enemy_didtance();

    this.Edistance = parseInt(this.Edistance)/100;
    //console.log("this.Edistance",this.Edistance);

    //적 다가옴에 따라 크기도 커진다.(원근효과)
    //this.enemy_size = this.enemy_size * this.Edistance * 0.8;
    this.enemy_size = this.enemy_size * this.Edistance;
    //배경종점(목적지) 이동좌표에 따른 적 사이즈 조정
    this.enemyw = this.enemyw * this.enemy_size;
    this.enemyh = this.enemyh * this.enemy_size;

    //console.log(this.enemyw,this.enemyh)

    //적 크기 배율은 1 ~ 3를 넘지 못한다.
    //if (this.enemy_size >= 3){this.enemy_size = 3};
    if (this.enemy_size <= 1){this.enemy_size = 1};

    //적이 게임 경게 밖으로 나가지 못하다록 한다.
    if (this.enemyx > maxX - 30){
        this.enemyxx = 0;
        this.enemyx = this.enemyx - Math.floor(Math.random() * 2);
    }

    if (this.enemyx < minX + 30){
        this.enemyxx = 0;
        this.enemyx = this.enemyx + Math.floor(Math.random() * 2);
    }

    if (this.enemyy > maxY - 30){
        this.enemyyy = 0;
        this.enemyy = this.enemyy - Math.floor(Math.random() * 2);
    }

    if (this.enemyy < minY + 30){
        this.enemyyy = 0;
        this.enemyy = this.enemyy + Math.floor(Math.random() * 2);
    }


    //적(enemy)) 이미지
    //적 미사일 초기 위치
    this.weapponX = this.enemyx;
    this.weapponY = this.enemyy;

    // //적의 크기는 플레이어의 크기보다 커질수는 없다.
    // if (this.enemyw >= playerWidth * 0.6){
    //     this.enemyw = playerWidth  * 0.6;
    //     this.enemyh = playerHeight  * 0.6;
    // };

    //적의 크기는 적의 초기 크기 * 0.8 보다 커질수는 없다.
    if (this.enemyw > ini_enemyw * 1){
        this.enemyw =  ini_enemyw * 1;
        //this.enemy_size = this.enemy_size - 1;
        //this.enemy_size = this.enemy_size - (this.Edistance * 0.5);
    };

    if (this.enemyh > ini_enemyh * 1){
        this.enemyh =  ini_enemyh * 1;
        //this.enemy_size = this.enemy_size - 1;
        //this.enemy_size = this.enemy_size - (this.Edistance * 0.5);
    };


    //적이 너무 작은경우(멀리있는경우) 오른쪽 엔진은 그려주지 않는다.(엔지하나가 몸체박으로 삐져나와 이상함.)
    if ( this.enemyw >= ini_enemyw*0.8){
        Context.drawImage(this.enginImage,this.enemyx - this.enemyw/4 + Math.floor(Math.random() * 6),this.enemyy + this.enemyh/8,Math.floor(Math.random() * 3) +  this.enemyw/3,Math.floor(Math.random() * 4) +  this.enemyh/3);
    }
    if ( this.enemyw >= ini_enemyw*0.5){
        Context.drawImage(this.enginImage,this.enemyx - 10 - this.enemyw/4 - Math.floor(Math.random() * 8),this.enemyy + this.enemyh/8,Math.floor(Math.random() * 4) +  this.enemyw/3,Math.floor(Math.random() * 4) +  this.enemyh/3);
    }
    Context.drawImage(this.enemyImage,this.enemyx - 40, this.enemyy ,this.enemyw,this.enemyh);
    //적이 너무 작은경우(멀리있는경우) 총은 그려주지 않는다.(총이 몸체박으로 삐져나와 이상함.)
    if ( this.enemyw >= ini_enemyw*0.5){
        Context.drawImage(this.enemyGunImage,this.enemyx + this.enemyw/30, this.enemyy + this.enemyh/10 ,Math.floor(Math.random() * 5) + this.enemyw/40,Math.floor(Math.random() * 5 + this.enemyw/40));
        Context.drawImage(this.enemyGunImage,this.enemyx + this.enemyw/37 - 2, this.enemyy + this.enemyh/10 ,Math.floor(Math.random() * 5) + this.enemyw/30,Math.floor(Math.random() * 5 + this.enemyw/30));
        Context.drawImage(this.enemyGunImage,this.enemyx + this.enemyw/40 - 5, this.enemyy + this.enemyh/10 ,Math.floor(Math.random() * 5) + this.enemyw/30,Math.floor(Math.random() * 5 + this.enemyw/30));
        Context.drawImage(this.enemyGunImage,this.enemyx + this.enemyw/42 - 7, this.enemyy + this.enemyh/10 ,Math.floor(Math.random() * 5) + this.enemyw/30,Math.floor(Math.random() * 5 + this.enemyw/30));
        Context.drawImage(this.enemyGunImage,this.enemyx + this.enemyw/42 - 10, this.enemyy + this.enemyh/10 ,Math.floor(Math.random() * 5) + this.enemyw/30,Math.floor(Math.random() * 5 + this.enemyw/30));
    }

    //적 에너지 표시
    this.enemy_energe();

    //Context.fillText(this.enemy_index + this.energe_bar,this.enemyx  - 40 + Math.floor(Math.random() * 3), this.enemyy - 10);
    Context.fillText(this.energe_bar,this.enemyx  - 40 + Math.floor(Math.random() * 3), this.enemyy - 10);

    //적 충돌 함수 => 충돌함수는 drawScreen()이 아닌 enemy_move 안에서 호출한다.(this가 계속 따라가도록)
    this.enemy_collision();

}



////////////////// 전함01 이동
function ship01_move(){


    if (gameTime >= 500000){
        alert("광선발사")
        return;        
    }
        //전함01 이동
        if (ini_ship01x > 0){
         
            ship01x = ship01x - 0.1;
            //ship01x = ship01x/10;
            
            Context.drawImage(ship01_Image,ship01x - 10,ship01y,60,20)
            Context.drawImage(ship01_Image,ship01x,ship01y + 50,30,10)
            Context.drawImage(ship01_Image,ship01x + 20,ship01y + 20,65,15)
            Context.drawImage(ship01_Image,ship01x + 10,ship01y + 30,15,5)
            Context.drawImage(ship01_Image,ship01x + 30,ship01y + 35,24,8)
    
        }    
}
////////////////// 게임 배경 화면
function game_background(){

    //시간이 흐름에 따라 게임 타겟 방향 좌표 이동
    gameTime++;         //시간 증가
    gameScore++;
    back_distance = back_distance + Pspeed*5;    //백그라운드 라인이 밖으로 나가면 다시 초기화(플레이어 속도만큼 더 빨리 진행)

	//back_distance = back_distance + 0.1;

    if (back_distance >= 800){
        back_distance = 0;
    }

    if (parseInt(gameTime/800 % 9) == 0){
        cityEnd_x = cityEnd_x + 0.2;
        cityEnd_y = cityEnd_y + 0.1;
    }else if (parseInt(gameTime/500 % 9) == 1){
        cityEnd_x = cityEnd_x - 0.5;
        cityEnd_y = cityEnd_y - 0.2;
    }else if (parseInt(gameTime/500 % 9) == 2){
        cityEnd_x = cityEnd_x + 0.5;
        cityEnd_y = cityEnd_y + 0.3;
    }else if (parseInt(gameTime/500 % 9) == 3){
        cityEnd_x = cityEnd_x + 0.1
        cityEnd_y = cityEnd_y - 0.2
    }else if (parseInt(gameTime/500 % 9) == 4){
        cityEnd_x = cityEnd_x - 0.6;
        cityEnd_y = cityEnd_y - 0.4;
    }else if (parseInt(gameTime/500 % 9) == 5){
        cityEnd_x = cityEnd_x + 0.7;
        cityEnd_y = cityEnd_y + 0.4;
    }else if (parseInt(gameTime/500 % 9) == 6){
        cityEnd_x = cityEnd_x - 0.4;
        cityEnd_y = cityEnd_y - 0.2;
    }else if (parseInt(gameTime/500 % 9) == 7){
        cityEnd_x = cityEnd_x + 0.3;
        cityEnd_y = cityEnd_y + 0.3;
    }else if (parseInt(gameTime/500 % 9) == 8){
        cityEnd_x = cityEnd_x - 0.2;
        cityEnd_y = cityEnd_y - 0.1;
    }else {
        cityEnd_x = cityEnd_x + 0.1
        cityEnd_y = cityEnd_y + 0.2
    }

    //Context.globalAlpha = 0.5;

    //콜로니 밖 우주 배경그려주기(투명도 적용)
    Context.save();

    if (parseInt(gameTime/(1000*Pspeed)) % 3 == 0){
        Context.globalAlpha = 0.4;
    }else if (parseInt(gameTime/(1000*Pspeed)) % 3 == 1){
        Context.globalAlpha = 0.3;
    }else {
        Context.globalAlpha = 0.2;
    }

    Context.drawImage(backgroundImage,0, 0 ,theCanvas.clientWidth + Math.floor(Math.random() * 3) ,theCanvas.clientHeight);

    //콜로니끝 
    //콜로니 끝 근처는 어둡다.
    Context3.beginPath();
    Context3.arc(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 50 ,theCanvas.clientHeight / 4 + cityEnd_y +  Math.floor(Math.random() * 3) ,100 +  Math.floor(Math.random() * 5) ,0,2*Math.PI); 
 
    if (Math.floor(Math.random() * 2) == 2){
        Context3.stroke();        //원 테두리
        //Context3.fillStyle = 'gray';
    }else{
        Context3.fillStyle = 'black';
    }

    Context3.fillStyle = 'black';
    Context3.fill(); 


    //콜로니끝2 
    //콜로니 끝 근처는 어둡다.
    Context3.beginPath();
    Context3.arc(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 50 ,theCanvas.clientHeight / 4 + cityEnd_y +  Math.floor(Math.random() * 3) ,200 +  Math.floor(Math.random() * 5) ,0,2*Math.PI); 
 
    if (Math.floor(Math.random() * 2) == 2){
        Context3.stroke();        //원 테두리
        //Context3.fillStyle = 'gray';
    }else{
        Context3.fillStyle = 'black';
    }
    
    Context3.fillStyle = 'black';
    Context3.fill();


    //콜로니끝3 
    //콜로니 끝 근처는 어둡다.
    Context3.beginPath();
    Context3.arc(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 50 ,theCanvas.clientHeight / 4 + cityEnd_y +  Math.floor(Math.random() * 3) ,500 +  Math.floor(Math.random() * 5) ,0,2*Math.PI); 
 
    if (Math.floor(Math.random() * 2) == 2){
        Context3.stroke();        //원 테두리
        //Context3.fillStyle = 'gray';
    }else{
        Context3.fillStyle = 'black';
    }
    
    //Context3.fillStyle = 'black';
    Context3.fill(); 
    
    //Context3.drawImage(cityEndImage,theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x , theCanvas.clientHeight / 4 + cityEnd_y - 50 +  Math.floor(Math.random() * 3) ,  90 ,60 );
    //Context3.drawImage(cityEndImage,theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 20 , theCanvas.clientHeight / 4 + cityEnd_y - 40 +  Math.floor(Math.random() * 3) ,  60 ,40 );
    Context3.drawImage(cityEndImage,theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 35 , theCanvas.clientHeight / 4 + cityEnd_y - 10 +  Math.floor(Math.random() * 3) ,  25 ,30 );

    Context.restore();

    //게임 배경 (벽)그려주기   =? 원근 효과
    //=> 게임방향목표좌표(전체화면넓이/2 + cityEnd_x, 전체화면 Y 높이/4)에서부터 시작하여 각 모서리 양끝으로 선을그려준다.(원근표현)
    Context3.globalAlpha = 0.1 * Math.floor(Math.random() * 4)

    //for (var i=1;i<=5;i++){

    //중앙상단선
    for (var i=0;i<=10;i++){ 

        Context3.beginPath();
        //Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x +  Math.floor(Math.random() * 5) , theCanvas.clientHeight / 4 - 100);
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 , theCanvas.clientHeight / 4 - 50 + cityEnd_y);
        Context3.lineTo(theCanvas.clientWidth / 2  +  Math.floor(Math.random() * 10) + cityEnd_x, 0);
        Context3.strokeStyle = "grey";; //선 색상
        Context3.lineWidth = 2;
        Context3.stroke();
        //}   

        //중앙상단에서 좌측 상단선 까지
        Context3.beginPath();
        //Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x +  Math.floor(Math.random() * 5) , theCanvas.clientHeight / 4 - 100);
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 ,  theCanvas.clientHeight / 4 - 50 + cityEnd_y - i * 100);
        Context3.lineTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 20 - i * 100 , theCanvas.clientHeight / 4 - 50 - i*10 + cityEnd_y);
        Context3.strokeStyle = "grey";; //선 색상
        Context3.lineWidth = 2;
        Context3.stroke();

        //중앙상단에서 우측 상단선 까지
        Context3.beginPath();
        //Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x +  Math.floor(Math.random() * 5) , theCanvas.clientHeight / 4 - 100);
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 ,  theCanvas.clientHeight / 4 - 50 + cityEnd_y - i * 100);
        Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x + i - 20  + i * 100, theCanvas.clientHeight / 4 - 50 - i*10  + cityEnd_y);
        Context3.strokeStyle = "grey";; //선 색상
        Context3.lineWidth = 2;
        Context3.stroke();        

    }


    
    //좌측상단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 , theCanvas.clientHeight / 4 - 80 + cityEnd_y);
    // Context3.lineTo(400, 0);
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    for (var i=0;i<=10;i++){ 
    
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - i + 20 , theCanvas.clientHeight / 4 - 40 + i*2 + cityEnd_y);
        Context3.lineTo(200 - 200 * i, 0);
        Context3.strokeStyle = "grey"; //선 색상
        Context3.lineWidth = 2;
        Context3.stroke();
    }

    // //좌중앙
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 15 , theCanvas.clientHeight / 4 + cityEnd_y);
    // Context3.lineTo(0, theCanvas.clientHeight/6   +  Math.floor(Math.random() * 10));
    // //Context3.strokeStyle = "#f0f0f0";; //선 색상
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    //좌측하단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 , theCanvas.clientHeight / 4 + 50 + cityEnd_y);
    // Context3.lineTo(-300, theCanvas.clientHeight);
    // //Context3.strokeStyle = "#f0f0f0";; //선 색상
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();


    for (var i=0;i<5;i++){
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x , theCanvas.clientHeight / 4 + 50 + cityEnd_y);
        Context3.lineTo(-300 -  i * 40, theCanvas.clientHeight - 40 * i);
        //Context3.strokeStyle = "#f0f0f0";; //선 색상
        Context3.strokeStyle = "grey";; //선 색상
        Context3.lineWidth = 1;
        Context3.stroke();
    }

    //우측상단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x + 30, theCanvas.clientHeight / 4 - 80 + cityEnd_y);
    // Context3.lineTo(theCanvas.clientWidth - 400, 0 );
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    for (var i=0;i<=10;i++){
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x + i - 20, theCanvas.clientHeight / 4 - 40 + i*2 + cityEnd_y);
        Context3.lineTo(theCanvas.clientWidth - 200 + 200 * i, 0);
        Context3.strokeStyle = "grey";; //선 색상
        Context3.lineWidth = 2;
        Context3.stroke();
    }

    // //우중앙
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x + 15, theCanvas.clientHeight / 4 + cityEnd_y);
    // Context3.lineTo(theCanvas.clientWidth,  theCanvas.clientHeight / 4 - 50 +  Math.floor(Math.random() * 10));
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    //우측하단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x  + 30, theCanvas.clientHeight / 4  + 50 + cityEnd_y);   //타겟 시작 좌표
    // Context3.lineTo(theCanvas.clientWidth, theCanvas.clientHeight - 150);  //배경 선(타겟으로부터 화면우측하단끝)
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    for (var i=0;i<5;i++){
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - 10, theCanvas.clientHeight / 4  + 50 + cityEnd_y);   //타겟 시작 좌표
        Context3.lineTo(theCanvas.clientWidth, theCanvas.clientHeight - i * 40 - theCanvas.clientHeight/10);  //배경 선(타겟으로부터 화면우측하단끝)
        Context3.strokeStyle = "grey"; //선 색상
        Context3.lineWidth = 2;
        Context3.stroke();
    }
 

    //루프를 많이 돌리수록 두께가 두꺼워지네
    //for (i=0;i<=100;i++){
		back_distance2 = back_distance2 + Pspeed*100;

		if (back_distance2 >= 1000){
				back_distance2 = 0;
        }

        // if (parseInt(gameTime/2000) % 2 == 0){
        //     Context3.fillStyle = 'darkyellow'; // 채우기 색 지정
        // }else {
        //     Context3.fillStyle = 'skyblue'; // 채우기 색 지정
        // }

        //Context3.globalAlpha = "0.4"
        //Context3.strokeStyle = "balck";

        //메인원1
        for(var i=0;i<=4;i++){
            Context3.beginPath();
            //Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 - 10 , back_distance2, 0, Math.PI * 2);
            Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 5   + cityEnd_y, 70 + back_distance   - cityEnd_size + cityEnd_x, 0, Math.PI * 2);
            Context3.stroke();

            Context3.beginPath();
            //Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 - 10 , back_distance2, 0, Math.PI * 2);
            Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 5 + 1 * i  + cityEnd_y, 55 + 5 * i + back_distance + Math.floor(Math.random() * 2) + 1 - cityEnd_size + cityEnd_x, 0, Math.PI * 2);
            Context3.lineWidth = i;
            //Context3.lineWidth = 2;
            Context3.stroke();


            // //중앙상단에서 좌측하단 기둥
            // Context3.beginPath();        
            // Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 ,  theCanvas.clientHeight / 4 - 50 + cityEnd_y - i * 100);
            // Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + 1 * i  + cityEnd_y, 55 + 5 * i + back_distance + Math.floor(Math.random() * 2) + 1, 0 , theCanvas.clientHeight / 4 - 50 + i*10 + cityEnd_y);
            // Context3.strokeStyle = "grey";; //선 색상
            // Context3.lineWidth = 2;
            // Context3.stroke();  
                    
            //중앙 기둥 시작 마디
            Context3.beginPath();
            Context3.arc(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 + back_distance/10, theCanvas.clientHeight / 4 - 50  - back_distance, i*3, 0,Math.PI * 2);
            Context3.lineWidth = i - 2;
            Context3.stroke();

            //중앙상단에서 좌측하단 기둥 
            Context3.beginPath();            
            Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 + back_distance/10, theCanvas.clientHeight / 4 - 50  - back_distance) ;             
            Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 2*i - back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i);
            Context3.strokeStyle = "grey";; //선 색상
            Context3.lineWidth = i;
            Context3.stroke();

            //좌측 기둥 끝 마디
            Context3.beginPath();
            Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 2*i - back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i, i , 0,Math.PI * 2);
            //Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 40 - back_distance, theCanvas.clientHeight / 4 - 100 + back_distance/2 + cityEnd_y , 20 , 5);
            //Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 40 - back_distance, theCanvas.clientHeight / 4 - 100 + back_distance/2 + cityEnd_y , 5 , 20);
            Context3.lineWidth = 2;
            Context3.stroke();               
            
            //좌측 기둥 끝 마디에서 땅까지
            Context3.beginPath();            
            Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 2*i - back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i);             
            Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 2*i , theCanvas.clientHeight + i  + cityEnd_y + i);
            Context3.strokeStyle = "grey";; //선 색상
            Context3.lineWidth = i/10;
            Context3.stroke();
            

            //중앙상단에서 우측하단 기둥 
            Context3.beginPath();            
            Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 + back_distance/10, theCanvas.clientHeight / 4 - 50  - back_distance) ;             
            Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 + 2*i + back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i);
            Context3.strokeStyle = "grey";; //선 색상
            Context3.lineWidth = 1;
            Context3.stroke();

            //우측 기둥 끝 마디
            Context3.beginPath();
            Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 + 2*i + back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i, i , 0,Math.PI * 2);
            //Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 40 - back_distance, theCanvas.clientHeight / 4 - 100 + back_distance/2 + cityEnd_y , 20 , 5);
            //Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 40 - back_distance, theCanvas.clientHeight / 4 - 100 + back_distance/2 + cityEnd_y , 5 , 20);
            Context3.lineWidth = 2;
            Context3.stroke();   
            
            //좌측 기둥 끝 마디에서 땅까지
            Context3.beginPath();            
            Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 + 2*i + back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i);             
            Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x + cityEnd_size/2 + 2*i , theCanvas.clientHeight + i  + cityEnd_y + i);
            Context3.strokeStyle = "grey";; //선 색상
            Context3.lineWidth = i/10;
            Context3.stroke();            


        }

        //메인원2
        if (String(gameTime).substr(String(gameTime).length-3,1) <= 5){
            Context3.beginPath();
            Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + 5 , 80 +  back_distance2 + cityEnd_y + Math.floor(Math.random() * 2) + 1, 0, Math.PI * 2);
            Context3.lineWidth = i - 2;
            Context3.stroke();
        }

        // Context3.beginPath();
        // Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + Math.floor(Math.random() * 1) + 1 ,85 + back_distance2 + cityEnd_y, 0, Math.PI * 2);
        // Context3.stroke();
    //}

    //코로니 배경 건물
    //for (var i = 0; i < 1; i++){

        //신기하게 아래 주석처리하면 안개 효과가 짙어지네..
        //삼각형(지붕 안개 효과)
        // Context3.beginPath();
        // Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 - 20 + cityEnd_y);
        // Context3.lineTo(360  , 0);
        // Context3.lineTo( theCanvas.clientWidth - 360 , 0); 
         
        if (parseInt(gameTime/1000) % 5 == 0){
            // cityImage = city01Image;
 
             Context3.closePath();
             Context3.fillStyle="#40608E";
             Context3.globalAlpha = 0.1;
             Context3.fill();  
             
         }else if (parseInt(gameTime/1000) % 5 == 1){
             // cityImage = city02Image;
  
              Context3.closePath();
              Context3.fillStyle="#408E8C";
              Context3.globalAlpha = 0.12;
              Context3.fill(); 
                          
         }else if (parseInt(gameTime/1000) % 5 == 2){
            // cityImage = city02Image;
 
             Context3.closePath();
             Context3.fillStyle="#9EA46B";
             Context3.globalAlpha = 0.14;
             Context3.fill(); 
                         
         }else if (parseInt(gameTime/1000) % 5 == 3){
             // cityImage = city02Image;
  
              Context3.closePath();
              Context3.fillStyle="#091413";
              Context3.globalAlpha = 0.16;
              Context3.fill(); 
                          
          }else {
            // cityImage = city02Image;
 
             Context3.closePath();
             Context3.fillStyle="#8E9695";
             Context3.globalAlpha = 0.1;
             Context3.fill(); 
                         
         }
  

        
        //삼각형(지면 안개 효과)
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 , theCanvas.clientHeight / 4 + 20 + cityEnd_y);
        Context3.lineTo(-200 - cityEnd_x, theCanvas.clientHeight - theCanvas.clientHeight/30);
        Context3.lineWidth = 1;
        Context3.lineTo( theCanvas.clientWidth + 200 + cityEnd_x - cityEnd_y, theCanvas.clientHeight - theCanvas.clientHeight/30 + cityEnd_x - cityEnd_y);


        //console.log("t",parseInt(gameTime/200) % 3); 
         
        if (parseInt(gameTime/1000) % 5 == 0){
           // cityImage = city01Image;

            Context3.closePath();
            Context3.fillStyle="#40608E";
            Context3.globalAlpha = 0.3;
            Context3.fill();  
            
        }else if (parseInt(gameTime/1000) % 5 == 1){
            // cityImage = city02Image;
 
             Context3.closePath();
             Context3.fillStyle="#408E8C";
             Context3.globalAlpha = 0.3;
             Context3.fill(); 
                         
        }else if (parseInt(gameTime/1000) % 5 == 2){
           // cityImage = city02Image;

            Context3.closePath();
            Context3.fillStyle="#9EA46B";
            Context3.globalAlpha = 0.4;
            Context3.fill(); 
                        
        }else if (parseInt(gameTime/1000) % 5 == 3){
            // cityImage = city02Image;
 
             Context3.closePath();
             Context3.fillStyle="#091413";
             Context3.globalAlpha = 0.6;
             Context3.fill(); 
                         
         }else {
           // cityImage = city02Image;

            Context3.closePath();
            Context3.fillStyle="#8E9695";
            Context3.globalAlpha = 0.5;
            Context3.fill(); 
                        
        }

        //k = 0; //조명 간격

        for (var j = 0; j < 800; j++){

            var random01 = Math.floor(Math.random() * 2) + 1;
            var random02 = Math.floor(Math.random() * 5) + 1;
            var random03 = Math.floor(Math.random() * 10) + 1;
            var random04 = Math.floor(Math.random() * 15) + 1;
            var random05 = Math.floor(Math.random() * 20) + 1;
            var random06 = Math.floor(Math.random() * 30) + 1;

            //Context3.fillStyle = 'fdf5e6'; // 채우기 색 지정
            //Context3.globalAlpha = 1
            //Context3.strokeStyle = "balck";

            //지면 땅
            //Context3.globalAlpha = 0.2;
            Context3.globalAlpha = 0.4;
            if (parseInt(gameTime/(600-Pspeed*100)) % 3 == 0){
                Context3.drawImage(groundImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,  20 + theCanvas.clientHeight / 5  + j + random05  + cityEnd_y, 1 * random01 + j*4 ,20 * random03)
            }else if(parseInt(gameTime/(600-Pspeed*100)) % 3 == 1){
                Context3.drawImage(riverImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,  20 + theCanvas.clientHeight / 5  + j + random05  + cityEnd_y, 1 * random01 + j*4 ,20 * random03)
            }else {
                Context3.drawImage(city03Image,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,  20 + theCanvas.clientHeight / 5  + j + random05 + cityEnd_y , 1 * random01 + j*4 ,20 * random03)
            }

            Context3.globalAlpha = 0.6;

            //지면 건물
            if (parseInt(gameTime/(800-Pspeed*100)) % 3 == 0){
                Context3.drawImage(cityImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,  20 + theCanvas.clientHeight / 4  + j + random05 + cityEnd_y , 1 * random01 + j*3 - (cityEnd_x/200*j) ,20 * random03)
            }else if(parseInt(gameTime/(800-Pspeed*100)) % 2 == 0){
                Context3.drawImage(cityImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,  20 + theCanvas.clientHeight / 3  + j + random05 + cityEnd_y , 1 * random01 + j*4 - (cityEnd_x/200*j) ,20 * random03)
            }else {
                Context3.drawImage(cityImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.2 - 10,  20 + theCanvas.clientHeight / 3  + j + random01 + cityEnd_y , 1 * random01 + j*3 - (cityEnd_x/200*j) ,20 * random03)
            }

            //지붕 건물 반사
            Context3.globalAlpha = 0.04;
            if (parseInt(gameTime/(600-Pspeed*100)) % 3 == 0){
                Context3.drawImage(groundImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random05  + cityEnd_y, 1 * random01 + j*3 ,20 * random03)
            }else if(parseInt(gameTime/(600-Pspeed*100)) % 3 == 1){
                Context3.drawImage(riverImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random05  + cityEnd_y, 1 * random01 + j*4 ,20 * random03)
            }else {
                Context3.drawImage(city03Image,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random05  + cityEnd_y, 1 * random01 + j*3 ,20 * random03)
            }
                        
            //지붕 땅 반사
            Context3.globalAlpha = 0.06;
            if (parseInt(gameTime/(800-Pspeed*100)) % 3 == 0){
                Context3.drawImage(cityImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random05  + cityEnd_y, 1 * random01 + j*4 ,20 * random03)
            }else if(parseInt(gameTime/(800-Pspeed*100)) % 2 == 0){
                Context3.drawImage(cityImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random05  + cityEnd_y, 1 * random01 + j*4 ,20 * random03)
            }else {
                Context3.drawImage(cityImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.2 - 10,theCanvas.clientHeight / 10  - j - random05  + cityEnd_y, 1 * random01 + j*4 ,20 * random03)
            }
            
            

            // //상단 선 및 좌우 측 벽 조명
            // Context3.fillStyle = 'yellow'; // 채우기 색 지정
            // Context3.globalAlpha = "0.01"
            // Context3.strokeStyle = "balck";

            // Context3.beginPath();
            // Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 - 25  - Math.floor(Math.random() * 5)  + cityEnd_y, 40 - random01, 0, Math.PI * 2);
            // Context3.stroke();

            // Context3.fillStyle = 'black'; // 채우기 색 지정
            // Context3.globalAlpha = "0.03"
            // Context3.strokeStyle = "balck";

			// Context3.beginPath();
			// Context3.globalAlpha = "0.01"
			// Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + 2 - random05 + cityEnd_y , 100 - Math.floor(Math.random() * 5) , 0, Math.PI * 2);
			// Context3.stroke();

            //콜로니 끝 근처 원
			Context3.beginPath();
			Context3.globalAlpha = 0.08 * Math.floor(Math.random() * 3)
            Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 - random05 + cityEnd_y + 20 , 60 - Math.floor(Math.random() * 50) , 0, Math.PI * 2);
            Context3.lineWidth = 1;
			Context3.stroke();

            //k = k + 50;  //조명 간격
            //우측중단선 조명
            //Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x + k , theCanvas.clientHeight / 4 - 30 + cityEnd_y  , 5 + k/100 , 10  + k/20);

            //중앙 통로 끝
            //Context3.fillRect(theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x  - 40  , theCanvas.clientHeight / 4 - 50 + cityEnd_y  , 40 + k/20   , 60  );

            //좌측 중단 조명
            //Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x - k , theCanvas.clientHeight / 4 - 30 , 5 + k/100 + cityEnd_y , 5  + k/20);

            //j의 크기를 줄여주면 속도감이 더 빠르고 늘려주면 느려진다.
            if (parseInt(gameTime/(600-Pspeed*500)) % 3 == 0){
                 j = j + (12*random03);     //건물 상하 조밀도
            }else if (parseInt(gameTime/(600-Pspeed*500)) % 3 == 1){
                j = j + (11*random03);     //건물 상하 조밀도
            }else {
                j = j + (10*random03);     //건물 상하 조밀도
            }
        }
    //} 
    
    //투명도 원상태로
    Context3.fillStyle = '#ffffff';
    Context3.globalAlpha = 0.8;
    Context3.strokeStyle = "ffffff";
}


////////////////// 게임 상태 표시
function game_status(){

    Context2.font = '30px Arial';
    Context2.font = '100px Arial';

    if (status == 1){
        //Context2.fillText("Ready", (theCanvas.clientWidth - ini_player_width) / 2 - theCanvas.offsetLeft - 100, theCanvas.clientHeight / 2 - theCanvas.offsetTop);
        clearInterval(Timer_Id);
        return;
    }else if (status == 3){
        Context2.fillText("Pause", (theCanvas.clientWidth - ini_player_width) / 2 - theCanvas.offsetLeft - 100, theCanvas.clientHeight / 2 - theCanvas.offsetTop);
        clearInterval(Timer_Id);
        return;
    }else if (status == 4){
        Context2.fillText("Game Over", (theCanvas.clientWidth - ini_player_width) / 2 - theCanvas.offsetLeft - 200, theCanvas.clientHeight / 2 - theCanvas.offsetTop);
        clearInterval(Timer_Id);
        return;
    }

}

////////////////// 캔버스 컨트롤(게임 프래임 진행시 호출하여 생성)
function gameControl() {

    //윈도우의 경우 캔버스 컨트롤을 보여주지않는다.
	if (navigator.platform.substr(0,3) == "Win" ){
        return;
    }

    Context.globalAlpha = 0.5;

    //색상값이 white가 아닌경우 테두리랑 투명도, 색상 변경.
    if (ls_CColor == 'red'){
        Context.globalAlpha = 1;
        Context.lineWidth = "2";
        Context.strokeStyle = ls_CColor;
        Context.fillStyle = ls_CColor;
    }

    Context.stroke(directonUp);
    Context.stroke(directonLeft);
    Context.stroke(directonRight);
    Context.stroke(directonDown);
    Context.stroke(directonUpLeft);
    Context.stroke(directonUpRight);
    Context.stroke(directonDownLeft);
    Context.stroke(directonDownRight);
    Context.stroke(directonMiddle);

    Context.stroke(button01);
    Context.stroke(button02);

}

//////////////////마우스 클릭시 이벤트 메핑
GameCanvas.addEventListener('mousedown', function(event) {

    //event.preventDefault();

    //모바일인경우 게임진행시에는 리턴
    //if (status == 2){
        if (navigator.platform.substr(0,3) != "Win" ){
            return;
        }
    //}

    //마우스 왼쪽 버튼 클릭
    if (event.button == 0){
        isKeyCode = 32;

        x = event.clientX;
        y = event.clientY;

        laser_radian(x,y);
    }

    //마우스 오른쪽 버튼 클릭
    if (event.button == 2){
        isKeyCode = 17;
    }

    //플레이어(보너스)가 남아있는경우 자동 재시작
    //게인 진행중이 아닐때 마우스로 화면 클릭시 재시도,종료 버튼 보여줌
    if (first_load_yn == "Y"){    
        gameStart(13); 
    }else { 
        gameRetryExitButton(); 
    }

  });

  GameCanvas.addEventListener('mouseup', function(event) {

    //event.preventDefault();

    //모바일인경우 게임진행시에는 리턴
    //if (status == 2){
        if (navigator.platform.substr(0,3) != "Win" ){
            return;
        }
    //}

    //마우스 왼쪽 버튼 클릭
    if (event.button == 0){
        isKeyCode = null;

        x = event.clientX;
        y = event.clientY;

        laser_radian(x,y);
    }

    //마우스 오른쪽 버튼 클릭
    if (event.button == 2){
        isKeyCode = null;
    }
  });


  GameCanvas.oncontextmenu = function () {
    return false;
  };

 ///////////////// 게임 재시도 or 나가기 버튼 보여주기
 function gameRetryExitButton(){
 
    
    if (status != 2)
    { 

         playerImage = noneImage;
         laserImage = noneImage;
         player_warp =  noneImage;
         Context.drawImage(explosionImage01,playerX-Math.floor(Math.random()*40),playerY+Math.floor(Math.random()*40),35,25);
         Context.drawImage(explosionImage01,playerX-10,playerY - 15,60*(Pdistance/500)*playerHeight/50,30*(Pdistance/500)*playerWidth/10);
         Context.drawImage(explosionImage01,playerX+Math.floor(Math.random()*10),playerY-Math.floor(Math.random()*60),120,115);

         playerImage = explosionImage01;
         player_warp = explosionImage01;

        //alert(player_cnt);
        //제일 처음 페이지 로드시에는 바로 시작
        //if (first_load_yn == "Y" && parseInt(player_cnt) > 0){
        if (first_load_yn == "Y"){

            gameStart(13); 


        }else {

                        
            Context2.font = '50px Arial';
            //gameEnd(27);
            //게임 재시도 or 나가기
            Context2.stroke(button_play);
            Context2.stroke(button_end);
            //Context2.fillRect(ls_width/2 - 250, ls_height/2 - 250 , 250, 150);
            Context2.fillText("Retry",ls_width/2 - 160, ls_height/2 - 140);
            Context2.fillText("Exit",ls_width/2 + 120, ls_height/2 - 140);

            //개발모드일경우만 이어서 플레이 가능
            if (ls_DColor == "green"){
                Context2.fillText("Continue",ls_width/2 - 200 + 120, ls_height/2);
                Context2.stroke(button_continue);                
            }

            isKeyDown = [];
            isKeyCode = null;
 

        } 
    }

    return;
 }
////////////////// 돔(doom)의 이벤트에 매핑(전역 키코드를 변경하여 프래임 진행시 방향 전환)
function clickCanvas(event, as_gb) {

	//if (status != 2)
	//{
		//gameStart(13);
    //}

    //플레이어(보너스)가 남아있는경우 자동 재시작
    //게인 진행중이 아닐때 마우스로 화면 클릭시 재시도,종료 버튼 보여줌
    if (first_load_yn == "Y"){    
        gameStart(13); 
    }else { 
        //alert("touch")
        gameRetryExitButton(); 
    }

	//as_gb 1: mouseClick, 2: onMouseMove
	var x = event.pageX;
	var y = event.pageY;

    //윈도우의 경우 캔버스 컨트롤을 사용하지 않는다.(게임 진행일때만) => 재시도/종료 버튼클릭 가능하기 위해
	if (navigator.platform.substr(0,3) == "Win" && status == 2){
        return;
    }

    //방향 up
	if(Context.isPointInPath(directonUp, x,  y)) {
		//wayBefore = 'U';
		//pmovey = pmovey - 0.1 * Pspeed/5;
		//strKeyEventValue = "ArrowUp";
		isKeyCode = 38;
        strKeyEventValue = "ArrowUp";
        wayBefore = 'U';
		Context.stroke(directonUp);    //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 down
	if(Context.isPointInPath(directonDown, x,  y)) {
		//wayBefore = 'D';
		//pmovey = pmovey + 0.1 * Pspeed/5;
		//strKeyEventValue = "ArrowDown";
		isKeyCode = 40;
        strKeyEventValue = "ArrowDown";
        wayBefore = 'D';
		Context.stroke(directonDown); //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 left
	if(Context.isPointInPath(directonLeft, x,  y)) {
		//wayBefore = 'L';
		//pmovex = pmovex - 0.1 * Pspeed/5;
		//strKeyEventValue = "ArrowLeft";
		isKeyCode = 37;
        strKeyEventValue = "ArrowLeft";
        wayBefore = 'L';
		Context.stroke(directonLeft);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 right
	if(Context.isPointInPath(directonRight, x,  y)) {
		//wayBefore = 'R';
		//pmovex = pmovex + 0.1 * Pspeed/5;
		//strKeyEventValue = "ArrowRight";
		isKeyCode = 39;
        strKeyEventValue = "ArrowRight";
        wayBefore = 'R';
		Context.stroke(directonRight);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 upLeft
	if(Context.isPointInPath(directonUpLeft, x,  y)) {
		isKeyCode = 36;
        wayBefore = 'LU';
		Context.stroke(directonUpLeft);    //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 UpRight
	if(Context.isPointInPath(directonUpRight, x,  y)) {
		isKeyCode = 33;
		strKeyEventValue = "RU";
		Context.stroke(directonUpRight);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
    }

    //방향 downLeft
	if(Context.isPointInPath(directonDownLeft, x,  y)) {
		isKeyCode = 35;
		strKeyEventValue = "LD";
		Context.stroke(directonDownLeft); //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 downRight
	if(Context.isPointInPath(directonDownRight, x,  y)) {
		isKeyCode = 34;
		strKeyEventValue = "RD";
		Context.stroke(directonDownRight);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 중앙 정지
	if(Context.isPointInPath(directonMiddle, x,  y)) {
		isKeyCode = "16";
        strKeyEventValue = "";
        pmovex = 0;
        pmovey = 0;
		Context.stroke(directonMiddle);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
    }


    //레이져 발사
	if(Context.isPointInPath(button01, x,  y)) { 

		Context.stroke(button01);    //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
        //Context.fillText(Math.round(laser_r),maxX - 250, maxY - 180);
		Context.fillText("*",x, y);
		//Context.fillText((maxX - 250 - x) * -1 ,theCanvas.clientWidth - 250,100);
		//Context.fillText(maxY - 180 - y ,theCanvas.clientWidth - 250,150);

        // //레이저 버튼을 클릭한곳의 각도로 발사되도록 한다.
		// laser_r = Math.atan2((maxY - 180 - y),(maxX - 250 - x) * -1);

		// if (laser_r < 0)
		//  laser_r += Math.PI * 2;
		// laser_d = laser_r*180/Math.PI;
		// while (laser_d < 0)
        //  laser_d += 360;

        laser_radian(x,y);

        //alert("현재 좌표는 " + event.offsetX + "/" + event.offsetY)

		//레이져 변수 초기화
		laser_init();
		laser_yn = 'Y';
		laser_move();
		laser_sound.currentTime  = 0;
		laser_sound.play();

	}

    //warp(공간 이동)
	if(as_gb == 1 && Context.isPointInPath(button02, x,  y)) {

		Context.stroke(button02);   //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)

        warp_sound.currentTime  = 0;
        warp_sound.play();

		//isKeyCode = 17;
		//Warp 이미지로 변경
		for (var i=0;i<=warp_distance;i++){

			Context.drawImage(player_warp,playerX,playerY,playerWidth + Math.floor(Math.random() * 2),playerHeight + Math.floor(Math.random() * 3))

			//warp_sound.play();

			if (isKeyCode == 38 || wayBefore == "U"){
				playerY = playerY - i;
			}else if (isKeyCode == 40 || wayBefore == "D"){
				playerY = playerY + i;
			}else if (isKeyCode == 39 || wayBefore == "R"){
				playerX = playerX + i;
			}else if(isKeyCode == 37 || wayBefore == "L"){
				playerX = playerX - i;
            }else if (isKeyCode == 36 || wayBefore == "LU"){
                playerX = playerX - i;
                playerY = playerY - i;
            }else if (isKeyCode == 33 || wayBefore == "RU"){
                playerX = playerX + i;
                playerY = playerY - i;
            }else if(isKeyCode == 35 || wayBefore == "LD"){
                playerX = playerX - i;
                playerY = playerY + i;
            }else if (isKeyCode == 34 || wayBefore == "RD"){
                playerX = playerX + i;
                playerY = playerY + i;
            }else {
				playerX = playerX;
				playerY = playerY;
				wayBefore = "";
			}
            //playerY = playerY - i;
		}

		isKeyDown = [];
        isKeyCode = null;

    }


    if(status != 2){
        //게임 계속
        if(Context.isPointInPath(button_play, x,  y)) {
            isKeyCode = 13;
            //strKeyEventValue = "LD";
            Context.stroke(button_play); //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
            gameEnd(isKeyCode);
            isKeyDown = [];
            isKeyCode = null;
        }

        //게임 종료
        if(Context.isPointInPath(button_end, x,  y)) {
            isKeyCode = 27;
            //strKeyEventValue = "RD";
            Context.stroke(button_end);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
            gameEnd(isKeyCode);
            isKeyDown = [];
            isKeyCode = null;
        }

        //게임 계속
        if(Context.isPointInPath(button_continue, x,  y)) {
            player_cnt = 1;
            gameStart(13);  
        }        
    }

}

////////////////// 플레이어 레이져 각도
function laser_radian(x,y){


        //윈도우에서는 플레이어 기준으로 마우스를 클릭한곳으로 레이져 발사

        if (navigator.platform.substr(0,3) == "Win" ){

            laser_r = Math.atan2((playerY - y),(playerX - x) * -1);

        //레이져 버튼내 중앙 기준 클릭한곳의 각도로 발사되도록 한다.
        }else {
		    laser_r = Math.atan2((maxY - 180 - y),(maxX - 250 - x) * -1);
        }


		if (laser_r < 0)
		 laser_r += Math.PI * 2;
		laser_d = laser_r*180/Math.PI;
		while (laser_d < 0)
         laser_d += 360;

}

////////////////// 적 미사일 생성
function weappon_create(){
    //weapponArray = [];
    //console.log("this.weapponArray.length",this.weapponArray.length);
    if (this.weapponArray.length >= this.max_weappon_cnt){
        this.weapponArray = [];
    }
    //동시 나타나는  미사일수
    this.weapponArray.push({bx:this.weapponX, by:this.weapponY, bmx:this.move_weapponX, bmy:this.move_weapponY, bsize:this.weappon_size, bspeed:this.weappon_speed, bdirection:this.weappon_Randon});

}

////////////////// 적 미사일 변수 초기화(미사일의 시작점 위치 지정)
function weappon_init(){

     //console.log("this.weapponArray[i]",this.weapponArray)
     this.weappon_size = 1; 
     player_collision_yn = 'N';
     //weapponX = weapponX - 40;

    for(var i = 0; i < this.weapponArray.length; i++){

        this.weapponArray[i].bx = this.weapponX;
        this.weapponArray[i].by = this.weapponY;
        this.weapponArray[i].bmx = this.weapponX;
        this.weapponArray[i].bmy = this.weapponY;
        this.weapponArray[i].bsize = this.weappon_size;
        this.weapponArray[i].bspeed  = this.weappon_speed;

        if (Math.floor(Math.random() * 2) == 0){
            this.weapponArray[i].bdirection =   Math.floor(Math.random() * 10) * 1;   //미사일의 방향은 랜덤하게 생성 => 미사일 방향 오른쪽 으로
        }else if (Math.floor(Math.random() * 2) == 1){
            this.weapponArray[i].bdirection =   Math.floor(Math.random() * 10) * -1;   //미사일의 방향은 랜덤하게 생성 => 미사일 방향 왼쪽 으로
        }

    }
}

////////////////// 적 미사일 경로
function weappon_move(){

   //this.weappon_size = this.weappon_size + 0.1;               //미사일 크기
   //this.weappon_size = this.weappon_size + enemy_size/10;                //미사일 크기


    for(var i = 0; i < this.weapponArray.length; i++){

        this.weappon_index = i;

        //console.log(this.enemy_size,enemy_size)
        //미사일 이동 좌표
        if (this.enemy_type == 2){     //적 타입이 2인경우만 유도탄

            //유도 미사일 특징
            //1.크기가 크다.
            //this.weappon_size = this.weappon_size + this.enemy_size/10;
            this.weappon_size = this.weappon_size + 0.2;


            //미사일 화면 이탈시 또는 미사일이 너무 커지면
            if (this.weapponArray[i].bsize >= 150){
                this.weapponArray[i].bsize = 150;
                this.weappon_size = 0.1;
            }
            
            
            //2.좌우로 흔들린다.
            this.weapponArray[i].bmx = this.weapponArray[i].bmx + Math.floor(Math.random()*10) - Math.floor(Math.random()*10);
            this.weapponArray[i].bmy = this.weapponArray[i].bmy + Math.floor(Math.random()*2) - Math.floor(Math.random()*3);
            //3.속도가 느리다.
            this.weappon_speed = 1;

            //4.플레이어 위치에 따른 미사일 방향 변경된다.
            if (playerY >= this.enemyy + this.enemyh/2 + theCanvas.clientHeight / 6){
                this.weappon_upDown = 1;
                //console.log('1')
            }else if (playerY <=  this.enemyy - this.enemyh/2 - theCanvas.clientHeight / 6){
                this.weappon_upDown = -1;
                //console.log('2')
            }else if (playerX <=  this.enemyx + this.enemyw/2 - theCanvas.clientWidth / 3){
                this.weappon_leftRight = -1;
                this.weappon_upDown = this.weappon_tmp_random;
                //console.log('3')
            }else if (playerX >=  this.enemyx - this.enemyw/2 - theCanvas.clientWidth / 3){
                this.weappon_leftRight = 1;
                this.weappon_upDown = this.weappon_tmp_random;
                //console.log('4')
            }
        }else {

            add_borderX = theCanvas.clientWidth;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)
            add_borderY = theCanvas.clientHeight;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)

            //일반총알 특징
            //총알인경우 플레이어 위치와 상관없이 위.아래(y축)으로만 진행한다.
            //this.weappon_size = this.weappon_size + this.enemy_size/20;
            this.weappon_size = this.weappon_size + 0.1;

            //미사일 화면 이탈시 또는 미사일이 너무 커지면
            if (this.weapponArray[i].bsize >= 50){
                this.weapponArray[i].bsize = 50;
                this.weappon_size = 0.1;
            }


            //총알 반은 위로 반은 아래로향한다.
            if (this.weappon_index%4 == 0){
                this.weappon_upDown = 1;
                this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
            }else if (this.weappon_index%4 == 1){
                this.weappon_upDown = -1;
                this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
            }else if (this.weappon_index%4 == 2){
                this.weappon_leftRight = -1 - (Math.floor(Math.random() * 1) + 1);
                this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
            }else {
                this.weappon_leftRight = 1 + (Math.floor(Math.random() * 1) + 1);
                this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
            }
        }

        this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight;
        this.weapponArray[i].bsize = this.weappon_size;
        this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 2); //<= 총알 속도의 핵심(his.weappon_upDown / 4).
        this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed;

        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize,this.weapponArray[i].bsize);

        //플레이어 충돌
        this.player_collision();


       //미사일 화면 이탈시 또는 미사일이 너무 커지면
       //if (weapponArray[i].bmx >= theCanvas.clientWidth  || weapponArray[i].bmx <= 0 ){
       //if ( this.weapponArray[i].bmy >= theCanvas.clientHeight + add_borderX || this.weapponArray[i].bmy + add_borderX <= 0 || this.weapponArray[i].bsize >= 150){
        if ( this.weapponArray[i].bmy >= theCanvas.clientHeight + add_borderX || this.weapponArray[i].bmy + add_borderX <= 0){

            //최대 max_weappon_cnt 개까지만 생성
            if (1 == Math.floor(Math.random()*2)){

                //this.weappon_cnt = Math.floor(Math.random()*5) + 1;

                //미사일 객체(배열) 초기화
                this.weappon_init();
                //this.weappon_size = 3 * parseInt(Math.floor(gameTime/1500));

            }else {
                //5초마다 미사일 증가
                //if (gameTime % 500 == 0){
                    this.weappon_cnt++;

                    if (this.weappon_cnt >= this.max_weappon_cnt){
                        this.weappon_cnt = this.max_weappon_cnt;
                    }

                    this.weappon_create();
                //}

                //미사일 객체(배열) 초기화
                this.weappon_init();
            }

        }
      }
}

////////////////// 플레이어 폭파(미사일 충돌)
function player_collision(){

    //if ((parseInt(weapponArray[i].bmx) <= parseInt(playerX)  + playerWidth) && (parseInt(weapponArray[i].bmx) + weapponArray[i].bsize >= parseInt(playerX)  )){
        //미사일과 Y좌표 충돌시
        //if ((parseInt(weapponArray[i].bmy) <= parseInt(playerY)  + playerHeight) && (parseInt(weapponArray[i].bmy)  + weapponArray[i].bsize >= parseInt(playerY) )){
    //미사일 출동시 약간의 간극을 약간 스칠경우는 폭파되지않도록 한다.
    var ll_tmpspace = 10;

    //현재 미사일 index
    var i = this.weappon_index;

    if ((parseInt(this.weapponArray[i].bmx) <= parseInt(playerX)  + playerWidth - ll_tmpspace) && (parseInt(this.weapponArray[i].bmx) + this.weapponArray[i].bsize >= parseInt(playerX)  + ll_tmpspace )){
        //미사일과 Y좌표 충돌시
        if ((parseInt(this.weapponArray[i].bmy) <= parseInt(playerY)  + playerHeight - ll_tmpspace) && (parseInt(this.weapponArray[i].bmy)  + this.weapponArray[i].bsize >= parseInt(playerY)  + ll_tmpspace)){
            //console.log("Pdistance",Pdistance)
            //충돌시 폭파이미지로 변경

            if (player_life <= 1){

                // explosion_sound.currentTime  = 4;
                // explosion_sound.play();


                Context.drawImage(explosionImage01,playerX-Math.floor(Math.random()*40),playerY+Math.floor(Math.random()*40),35,25);
                Context.drawImage(explosionImage01,playerX-10,playerY - 15,60*(Pdistance/500)*playerHeight/50,30*(Pdistance/500)*playerWidth/10);
                Context.drawImage(explosionImage01,playerX+Math.floor(Math.random()*10),playerY-Math.floor(Math.random()*60),120,115);

                playerImage = explosionImage01;
                player_warp = explosionImage01;

                this.energe_bar = '';
                explosion_sound.play();
                explosion_sound.currentTime  = 0;

                explosion_sound.play();
                audio.pause();
                //audio.currentTime  = 0;

                // playerImage = noneImage;
                // laserImage = noneImage;
                // player_warp =  noneImage;

                //콜로니 밖 우주 배경그려주기(투명도 적용)
                Context.save();

                Context.globalAlpha = 0.8;

                status = 4;    //게임 END

                //게임 점수 저장
                var ls_current_score = gameScore;
                var ls_current_time = gameTime;
                localStorage.setItem('current_score',ls_current_score);
                localStorage.setItem('current_time',ls_current_time);

                var ls_before_score = localStorage.getItem('before_score');
                var ls_before_time = localStorage.getItem('before_time');
 

                if (ls_before_score == null || ls_before_score == ""){
                    ls_before_score = ls_current_score;
                    ls_before_time = ls_current_time;
                    localStorage.setItem('before_score',ls_current_score);
                    localStorage.setItem('before_time',ls_current_time);
                } 

                //현재 점수가 이전 점수보다 클경우 최고 점수에 저장, 작을경우 이전 점수 저장
                if (parseInt(ls_current_score) > parseInt(ls_before_score)){
                    localStorage.setItem('best_score',ls_current_score);
                    localStorage.setItem('best_time',ls_current_time);
                }else {
                    localStorage.setItem('best_score',ls_before_score);
                    localStorage.setItem('best_time',ls_before_time);
                }

                // 이전 점수에 베스트 점수를 저장
                var ls_best_score = localStorage.getItem('best_score'); 
                    localStorage.setItem('before_score',ls_best_score);
                var ls_best_time = localStorage.getItem('best_time'); 
                    localStorage.setItem('before_time',ls_best_time);                    

 
                //플레이어가 남아있는경우 자동으로 시작   
                player_cnt = parseInt(player_cnt) - 1;

                if (parseInt(player_cnt) > 0){
            
                    //잠시만 와프 이미지
                    playerImage = player_warp;  
                    //출현 사운드
                    appear_sound.play();
                    gameStart(13); 

                    isKeyDown = [];
                    isKeyCode = null;
                    wayBefore = null;
                    pmovex = 0;
                    pmovey = 0;                    

                //게임 재시작 or 종료  
                }else { 

                    gameRetryExitButton(); 
                    
                    
                } 

                return;

            }else {
                if (player_collision_yn == 'N'){

                    Context.drawImage(explosionImage01,playerX+5,playerY - 10,40*(Pdistance/500)*playerWidth/40,60*(Pdistance/500)*playerHeight/20);
                    Context.drawImage(explosionImage01,playerX-Math.floor(Math.random()*50),playerY+Math.floor(Math.random()*50),50,35);
                    Context.drawImage(explosionImage01,playerX-Math.floor(Math.random()*40),playerY+Math.floor(Math.random()*40),35,25);
                    Context.drawImage(explosionImage01,playerX-10,playerY - 15,60*(Pdistance/500)*playerHeight/50,30*(Pdistance/500)*playerWidth/30);
                    crash02_sound.play();
                    crash02_sound.currentTime  = 0;

                    player_life = player_life - 1;
                    player_collision_yn = 'Y';


                    //플레이어에 맞은 미사일은 않보이게 소멸
                    //weapponArray[i] = null;
                    this.weapponArray[i].bx = 0;
                    this.weapponArray[i].by = 0;
                    this.weapponArray[i].bmx = 0;
                    this.weapponArray[i].bmy = 0;
                    this.weapponArray[i].bsize = 0;
                }
            }
        }
    }
} 


////////////////// 화면 로드(게임 프래임 수 만큼)
function drawScreen(){


    //게임 진행 컨텍스트(레이어)
    Context.fillStyle = "#000000";
    Context.fillRect(0,0,theCanvas.clientWidth,theCanvas.clientHeight);
    Context.fillStyle = "#ffffff";
    Context.font = '50px Arial';
    //Context.textBaseline = "top";

    //게임 상태(시작,중지,종료) 표시용 컨텍스트
    Context2.fillStyle = "#000000";
    Context2.fillRect(0,0,theCanvas.clientWidth,theCanvas.clientHeight);
    Context2.fillStyle = "#ffffff";
    Context2.font = '100px Arial';

    //console.log("gameScore/1000",parseInt(gameScore/1000))
    //플레이어 갯수(보너스)(10000점마다 1개씩 증가) 
    //bonus_cnt = Math.floor(gameScore/1000);
    if (gameScore >= 10000 &&  bonus_cnt == Math.floor(gameScore/10000)){    
        
        //if (gameScore%1000 == 0){
            
            if (player_cnt > 0){
                bonus_sound.play();
                 
                bonus_cnt = bonus_cnt + 1;
                //alert(bonus_cnt)
               
            }

            player_cnt =  player_cnt + 1;             
           

       // }  
    }

    //게임상태정보표시
    game_status();

	//게임 컨트롤
    gameControl();

    //전함01 이동
    ship01_move();   
    
    
    //게임 배경 화면
	//if (gameTime % 2 === 0){
		game_background();
	//} 

        
    //플레이어 경계
    player_border();

    //플레이어 거리
    player_didtance();

    //레이져발사
    //if (strKeyEventValue == "Control"  || isKeyCode == 32){
    laser_move();
    //}

    //적 이동
     for (var i=0;i<=enemy_array.length - 1;i++){
        if (enemy_array[i].enemy_index == i){
             enemy_array[i].enemy_move();
        }
     }

    //플레이어 이동(플레이어는 맨 마지막에 그려준다. 그래야 다른 적들보다 앞에서 보여진다.)
    player_move();

    //적 미사일 이동(적미사일과 충돌시 폭파이미지는 플레이더 뒤에서 그려준다.)
    for (var i=0;i<=enemy_array.length - 1;i++){
        if (enemy_array[i].enemy_index == i){
             enemy_array[i].weappon_move();
        }
     }

    //5초마다 미사일 더생성
    // if(gameTime % 100 === 0){
    //     console.log("추가",gameTime)
    //     //동시 나타나는  미사일수
    //     for (var i = 0;i<=2; i++){
    //         //weapponArray.push({bx:weapponX, by:weapponY, bmx:move_weapponX, bmy:100, bsize:10, bspeed:20, bdirection:weappon_Randon});
    //     }
    // }

    //10초마다 적 추가생성 => 5초
    //if(gameTime % 500 === 0){
    //랜덤하게
    if(gameTime % ((Math.floor(Math.random() * 3) + 2) * 100) === 0){

        //적 추가 생성
        enemy_cnt = enemy_cnt + 1;
        create_enemy(enemy_cnt);

    }

    //게임 진행 정보(맨마지막에 그려줘야 게임내 이미지가 덮지않는다.)
    Context.font  = "30px Arial";
    //Context.fillText("입력된 키값 :" + strKeyEventValue,5,15);
    //Context.fillText("캔버스 면적 :" + maxX + "," + maxY,5,30);
    //Context.fillText("입력된 상태 :" + strKeyEventType,5,45);
    //Context.fillText("입력된 위치 :" + playerX + "," + playerY,5,60);
    //Context.fillText("면적 :" + maxX + "," + maxY,theCanvas.clientWidth - 100,15);
    //Context.fillText("FPS :" + gameFrame,theCanvas.clientWidth - 100,30);
    //Context.fillText("거리 :" + gameTime + "Km",theCanvas.clientWidth - 100,45);
    //Context.fillText("속도 :" + Pspeed + "Km/s",theCanvas.clientWidth - 100,60);
    //Context.fillText("타겟 :" + parseInt(Pdistance) + "Km/s",theCanvas.clientWidth - 100,75);
    //Context.fillText("Score : " + gameTime,theCanvas.clientWidth - 250,50);

    Context.fillText("Score : " + (parseInt(gameScore - 50)<=0?0:gameScore),10,50);
    Context.fillText("Bonus: " + String((parseInt(player_cnt) - 1<=0?0:parseInt(player_cnt) - 1)),10,100);
    Context.fillText("Time  : " + (parseInt(gameTime - 50)<=0?0:gameTime),10,150);

    if(gameTime<=50){
        Context2.font = '100px Arial';
        Context2.fillText("Ready", (theCanvas.clientWidth - ini_player_width) / 2 - theCanvas.offsetLeft - 100, theCanvas.clientHeight / 2 - theCanvas.offsetTop);
        Context2.font = '30px Arial';
    }
}

////////////////// 키 다운 이벤트 처리(데스크 탑 이용시)
function onkeyDown(e, as_strKeyEventValue){

    strKeyEventValue = e.key;
    strKeyEventType = e.type;
    isKeyCode =  e.keyCode;

    //게임 진행 상태
    if (strKeyEventValue == "Enter" || isKeyCode == 13){

        //alert(status+","+Pspeed) 
        //상태별 상태값 설정
        if(status == 1){        //시작

            isKeyDown[e.keyCode] = true;

            clearInterval(Timer_Id);

            //게임 변수 초기화
            game_init();

            //플레이어 변수 초기화
            player_init();

            //레이져 변수 초기화
            laser_init();

            //적 생성
            create_enemy();

            status = 2;         //진행

            Timer_Id = setInterval(drawScreen, 1000/gameFrame);

            audio.play();
            //audio.pause();

        }else if(status == 2){

            status = 3;         //멈춤

            clearInterval(Timer_Id);

            Timer_Id = setInterval(drawScreen, 1000/gameFrame);

            //audio.play();
            audio.pause();

        }else if(status == 4){  //게임오버

            clearInterval(Timer_Id);

            //게임 변수 초기화
            game_init();

            //플레이어 변수 초기화
            player_init();

            //레이져 변수 초기화
            laser_init();

            create_enemy();

            //상태값 : 시작
            status = 1;

            Timer_Id = setInterval(drawScreen, 1000/gameFrame);

            //audio.play();
            audio.pause();

        }else {          //계속 진행

            status = 2;  //진행

            Timer_Id = setInterval(drawScreen, 1000/gameFrame);

            audio.play();
            //audio.pause();
        }

    }else if (strKeyEventValue == "Escape" || isKeyCode == 27){
            if (confirm("재시작하시겠습니까")){

                clearInterval(Timer_Id);

                //게임 변수 초기화
                game_init();

                //플레이어 변수 초기화
                player_init();

                //레이져 변수 초기화
                laser_init();

                //적 생성
                create_enemy();

                //상태값  : 시작
                status = 1;

                Timer_Id = setInterval(drawScreen, 1000/gameFrame);

                audio.play();
                //audio.pause();
            }else {
                //상태값: 그냥 이어서 진행
                status = 2;

                Timer_Id = setInterval(drawScreen, 1000/gameFrame);

                audio.play();
                //audio.pause();
            };

            return;
    }

    //레이져
    if (strKeyEventValue == "Space"  || isKeyCode == 32){

		laser_sound.currentTime  = 0;
        laser_sound.play();

        //레이져 변수 초기화
        laser_init();
        laser_yn = 'Y';
        laser_move();

    }
}

////////////////// 키 업 이벤트 처리(데스크 탑 이용시)
function onkeyUp(e){

    isKeyCode = null;
    isKeyDown[e.keyCode] = false;

    strKeyEventValue = e.key;
    strKeyEventType = e.type;
    strKeyEventValue = "None";

}

//마우스 우클릭, 드래그, 선택 방지
$(document).on("contextmenu dragstart selectstart",function(e){
    return false;
});

//화면 드래그 방지
//$('html, body, totdiv').css({'overflow': 'hidden', 'height': '100%'});
$('#GameCanvas').on('scroll touchmove mousewheel', function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
});

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
      // if (document.exitFullscreen) {
      //   document.exitFullscreen();
      // } else if (document.msExitFullscreen) {
      //   document.msExitFullscreen();
      // } else if (document.mozCancelFullScreen) {
      //   document.mozCancelFullScreen();
      // } else if (document.webkitExitFullscreen) {
      //   document.webkitExitFullscreen();
      // }
    }
  }