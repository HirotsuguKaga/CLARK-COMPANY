const TEXT_KEY = 'textareaContent';
const SAVE_WARNING_KEY = 'dontShowSaveWarning';
const LOAD_WARNING_KEY = 'dontShowLoadWarning';
const DELETE_WARNING_KEY = 'dontShowDeleteWarning';

const saveWarningDiv = document.getElementById('saveWarning');
const loadWarningDiv = document.getElementById('loadWarning');
const deleteWarningDiv = document.getElementById('deleteWarning');
const settingsDiv = document.getElementById('settings');
const alertDiv = document.getElementById('alert');

let saveCallback = null;
let loadCallback = null;
let deleteCallback = null;

function deleteText() {        // テキストを全削除
    checkDeleteWarning(() => {
        localStorage.removeItem(TEXT_KEY);
        document.getElementById('editor').value = '';
        showAlert('データが削除されました。');
    });
}

function saveText() {        // ブラウザに保存
    checkSaveWarning(() => {
        const text = document.getElementById('editor').value;
        localStorage.setItem(TEXT_KEY, text);
        showAlert('データが保存されました。');
    });
}

function loadText() {        // ブラウザから読み込み
    checkLoadWarning(() => {
        const text = localStorage.getItem(TEXT_KEY);
        if (text !== null) {
            document.getElementById('editor').value = text;
        }
        showAlert('データが読み込まれました。');
    });
}

function checkSaveWarning(proceedCallback) {  //警告ウィンドウの表示の可否を保存
    if (localStorage.getItem(SAVE_WARNING_KEY) === 'true') {
        proceedCallback();
    } else {
        saveCallback = proceedCallback;
        saveWarningDiv.style.display = 'block';
    }
}

function checkLoadWarning(proceedCallback) {  //警告ウィンドウの表示の可否を読み込み
    if (localStorage.getItem(LOAD_WARNING_KEY) === 'true') {
        proceedCallback();
    } else {
       loadCallback = proceedCallback;
       loadWarningDiv.style.display = 'block';
    }
}

function checkDeleteWarning(proceedCallback) {  //警告ウィンドウの非表示を解除
   if (localStorage.getItem(DELETE_WARNING_KEY) === 'true') {
       proceedCallback();
   } else {
       deleteCallback = proceedCallback;
       deleteWarningDiv.style.display = 'block';
   }
}

function proceedSave() {
    if (document.getElementById('dontShowSaveAgain').checked) {
        localStorage.setItem(SAVE_WARNING_KEY, 'true');
    }
    saveWarningDiv.style.display = 'none';
    if (saveCallback) {
        saveCallback();
    }
}

function cancelSave() {
    saveWarningDiv.style.display = 'none';
}

function proceedLoad() {
    if (document.getElementById('dontShowLoadAgain').checked) {
       localStorage.setItem(LOAD_WARNING_KEY, 'true');
    }
    loadWarningDiv.style.display = 'none';
    if (loadCallback) {
       loadCallback();
    }
}

function cancelLoad() {
    loadWarningDiv.style.display = 'none';
}

function proceedDelete() {
    if (document.getElementById('dontShowDeleteAgain').checked) {
       localStorage.setItem(DELETE_WARNING_KEY, 'true');
    }
    deleteWarningDiv.style.display = 'none';
    if (deleteCallback) {
        deleteCallback();
    }
}

function cancelDelete() {
    deleteWarningDiv.style.display = 'none';
}

function resetWarnings() {
    localStorage.removeItem(SAVE_WARNING_KEY);
    localStorage.removeItem(LOAD_WARNING_KEY);
    localStorage.removeItem(DELETE_WARNING_KEY);
    closeSettings();
    alert('警告の非表示設定がリセットされました。');
}

function toggleSettings() {
    if (settingsDiv.style.display === 'none' || settingsDiv.style.display === '') {
        settingsDiv.style.display = 'block';
    } else {
        settingsDiv.style.display = 'none';
    }
}

function closeSettings() {  //設定ウィンドウを閉じる
    settingsDiv.style.display = 'none';
}

function showAlert(message) {
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    alertDiv.style.opacity = '1';
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.style.display = 'none', 1000);
    }, 2000);
}

var fileName = "gamebook";

