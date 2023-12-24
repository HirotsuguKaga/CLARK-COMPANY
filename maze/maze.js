maze={
view:`<section id='field'>
<div id="maze"><div id="wall">
<img id="bg" src='maze/back.png' class='maze'>
<img id="r4s" src='maze/s4s.png' class='maze'>
<img id="rd4s" src='maze/doors4s.png' class='maze'>
<img id="l4s" src='maze/s4s.png' class='maze'>
<img id="ld4s" src='maze/doors4s.png' class='maze'>
<img id="r4" src='maze/s4.png' class='maze'>
<img id="rd4" src='maze/doors4.png' class='maze'>
<img id="l4" src='maze/s4.png' class='maze'>
<img id="ld4" src='maze/doors4.png' class='maze'>
<img id="s4" src='maze/step4.png' class='maze'>
<img id="f4" src='maze/f4.png' class='maze'>
<img id="d4" src='maze/door4.png' class='maze'>
<img id="r3s" src='maze/s3s.png' class='maze'>
<img id="rd3s" src='maze/doors3s.png' class='maze'>
<img id="l3s" src='maze/s3s.png' class='maze'>
<img id="ld3s" src='maze/doors3s.png' class='maze'>
<img id="r3" src='maze/s3.png' class='maze'>
<img id="rd3" src='maze/doors3.png' class='maze'>
<img id="l3" src='maze/s3.png' class='maze'>
<img id="ld3" src='maze/doors3.png' class='maze'>
<img id="s3" src='maze/step3.png' class='maze'>
<img id="f3" src='maze/f3.png' class='maze'>
<img id="d3" src='maze/door3.png' class='maze'>
<img id="r2" src='maze/s2.png' class='maze'>
<img id="rd2" src='maze/doors2.png' class='maze'>
<img id="l2" src='maze/s2.png' class='maze'>
<img id="ld2" src='maze/doors2.png' class='maze'>
<img id="s2" src='maze/step2.png' class='maze'>
<img id="f2" src='maze/f2.png' class='maze'>
<img id="d2" src='maze/door2.png' class='maze'>
<img id="ls1" src='maze/steps1.png' class='maze'>
<img id="l1" src='maze/s1.png' class='maze'>
<img id="ld1" src='maze/doors1.png' class='maze'>
<img id="rs1" src='maze/steps1.png' class='maze'>
<img id="r1" src='maze/s1.png' class='maze'>
<img id="rd1" src='maze/doors1.png' class='maze'>
<img id="s1" src='maze/step1.png' class='maze'>
<img id="c1"  class='maze'>
<img id="f1" src='maze/f1.png' class='maze'>
<img id="d1" src='maze/door1.png' class='maze'></div>
<p id="pop"></p>
<div id="notification"><span id="direction">N↑</span>　X:<span id="mazeX">0</span> Y:<span id="mazeY">0</span> </div>
<img id="enemy"></div>
</section>
<br style='line-height:480px'>
<div id="cont"></div>`,
menu:`<div class="mazeMenu">
<a href="JavaScript:maze.go(3)"><img src="maze/ll.png"></a>
<a href="JavaScript:maze.go(0)"><img src="maze/go.png"'></a>
<a href="JavaScript:maze.go(1)"><img src="maze/rr.png"'></a><br>
<a href="JavaScript:maze.turn(3)"><img src="maze/left.png"></a>
<a href="JavaScript:maze.turn(2)"><img src="maze/turn.png"></a>
<a href="JavaScript:maze.turn(1)"><img src="maze/right.png"></a><br>
<a href="JavaScript:maze.showMap()"><img src="maze/map.png"></a>
<a href="JavaScript:maze.go(2)"><img src="maze/bb.png"></a></div>
`,
///////////////////////////スタート処理　////////////////////////////////////////
start:function(floor,x=p.x,y=p.y,field){
  L(maze.view);
  document.getElementById('maze').classList.add('darkzone');
  this.set(maze.menu);
  if(x!=undefined) p.x = x;
  if(y!=undefined) p.y = y;
  if(field) p.field = field;
  if(floor) p.floor = p.field[floor];
  if(p.field.color){
    document.getElementById('maze').classList.add(p.field.color);
  }
  //document.getElementById('maze').classList.add('');
  var sW = window.innerWidth;
  var W = sW * 0.77;
  if(W>480)W=480;
  document.getElementById('maze').style.height = W + 'px';
  document.getElementById('c1').style.visibility='hidden';
  ////////////////////////////////////////////////////////////
  if(!p.mapName[p.floor]) p.mapName[p.floor] = floor;
  if(!p.mapData[p.floor]) p.mapData[p.floor] = [[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,, ,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,,,,,,,]];
  /////////////////////// 現在地のコードを実行 ///////////////
  if(p.field[p.floor[p.y][p.x]])  p.field[p.floor[p.y][p.x]]();
  this.setView();
  fuga.sound("step");
  setTimeout(function(){document.getElementById('maze').classList.remove('darkzone');fuga.play(p.field.bgm);fuga.volume(0.3)},300);
  
},

pop:function(str,num=35){  ////////////////// メッセージ ////////////////////
  var pop = document.getElementById('pop');
  pop.innerHTML = str;
  pop.style.visibility='visible';
  if(num == 'no')return;
  setTimeout(
    function(){
      pop.style.visibility='hidden';
    }
  ,num*10);
},
/////////////////////////////////////////////////////////////////////////////////
turn:function(num){   ////////////////　方向転換処理　///////////////////////////
  p.dir += num;
  p.dir = p.dir % 4;
  this.setView();
  fuga.sound("walk");
},
///////////////////////////////////////　バック　///////////////////
back:function(){
  fuga.sound("walk");
  maze.pop('後退した');
  p.x = p.postx;
  p.y = p.posty;
  document.getElementById('enemy').style.visibility='hidden';
  document.getElementById('c1').style.visibility='hidden';
  if(p.field[p.floor[p.y][p.x]]) p.field[p.floor[p.y][p.x]]();//現在地のコードを実行
  maze.setView();
},
go:function(bool){   /////////////////　移動処理　//////////////////
  var x = p.x;
  var y = p.y;
  var floor = p.floor;
  var wall = document.getElementById('f1');
  var dir = p.dir;
  dir = (dir+bool)%4;
  p.postx=p.x;
  p.posty=p.y;
  switch(dir){
    case 0:
      y--; break;
    case 1:
      x++; break;
    case 2:
      y++; break;
    case 3:
      x--; break;
  }
  var error=()=>{             //壁に衝突時の処理
    fuga.sound("error");
    this.pop('いて！');
    if(!bool){
      wall.style.visibility='visible';
      setTimeout(
        function(){wall.style.visibility='hidden';
      },250);
    }else {
      document.getElementById('maze').classList.add('shake');
      setTimeout(function(){document.getElementById('maze').classList.remove('shake')},300);
    }
    setTimeout(
      function(){
        wall.style.visibility='hidden';
      },250);
  }
  if(!floor[y]|| floor[y]=='0'){              //衝突の判定
    error();
    return;
  } else if(!floor[y][x]|| floor[y][x]=='0'){
    error();
    return;
  } else if((bool==1||bool==2||bool==3)&&(String(floor[y][x]).charAt(0)=='s'||String(floor[y][x]).charAt(0)=='w'||String(floor[y][x]).charAt(0)=='d')){
    error();
    return;
  } else {
    p.x = x;
    p.y = y;
  }
  document.getElementById('enemy').style.visibility='hidden';
  document.getElementById('c1').style.visibility='hidden';
  document.getElementById('pop').style.visibility='hidden';
  /////////////////////// 現在地のコードを実行 ///////////////
  if(p.field[floor[y][x]])  p.field[floor[y][x]]();
  this.setView(1);
  fuga.sound("walk");
},
/////////////////////////////////////////////////////////
setView:function(go){   /////////////////　描画処理　////
  var x = p.x;
  var y = p.y;
  var view=[];
  var floor =  p.floor;
  var wallArr = [];
  wallArr[0] = document.getElementById('f1');
  wallArr[1] = document.getElementById('l1');
  wallArr[2] = document.getElementById('r1');
  wallArr[3] = document.getElementById('f2');
  wallArr[4] = document.getElementById('l2');
  wallArr[5] = document.getElementById('r2');
  wallArr[6] = document.getElementById('f3');
  wallArr[7] = document.getElementById('l3');
  wallArr[8] = document.getElementById('r3');
  wallArr[9] = document.getElementById('l3s');
  wallArr[10] = document.getElementById('r3s');
  wallArr[11] = document.getElementById('f4');
  wallArr[12] = document.getElementById('l4');
  wallArr[13] = document.getElementById('r4');
  wallArr[14] = document.getElementById('l4s');
  wallArr[15] = document.getElementById('r4s');
  var stepArr =[,,,,,,,,,,,,,,,];
  stepArr[0] = document.getElementById('s1');
  stepArr[1] = document.getElementById('ls1');
  stepArr[2] = document.getElementById('rs1');
  stepArr[3] = document.getElementById('s2');
  stepArr[6] = document.getElementById('s3');
  stepArr[11] = document.getElementById('s4');
  var doorArr =[];
  doorArr[0] = document.getElementById('d1');
  doorArr[1] = document.getElementById('ld1');
  doorArr[2] = document.getElementById('rd1');
  doorArr[3] = document.getElementById('d2');
  doorArr[4] = document.getElementById('ld2');
  doorArr[5] = document.getElementById('rd2');
  doorArr[6] = document.getElementById('d3');
  doorArr[7] = document.getElementById('ld3');
  doorArr[8] = document.getElementById('rd3');
  doorArr[9] = document.getElementById('ld3s');
  doorArr[10] = document.getElementById('rd3s');
  doorArr[11] = document.getElementById('d4');
  doorArr[12] = document.getElementById('ld4');
  doorArr[13] = document.getElementById('rd4');
  doorArr[14] = document.getElementById('ld4s');
  doorArr[15] = document.getElementById('rd4s');
  var c=(x,y)=>{
    if(!floor[y]){
      temp = 0;
    } else if(!floor[y][x]){
      temp=0;
    } else {
      temp = floor[y][x];
    }
    return temp;
  }
  switch(p.dir){
    case 0:  //北向き
      view[0]= c(x,y);
      view[1]= c(x-1,y);
      view[2]= c(x+1,y);
      view[3]= c(x,y-1);
      view[4]= c(x-1,y-1);
      view[5]= c(x+1,y-1);
      view[6]= c(x,y-2);
      view[7]= c(x-1,y-2);
      view[8]= c(x+1,y-2);
      view[9]= c(x-2,y-2);
      view[10]= c(x+2,y-2);
      view[11]= c(x,y-3);
      view[12]= c(x-1,y-3);
      view[13]= c(x+1,y-3);
      view[14]= c(x-2,y-3);
      view[15]= c(x+2,y-3);
      document.getElementById('direction').innerHTML="N↑";
      break;
    case 1:  //東向き
      view[0]= c(x,y);
      view[1]= c(x,y-1);
      view[2]= c(x,y+1);
      view[3]= c(x+1,y);
      view[4]= c(x+1,y-1);
      view[5]= c(x+1,y+1);
      view[6]= c(x+2,y);
      view[7]= c(x+2,y-1);
      view[8]= c(x+2,y+1);
      view[9]= c(x+2,y-2);
      view[10]= c(x+2,y+2);
      view[11]= c(x+3,y);
      view[12]= c(x+3,y-1);
      view[13]= c(x+3,y+1);
      view[14]= c(x+3,y-2);
      view[15]= c(x+3,y+2);
      document.getElementById('direction').innerHTML="E→";
      break;
    case 2:  //南向き
      view[0]= c(x,y);
      view[1]= c(x+1,y);
      view[2]= c(x-1,y);
      view[3]= c(x,y+1);
      view[4]= c(x+1,y+1);
      view[5]= c(x-1,y+1);
      view[6]= c(x,y+2);
      view[7]= c(x+1,y+2);
      view[8]= c(x-1,y+2);
      view[9]= c(x+2,y+2);
      view[10]= c(x-2,y+2);
      view[11]= c(x,y+3);
      view[12]= c(x+1,y+3);
      view[13]= c(x-1,y+3);
      view[14]= c(x+2,y+3);
      view[15]= c(x-2,y+3);
      document.getElementById('direction').innerHTML="S↓";
      break;
    case 3:  //西向き
      view[0]= c(x,y);
      view[1]= c(x,y+1);
      view[2]= c(x,y-1);
      view[3]= c(x-1,y);
      view[4]= c(x-1,y+1);
      view[5]= c(x-1,y-1);
      view[6]= c(x-2,y);
      view[7]= c(x-2,y+1);
      view[8]= c(x-2,y-1);
      view[9]= c(x-2,y+2);
      view[10]= c(x-2,y-2);
      view[11]= c(x-3,y);
      view[12]= c(x-3,y+1);
      view[13]= c(x-3,y-1);
      view[14]= c(x-3,y+2);
      view[15]= c(x-3,y-2);
      document.getElementById('direction').innerHTML="W←";
      break;
  }
  for(var i=0; 16 > i ; i++){          ////パーツの選択
      wallArr[i].style.visibility='hidden';
      doorArr[i].style.visibility='hidden';
      if(stepArr[i]) stepArr[i].style.visibility='hidden';
    switch( String(view[i]).charAt(0) ){
      case 's':  //階段
        if(stepArr[i]) stepArr[i].style.visibility='visible';break;
      case 'd':  //ドア
        if(doorArr[i]) doorArr[i].style.visibility='visible';
        wallArr[i].style.visibility='visible';break;
      case '0':  //壁
        if(doorArr[i]) doorArr[i].style.visibility='hidden';
        wallArr[i].style.visibility='visible';break;
      default:  //壁
        wallArr[i].style.visibility='hidden';break;
    }
  }
  document.getElementById('mazeX').innerHTML = p.x;
  document.getElementById('mazeY').innerHTML = p.y;
  /////////////////////オートマッピング用データの作成 ///////////
  var map = p.mapData[floor];
  var writeMap=(X,Y)=>{
    var p;
    switch(String( c(X,Y) ).charAt(0) ){
      case '0':p=1;break;
      case 'm': 
      case '1': p=2;break;
      case 's': p=3;break;
      case 'd': p=4;break;
      case 'c':
      case 'e': p=5;break;
      case 'x': p=7;break;
      case 'w': p=9;break;
      default: p=6;break;
    }
    map[X+1][Y+1] = p;
  }
  writeMap(x,y);
  writeMap(x-1,y);
  writeMap(x+1,y);
  writeMap(x,y-1);
  writeMap(x,y+1);
  writeMap(x-1,y-1);
  writeMap(x+1,y-1);
  writeMap(x-1,y+1);
  writeMap(x+1,y+1);
},

/////////////////////////　オートマッピングデータの表示　///////////////////////////
showMap:function(){
  fuga.sound('paper');
  fuga.scrollTop();
  document.getElementById('maze').style.display = 'none';
  document.getElementById('cont').innerHTML='';
  main.innerHTML = maze.map +main.innerHTML;
  var piece;
  var showBoard = function(){
    var b = document.getElementById("board");
    var sW = window.innerWidth * 0.8;
    if(sW>540) sW = 540;
    var W = sW/20;
    document.getElementById('board').style.height = sW + 'px';
    var Y =board.length;
    for(var y = 0; y < Y; y++){
      var X =board[y].length;
      for(var x = 0; x < X; x++){
        var num = 0;
        if(board[y][x]) num = board[y][x];
        if(piece[num]){
          var c = piece[num].cloneNode(true);
          if(x == p.y + 1 && y == p.x + 1) c = piece[8].cloneNode(true); //現在地
          document.getElementById('now').style.transform = 'rotate(' + 90 * p.dir + 'deg)';
          c.style.width = W +'px';
          c.style.height = W +'px';
          c.style.left = ((y-1) * W) + "px";
          c.style.top = ((x-1) * W) + "px";
          b.appendChild(c);
        }
      }
    }
  }
  var board = p.mapData[p.floor];
  piece = [document.getElementById("unknown"),document.getElementById("wall"),document.getElementById("black"),document.getElementById("step"),document.getElementById("door"),document.getElementById("event"),document.getElementById("ex"),document.getElementById("dz"),document.getElementById("now"),document.getElementById("down")];
  showBoard();
},

map:`
<div id='map'><div style="display: none;">
  <div id="unknown" style="position:absolute;width:4%;height:4%;background:none"></div>
  <div id="wall" style="position:absolute;width:4%;height:4%;background:url('maze/tile.png');background-size:contain;border-radius:2px"></div>
  <div id="black" style="position:absolute;width:4%;height:4%;background-color:#444; color:white"></div>
  <div id="step" style="position:absolute;width:4%;height:4%;background:url('maze/step1.png');background-size:contain;background-color:#bbb; color:white"></div>
  <div id="door" style="position:absolute;width:4%;height:4%;background:url('maze/door1.png');background-size:contain;background-color:#777; color:white"></div>
  <div id="event" style="position:absolute;width:4%;height:4%;background-color:#444; color:white;text-align:center; font-size:11px">☆</div>
  <div id="ex" style="position:absolute;width:4%;height:4%;background-color:#444; color:white;text-align:center; font-size:11px">！</div>
  <div id="dz" style="position:absolute;width:4%;height:4%;background-color:#000; color:white;text-align:center; font-size:11px"></div>
  <div id="now" style="position:absolute;width:4%;height:4%;background-color:#444; color:#1b0;text-align:center; font-size:11px">▲</div>
  <div id="down" style="position:absolute;width:4%;height:4%;background:url('maze/step1.png');background-size:contain;background-color:#bbb; color:white; transform: scale(1, -1);"></div>
</div>
<br><br>
<h1>MAP</h1><br>
<div id="board" style="height: 480px;position:relative; margin:20px; "></div>
<a href="JavaScript:maze.close()">地図を閉じる</a></div>
`,

/////////////////////////V　メニューの表示　///////////////////////////
showMenu:function(){
  fuga.sound('paper');
  fuga.scrollTop();
  document.getElementById('maze').style.display='none';
  maze.set(maze.camp);
  //ステータスを表示
},

camp:`
  <br><h1>MENU</h1>
  <a href="JavaScript:maze.close()">もどる</a>
`,
/////////////////////////////////////////////////////////////
set:function(id, func){             ////////////// セット★
  document.getElementById('cont').innerHTML = "<br><br><br><br><br><br><br>";
  setTimeout(function(){document.getElementById('cont').innerHTML = id; if(func){func()} },300);
  colorFade('cont');
},

add:function(id){                   ////////////// アド★
  var cont = document.getElementById('cont');
  cont.innerHTML = cont.innerHTML.replace(/<a href.*/g,"");
  cont.innerHTML = cont.innerHTML.replace(/id="add"/g,"");
  setTimeout(
    function(){cont.innerHTML += `<div id="add">${id}</div>`;colorFade('add')},300);
  if (hp<=0){
    cont.innerHTML = cont.innerHTML.replace(/<a href.*/g,"");
    cont.innerHTML += maze.dead;
  }
  sound(id);
},

close:function(){
  fuga.sound('paper');
  if(document.getElementById('map')){ //マップを削除
    var map = document.getElementById('map');
    map.parentNode.removeChild(map);
  }
  document.getElementById('maze').style.display='block';
  //main.innerHTML = main.innerHTML.replace(/.*<div id="maze">/g,"");
  this.set(maze.menu);
}
}
