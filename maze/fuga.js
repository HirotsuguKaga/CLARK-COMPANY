  console.log(0102);

var fuga = {
church:new Audio("raw/church.mp3"),
dead:new Audio("raw/dead.mp3"),
door:new Audio("raw/door.mp3"),
ending:new Audio("raw/ending.mp3"),
fall:new Audio("raw/fall.mp3"),
sword:new Audio("raw/sword.mp3"),
step:new Audio("raw/steps.mp3"),
walk:new Audio("raw/walk.mp3"),
item:new Audio("raw/item.mp3"),
error:new Audio("raw/error.mp3"),
paper:new Audio("raw/paper.mp3"),
card:new Audio("raw/card.mp3"),
thunder:new Audio("raw/thunder.mp3"),
monster:new Audio("raw/monster.mp3"),
damage:new Audio("raw/damage.mp3"),
fire:new Audio("raw/fire.mp3"),

sound:function(id){
  this[id].play();
},

showToast:function(text){
  alert(text);
},
scrollTop:function(){
  window.scrollTo(0,0);
},

play:function(id){
  this.tune = new Audio("raw/"+id+".mp3");
  this.tune.loop=true;
  this.tune.play();
},

reset:function(){
  this.tune.pause();
  this.tune.currentTime = 0;
},

volume:function(num){  //0~1.0
  this.tune.volume = num;
},

tune:new Audio()

}