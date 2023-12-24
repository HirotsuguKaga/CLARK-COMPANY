var para ={
p0: `<br><div style="color:#444;text-align:center;"><h1>迷宮審判 Ep.0</h1><br><br>
<a href="JavaScript:maze.start('ca',3,15,castle);">ダンジョンを探索</a>
</div>
`
,
addd:`ssssssssdgwergwaregewgaweg<a href="JavaScript:add(para.addd)">街へ移動</a>
`,

field:`<p style="position:absolute;
width: 300px;
height: 300px;
overflow: hidden;">
<img src="map.jpg" id="map" 
style="position:relative; top: -500;left:-500; width:1000px;
transition: 3s ease;">
</p><br><br><br><br><br><br><br><br><br><br><br><br>
<a onclick="map.top(300)">上へ</a><br><br>
<a onclick="map.left(-300)">右へ</a><br><br>
<a onclick="map.top(-300)">下へ</a><br><br>
<a onclick="map.left(300)">左へ</a><br><br>`,

grass1:`君は町の東側の街道にいる。周囲には草原が広がっている。
<div style="background:url('field/grass.jpg') no-repeat 50% 50%;" class="field"></div>
<a href="JavaScript:start();L('grass2',para.)">西へ</a>
<a href="JavaScript:start();L('grass3')">東へ</a>
<a href="JavaScript:start();L('p0')">タイトルへ戻る</a>

<div class="maze">
<a href="JavaScript:L('j8');">北へ</a><br>
<img src="t.png" style="transform:rotate(270deg)"><a href="JavaScript:L('j1');">東へ</a><br>
<a href="JavaScript:L('j3');">南へ</a></div>`,

'p13':`君は死んだ。<a href="JavaScript:L('p0')">次へ</a>`
};

