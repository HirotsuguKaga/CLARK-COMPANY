var p={  //PCの情報
  hp:38, mhp:38,
  str:7, dex:7, con:7, sen:7, wiz:7, pow:7,
  ap:3,
  dp:5,
  arm:'',
  armer:'',
  item:'',
  gold:4,
  x:0,y:0,dir:1,floor:'',mapData:{},mapName:{}
};

var main = document.getElementById('main');
var bg="";
var next='p0';


var set=(tag, value)=>{
  tag = value;
}

var adjust=(tag, value)=>{
  tag += value;
}

var add=(id)=>{
  main.innerHTML = main.innerHTML.replace(/<a href.*/g,"");
  main.innerHTML = main.innerHTML.replace(/id="add"/g,"");
  main.innerHTML = main.innerHTML + `<div id="add">${id}</div>`;
  colorFade('add');
  if (hp<=0){
    maint.innerHTML = cont.innerHTML.replace(/<a href.*/g,"");
    maint.innerHTML += para.p14;
  }
  sound(id);
}


var move=(id,scene,tag,se)=> {
  if(scene) p.scene = scene;
  if (hp<=0){
    add(para.p14);
    return;
  }
  L(p.scene[id]);
}
/////////////////////////////////////////////////////////////////////////////////////////
var L=(id,tag)=>{ ///////パラグラフ移動
  main.innerHTML = id;
  fuga.scrollTop();
  colorFade();
  //sound(se);
  //background(id,scene);
  var i = 30;
  var time = setInterval(  //アニメーション
    function(){
      main.style.width = i + "%";
      i += 10;
      if(i > 90) clearInterval(time); //停止条件
    }
  , 4);
  if(tag) setTimeout(function(){location.hash=tag},200);//ページ内リンク用　＊idへ移動する
}

var colorFade=(id='main')=>{
  var element = document.getElementById(id);
  var c = 0;
  element.style.color = 'rgba(0,0,0,' + c + ')';
  let down=()=>{
    c += 0.05;
    element.style.color = 'rgba(0,0,0,' + c + ')';
    if(c > 1){
      return;
    }else{
      setTimeout(down,20);
    }
  }
  setTimeout(down,40)
}

var sound=(se)=>{  ///////////////効果音の設定　♪
  switch(se){
    //case 'no':break;
    //default:fuga.sound("steps");break;
  }
}

var background=(id)=>{
  switch(id.charAt(0)){
    case "p":document.body.style.backgroundImage="url('parts/wall.jpg')";
             document.getElementById('main').style.backgroundImage="url('parts/paper.jpg')";break;  //idの一文字目で壁紙を選択
    case "s":document.body.style.backgroundImage="url('parts/stone.jpg')";break;
    case "t":document.body.style.backgroundImage="url('parts/stone2.jpg')";
             document.getElementById('main').style.backgroundImage="url('parts/paper.jpg')";break;
    case "o":document.body.style.backgroundImage="url('parts/wood.jpg')";break;
    case "m":document.body.style.backgroundImage="url('parts/hell.jpg')";
             document.getElementById('main').style.backgroundImage="url('parts/paper2.jpg')";break;
    case "j":document.getElementById('main').style.backgroundImage="url('parts/paper3.jpg')";break;
    default :document.getElementById('main').style.backgroundImage="url('parts/paper.jpg')";break;
  }
}
///////////////////////////////////////////////////////////////////////// セクションごとのオートセーブ
function cL(id){  //セクション冒頭への移動時に指定
  cp=id;
  shp=hp;
  smhp=mhp;
  sitem=item;
  sap=ap;
  sac=ac;
  scheck=checker;
  L(id)
}

function back(){  //セクション冒頭へ戻る
  L(cp);
  hp=shp;
  mhp=smhp;
  item=sitem;
  ap=sap;
  ac=sac;
  checker=scheck;
  document.getElementById("hp").innerHTML=hp;
  document.getElementById("item").value=item;
}
/////////////////////////////////////////////////////////////////////////// セーブ関連/
var storage = localStorage;
var hpdata;
var itemdata;
var iddata="p01";
var apdata;var acdata;
var id;

function save(id) {fuga.showToast("冒険の記録を書きとめた");
  storage.setItem("hpdata", hp);
  storage.setItem("itemdata", item);
  storage.setItem("apdata", ap);
  storage.setItem("acdata", ac);
  storage.setItem("iddata", id);
  storage.setItem("checkdata", checker);
  fuga.sound("item");
}

function load(){//ロード
  if(!storage.getItem("hpdata"))return;
  hp=storage.getItem("hpdata");
  document.getElementById("hp").innerHTML=hp;
  item=storage.getItem("itemdata");
  document.getElementById("item").value=item;
  ap=storage.getItem("apdata");
  ac=storage.getItem("acdata");
  id=storage.getItem("iddata");
  checker=storage.getItem("checkdata");
  cp=id;
  cL(id);
  k('tarcus','epia','epib');
}
////////////////////////////////DIVの表示切替/////////////////////////////////////////////////
function v(id,id2){
	var disp=document.getElementById(id).style.display;
	if(disp=="none"){disp="block"}else{disp="none"}
		document.getElementById(id).style.display=disp;
		var disp2=document.getElementById(id2).style.display;
		if(disp2=="none"){disp2="block"}else{disp2="none";
	}
		document.getElementById(id2).style.display=disp2;
	if (hp<=0)//条件分岐：もし、ヒットポイントが0以下だったら13を挿入する
		{var next=document.getElementById(id2).innerHTML;
		next=next.replace(/<a href.*/g,"");
		var dead=document.getElementById('p13').innerHTML;
		document.getElementById(id2).innerHTML=next + dead
	}
	strFade();
}

/////////////////////文字サイズ変更///////
var siz = '100%';

function sizeChange(size){
  siz=size;
  //document.getElementById('sizetext').textContent = size;
  document.body.style.fontSize = size + "%";
  storage.setItem("sizedata", size);
}

//////////////////////////////////////////////////
var money = document.getElementById('money');

var getGold=(num)=>{
  p.gold += num;
  money.innerHTML = p.gold + '枚';
  main.innerHTML += `<div class="note">金貨${num}枚を手に入れた。</div>`;
}
var getItem=(item)=>{
  p.item += ',' + item;
  main.innerHTML += `<div class="note">${item}を手に入れた。</div>`;
}

var pay=(num,func)=>{
  if(p.gold<num){
    fuga.showToast('金貨が足りないようだ');
    fuga.sound('error');
    return;
  }
  p.gold -= num;
  money.innerHTML = p.gold + '枚';
  fuga.showToast('金貨'+num+'枚を支払った');
  func();
}

var set=(tag,id)=>{
  tag = id;
}
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
window.onload = function(){  // ページ読み込み時に実行したい処理
  //setTimeout(fuga.play('vacant'),1500);
  
  L(para.p0);/////////<=======

  if(!storage.getItem("sizedata")) {return;}
  size=storage.getItem("sizedata");
  sizeChange(size);
}