///////////////// テキストファイルを読み込む ////////////////////
document.getElementById('loadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = file.name;//ファイル名表示を変更
        fileName = file.name.replace(/\.[^/.]+$/, "");

        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            const uint8Array = new Uint8Array(arrayBuffer);

            // エンコーディングを検出
            const encoding = Encoding.detect(uint8Array);

            console.log("Detected encoding: " + encoding);

            // バイト配列を文字列に変換
            const unicodeString = Encoding.convert(uint8Array, {
                to: 'UNICODE',
                from: encoding,
                type: 'string'
            });

            document.getElementById('editor').value = unicodeString;
            
            // テキストエリアに貼り付けが終わったタイミングでカスタムイベントを発生させる
            const event = new Event('textPasted');
            document.getElementById('editor').dispatchEvent(event);
        };
        reader.readAsArrayBuffer(file);
    }
        // input要素の値をリセットして同じファイルの再読み込みを可能にする
    event.target.value = '';
});

///////////////////////////// marked関数を定義 ////////////////////////////////////////////////////////
function marked(text) {
    // marked.Rendererクラスの定義
    const Renderer = function() {};
    Renderer.prototype.heading = function (text, level) { // 見出し要素(h1)にidを付与
    console.log(text);
        if (/^\d/.test(text)) {
            // 行頭に数字が続く場合
            id = text.match(/^(\d+)/)[1]; // 数字部分を抽出
        } else {
            id = text;
        }
        return '<h' + level + ' id="p' + id + '">' + text + '</h' + level + '>';
    };
    Renderer.prototype.paragraph = function (text) {
        text = text.replace(/^\\/gm, '');  //行頭のバックスラッシュを取り除く
        return '<p>' + text + '</p>';
    };
    Renderer.prototype.linktext = function (text, link) {        //リンクテキスト
        if (text.match(/^\$(.*\.mp4).*$/)) {              //動画付きのリンクを作成
            const matchVideo = text.replace(/\.[^/.]+$/, "");//動画ファイル名を取得
            const video = matchVideo.match(/^\$(.+)/);;//動画ファイル名を取得
            const videoName = video[1].trim();
                console.log(videoName);
            text = text.replace(/.*\.mp4/, '');
            return `<p><a href="#p` + link + `" onclick="startVideo('` + videoName + `')">` + text + `</a></p><video id="` + videoName + `" class="originalVideo"><source src="img/` + videoName + `.mp4" type="video/mp4">お使いのブラウザは動画タグに対応していません。</video>`;    
        } else {  
            return '<p><a href="#p' + link + '">' + text + '</a></p>';   //通常のリンクを返す
        }
    };
    Renderer.prototype.blockquote = function (text) {
        return '<blockquote>' + text + '</blockquote>';
    };
    Renderer.prototype.code = function (code, language) {
        return '<code>' + code + '</code>';
    };
    Renderer.prototype.list = function (body, ordered) {
        const type = ordered ? 'ol' : 'ul';
        return '<' + type + '>' + body + '</' + type + '>';
    };
    Renderer.prototype.listitem = function (text) {
        return '<li>' + text + '</li>';
    };

    // テキストをトークンに分割するレキサー
const lexer = function(src) {
    const tokens = [];
    const lines = src.split('\n');

    for (let line of lines) {
          // strongタグを付与する
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          // リンクタグを付与する
        line = line.replace(/\[(.*?)\]/g, '<a href="#p$1" class="inline">$1</a>');
          // 二個の連続したバックスラッシュを一意なプレースホルダーに置き換える
        line = line.replace(/([^\\\\])\\\\/g, '&bsol;&bsol;');
          // 行頭や行末以外にある単独のバックスラッシュを改行タグに置き換える
        line = line.replace(/([^\\])\\([^\\])/g, '$1<br>$2');
          // エスケープしたバックスラッシュを元に戻す
        line = line.replace(/&bsol;&bsol;/g, '\\');

        if (line.startsWith('#')) {                                    //見出し
            const match = line.match(/^(#{1,6})+(.*)$/);
            if (match) {
                tokens.push({ type: 'heading', level: match[1].length, text: match[2] });
            }
        } else if (line.startsWith('>')) {                             //引用
            tokens.push({ type: 'blockquote', text: line.slice(1).trim() });
        } else if (line.startsWith('_')) {                             //コード
            tokens.push({ type: 'code', text: line.slice(1) });
        } else if (line.startsWith('-')) {                             //リストの部品
            tokens.push({ type: 'listitem', text: line.slice(1) });
        } else if (/^\d+\.\s/.test(line)) {
            tokens.push({ type: 'listitem', ordered: true, text: line.slice(line.indexOf('.') + 1).trim() });
        } else if (line.match(/(.*)(\d+)+へ$/)) {                      //リンクテキスト
            matchLink = line.match(/(.*)(\d+)+へ$/);
            tokens.push({ type: 'linktext', link: matchLink[2],text: line });
        } else if (line.startsWith('$')) {                             //画像・動画
            // 行頭の $ の直後に拡張子が mp4 のファイル名をビデオタグに変換
            const matchVideo = line.match(/^\$(.*\.mp4)$/);
            const matchImage = line.match(/^\$(.+)/);
            if (matchVideo) {
                tokens.push({ type: 'video', text: matchVideo[1].trim() });
            }else if (matchImage) {
                tokens.push({ type: 'image', text: matchImage[1].trim() });
            }
        } else if (line.trim() === '') {                               //スペース
            tokens.push({ type: 'space' });
        } else {                                                       //平文
            tokens.push({ type: 'paragraph', text: line });
        }
    }
    return tokens;
};

    // トークンを処理するパーサー
const parser = function(tokens, options) {
    const renderer = new Renderer();
    let out = '', token;
    while (token = tokens.shift()) {
        switch (token.type) {
            case 'heading':
                out += renderer.heading(token.text, token.level);
                break;
            case 'blockquote':
                out += renderer.blockquote(token.text);
                break;
            case 'code':
                out += renderer.code(token.text, token.language);
                break;
            case 'list':
                out += renderer.list(token.body, token.ordered);
                break;
            case 'listitem':
                out += renderer.listitem(token.text);
                break;
            case 'image':
                out += '<p><img src="img/' + token.text + '.webp" alt="' + token.text + '"></p>';
                break;
            case 'video':
                out += '<div class="video"><video controls><source src="img/' + token.text + '" type="video/mp4">Your browser does not support the video tag.</video></div>';
                break;
            case 'linktext':
                out += renderer.linktext(token.text, token.link);
                break;
            case 'paragraph':
                out += renderer.paragraph(token.text);
                break;
        }
    }
            return out;
};
        // 解析されレンダリングされたマークダウンを返す
        return parser(lexer(text));
}

///////////////////////////////////// プレビュー用のHTMLを作成 /////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const downloadHTMLButton = document.getElementById("downloadHTML");
const downloadPDFButton = document.getElementById("downloadPDF");
const convertFullWidthAlnumCheckbox = document.getElementById("convertFullWidthAlnum");

 // 全角の英数字や特殊記号を半角に変換する関数
function convertFullWidthAlnumToHalfWidth(text) {
    return text.replace(/[Ａ-Ｚａ-ｚ０-９＄＃％]/g, function(ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
    });
}
 ///// テキストエリアの内容をプレビューに反映する関数 //////
function renderPreview() {
    let markdownText = editor.value;

     // チェックボックスがチェックされている場合、全角の英数字や特殊記号を半角に変換
    if (convertFullWidthAlnumCheckbox.checked) {
        markdownText = convertFullWidthAlnumToHalfWidth(markdownText);
    }

    // マークダウンをHTMLに変換
    const htmlContent = marked(markdownText);

    const fullHtmlContent = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>プレビュー</title>
                <style>` + css + `</style>
            </head>
            <body><div id="container">
            ${htmlContent}</div>
            </body>
            </html>`;

    // プレビューエリアに反映
    preview.srcdoc = fullHtmlContent;
}

// テキストエリアの内容が変わるたびにプレビューを更新
editor.addEventListener("input", renderPreview);
// チェックボックスの状態が変わるたびにプレビューを更新
convertFullWidthAlnumCheckbox.addEventListener("change", renderPreview);
// テキストファイルを読み込むたびにプレビューを更新
document.getElementById('editor').addEventListener('textPasted', renderPreview); 

////////////////////////////// PDF印刷用コンテンツを生成 /////////////////////////////////
// HTMLファイルを別タブで開き、印刷ダイアログを表示 /////
downloadPDFButton.addEventListener("click", () => {
    let markdownText = editor.value;
     // チェックボックスがチェックされている場合、全角の英数字や特殊記号を半角に変換
    if (convertFullWidthAlnumCheckbox.checked) {
        markdownText = convertFullWidthAlnumToHalfWidth(markdownText);
    }
        const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>` + fileName + `</title>
    <style>@page { size: b6; margin: 15mm; }` + css + `
    h1{page-break-before: always;}</style>
</head>
<body onload="window.print()">
<div id="container">
${marked(markdownText)}
    <small style="text-align:right; margin-top:200px; display:block; font-size:0.9em;">powered by Gamebook Editor by <a href="https://clark.booth.pm/" style="padding:0; font-weight:none; text-decoration:none;">Clark & Company</a> &copy;2024</small>
</div>
</body>
</html>`;
    // 別タブでHTMLを開き、印刷ダイアログを表示
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
});

// 初期プレビューを表示
renderPreview();

//////////////////////// テキストファイルをダウンロードする関数////////////////////////////////////////////////
document.querySelector('#downloadText').addEventListener('click', () => {
    const output = document.querySelector('#editor').value;
    downloadAsFile(output, fileName);
});

function downloadAsFile(text, filename) {
  const blobText = new Blob([text], { type: "text/plain"});
  const url = URL.createObjectURL(blobText);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

//////////////////////// HTMLファイルとして出力する関数////////////////////////////////////////////////////////
function downloadHTMLFile(content, filename) {
    // Blobを作成
    const blob = new Blob([content], { type: 'text/html' });
    // ダウンロードリンクを作成
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    // リンクをクリックしてダウンロードを開始
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ダウンロードボタンのイベントリスナー
downloadHTMLButton.addEventListener("click", () => {
    let markdownText = editor.value;
     // チェックボックスがチェックされている場合、全角の英数字や特殊記号を半角に変換
    if (convertFullWidthAlnumCheckbox.checked) {
        markdownText = convertFullWidthAlnumToHalfWidth(markdownText);
    }

    
    // HTMLコンテンツを生成
    const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>` + fileName + `</title>
    <style>` + css + `
    h1{margin-top: 210px;}</style>
</head>
<body><div id="container">
    <div id="videoLayer">
        <div id="videoContainer">
            <button id="closeButton">×</button>
            <video id="video" controls>
                <source src="" type="video/mp4">
                お使いのブラウザは動画タグに対応していません。
            </video>
        </div>
    </div>
    ${marked(markdownText)}
    <small style="text-align:right; margin-top:200px; display:block; font-size:0.9em;">powered by Gamebook Editor by <a href="https://clark.booth.pm/" style="padding:0; font-weight:none; text-decoration:none;">Clark & Company</a> &copy;2024</small>
</div>
<script>` + innerScript + `</script></body>
</html>`;

    // HTMLファイルをダウンロード
    downloadHTMLFile(htmlContent, fileName + '.html');
});

});
/////////////////////////// 出力するHTML内に記述されるスクリプト ////////////////////////////////////////////
const innerScript = `
const videoLayer = document.getElementById('videoLayer');
const videoContainer = document.getElementById('videoContainer');
const video = document.getElementById('video');
const closeButton = document.getElementById('closeButton');
let currentVideo;

function startVideo(videoId) {
    if (currentVideo) {
        currentVideo.style.display = 'block';
    }
    currentVideo = document.getElementById(videoId);
    currentVideo.style.display = 'none';
    video.src = currentVideo.querySelector('source').src;
    videoLayer.style.visibility = 'visible';
    videoLayer.style.opacity = '1';
    setTimeout(() => {
        videoContainer.style.width = '100%';
    }, 100);
    videoContainer.addEventListener('transitionend', () => {
        if (videoContainer.style.width === '100%') {
            video.play();
        }
    }, { once: true });
}

const closeVideo = () => {
    video.pause();
    videoLayer.style.opacity = '0';
    setTimeout(() => {
        videoLayer.style.visibility = 'hidden';
        videoContainer.style.width = '0';
        if (currentVideo) {
            currentVideo.style.display = 'none';
        }
    }, 500);
};

closeButton.addEventListener('click', closeVideo);
videoLayer.addEventListener('click', (event) => {
    if (event.target === videoLayer) {
        closeVideo();
    }
});`