let town = {
  plaza:`<h2>中央広場</h2><div style="background:url('field/town.jpg') no-repeat 50% 50%;" class="field"></div>
ここは街道の小さな宿場町だ。街道を挟んだ道の両側に十数件の農家が並んでいる。町の中央には広場があり、主要な建物が集まっている。
<a href="JavaScript:L(town.inn)">宿屋へ移動</a>
<a href="JavaScript:L(town.bar);fuga.reset();fuga.play('tavern');fuga.volume(0.3)">酒場へ移動</a>
<a href="JavaScript:L(town.gate)">街の門へ移動</a>`,

  inn:`<h2>宿屋</h2><div style="background:url('field/inn.jpg') no-repeat 50% 50%;" class="field"></div>
町の中央広場に面した宿屋の扉を開く。こじんまりとしているが、
小太りの宿の主人が君を値踏みしながらぶっきらぼうにいう。
「一泊、金貨一枚だよ」
<a href="JavaScript:L('inn2');d(-50)">宿泊する</a>
`,
  inn2:`<h2>朝</h2><div style="background:url('field/inn.jpg') no-repeat 50% 50%;" class="field"></div>
体力が回復した。
<a href="JavaScript:L('plaza',town)">広場へ移動</a>`,


  bar:`<h2>酒場</h2>
  酒場のスイングドアを抜けると吟遊詩人の一座が奏でる軽快な音楽が聞こえてくる。街道の宿場町らしく、街の規模よりも随分と大きな酒場宿のようだ。
  <div style="background:url('field/town.jpg') no-repeat 50% 50%;" class="field"></div>
  <a href="JavaScript:L('counter')">カウンターへ</a>
  <a href="JavaScript:L('bard')">吟遊詩人のもとへ</a>
  <a href="JavaScript:L('start',hitAndBlow);set(BACK,town.bar)">カードで遊ぶ</a>
  <a href="JavaScript:L('start',highDice)">サイコロで遊ぶ</a>
  <a href="JavaScript:L('plaza');fuga.reset()">外に出る</a>`,

  counter:`
  酒場の主人が杯を磨いている。
  <a href="JavaScript:add('counter2')">話を聴く</a>
  <a href="JavaScript:add('counter3')">酒を注文する</a>
  <a href="JavaScript:L(town.bar)">もどる</a>`,
  counter2:`君が話しかけようとすると、店主は愛想笑いを浮かべながら、それを遮るように話しかけてくる。
  「いらっしゃい。ここは酒場なんでね。まずは一杯注文してもらいましょうか」<br>さて、
  <a href="JavaScript:pay(1,L('counter4'))">エール(金貨一枚)を注文する</a>
  <a href="JavaScript:pay(1,L('counter4'))">ミード(蜂蜜酒：金貨一枚)を注文する</a>
  <a href="JavaScript:pay(1,L('counter4'))">クミス(発酵させた山羊の乳：金貨一枚)を注文する</a>
  <a href="JavaScript:pay(2,L('counter4'))">ワイン(金貨二枚)を注文する</a>
  <a href="JavaScript:L(town.bar)">もどる</a>`,
  counter3:`「いらっしゃい」<br>
  君が近づくと、愛想の良い店主が注文表を見せてくる。
  <a href="JavaScript:pay(1,L('counter4'))">エール(金貨一枚)を注文する</a>
  <a href="JavaScript:pay(1,L('counter4'))">ミード(蜂蜜酒：金貨一枚)を注文する</a>
  <a href="JavaScript:pay(1,L('counter4'))">クミス(発酵させた山羊の乳：金貨一枚)を注文する</a>
  <a href="JavaScript:pay(2,L('counter4'))">ワイン(金貨二枚)を注文する</a>
  <a href="JavaScript:L(town.bar)">もどる</a>`,
  counter4:`注文した杯を受け取りながら君は席に着く。
  <a href="JavaScript:L()">この町について尋ねる</a>
  <a href="JavaScript:L()">儲け話はないかと聞く</a>
  <a href="JavaScript:L('bar')">もどる</a>`,
  
  bard:`リュートを構えた吟遊詩人が軽く会釈する。
  <a href="JavaScript:fuga.reset();fuga.play('song');add(town.bard2)">『牧場の三姉妹』をリクエストする</a>
  <a href="JavaScript:fuga.reset();fuga.play('tomoshibi');add(town.bard2)">『街の灯火』をリクエスト</a>
  <a href="JavaScript:fuga.reset();fuga.play('forest');add(town.bard2)">『森の夜明け』をリクエスト</a>
  <a href="JavaScript:fuga.reset();fuga.play('tavern');add(town.bard2)">『エールの宴』をリクエスト</a>
  <a href="JavaScript:L(town.bar)">もどる</a>`,
  bard2:`<br><br>　　♪　♪　♪<br><br>
  <a href="JavaScript:pay(1,add(town.bard3));fuga.volume(0.3)">チップとして金貨一枚を払う</a>
  <a href="JavaScript:add(town.bard4);fuga.volume(0.3)">何もせずに立ち去る</a>`,
  
  bard3:`手前に置かれたリュートのケースの中に金貨を入れると、吟遊詩人は帽子をとって慇懃にお辞儀する。<br>「ありがとう。私は彷徨える詩人のクランベルだ。美しい調べが必要な時、新しい物語を歌にして欲しい時はいつでも声をかけてくれたまえ」<br>さて、
  <a href="JavaScript:L('counter')">カウンターへ</a>
  <a href="JavaScript:L('start',hitAndBlow);set(BACK,town.bar)">カードで遊ぶ</a>
  <a href="JavaScript:L(highDice.start)">サイコロで遊ぶ</a>
  <a href="JavaScript:L(town.plaza);fuga.reset()">店の外に出る</a>`,
  bard4:`「良い一日を」<br>皮肉めいた吟遊詩人の言葉を背中に聞く。
  <a href="JavaScript:L('counter')">カウンターへ</a>
  <a href="JavaScript:L('start',hitAndBlow);set(BACK,town.bar)">カードで遊ぶ</a>
  <a href="JavaScript:L('start',highDice)">サイコロで遊ぶ</a>
  <a href="JavaScript:L('plaza',town);fuga.reset()">店の外に出る</a>`,

  dice:`「『ハイダイス』」`
};


var BACK=para.p0;
