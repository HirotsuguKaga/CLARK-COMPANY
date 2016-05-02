$(document).foundation();

$(function() {		//ページトップへ戻るボタン
    var showFlag = false;
    var topBtn = $('#page-top');    
    topBtn.css('bottom', '-100px');
    var showFlag = false;
    //スクロールが300に達したらボタン表示
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            if (showFlag == false) {
                showFlag = true;
                topBtn.stop().animate({'bottom' : '50px'}, 200); 
            }
        } else {
            if (showFlag) {
                showFlag = false;
                topBtn.stop().animate({'bottom' : '-100px'}, 200); 
            }
        }
    });
    //スクロールしてトップ
    topBtn.click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
        return false;
    });
});

var browserLanguage = function() {
  var ua = window.navigator.userAgent.toLowerCase();
  try {
    // chrome
    if( ua.indexOf( 'chrome' ) != -1 ){
      return ( navigator.languages[0] || navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2);
    }
    // それ以外
    else{
      return ( navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2);
    }
  }
  catch( e ) {
    return undefined;
  }
}