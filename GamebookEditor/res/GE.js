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
        const id = 'p' + text;
        return '<h' + level + ' id="' + id + '">' + text + '</h' + level + '>';
    };
    Renderer.prototype.paragraph = function (text) {
        text = text.replace(/^\\/gm, '');  //行頭のバックスラッシュを取り除く
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');  //strongタグを付与
        return '<p>' + text + '</p>';
    };
    Renderer.prototype.linktext = function (text, link) {
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');  //strongタグを付与
        return '<p><a href="#p' + link + '">' + text + '</a></p>';///////////////<<--
    };
    Renderer.prototype.blockquote = function (text) {
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');  //strongタグを付与
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
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');  //strongタグを付与
        return '<li>' + text + '</li>';
    };

    // テキストをトークンに分割するレキサー
const lexer = function(src) {
    const tokens = [];
    const lines = src.split('\n');

    for (let line of lines) {
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
        } else if (line.startsWith('$')) {                             //画像
            const matchImage = line.match(/^\$(.+)/);
            if (matchImage) {
                tokens.push({ type: 'image', text: matchImage[1].trim() });
            }
        } else if (line.trim() === '') {                               //スペース
            tokens.push({ type: 'space' });
        } else if (line.match(/(.*)(\d+)+へ$/)) {                      //リンクテキスト
            matchLink = line.match(/(.*)(\d+)+へ$/);
            tokens.push({ type: 'linktext', link: matchLink[2],text: line });
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
                <style>
                    body {
                        font-family: 'Garamond', 'Times New Roman', serif;
                        background-color: #fffaed;
                        background-image: url(img/paper.webp);
                        color: #000;
                    }
                    a{
                        font-weight: bold;
                        padding-left: 35px;
                    }
                    h1{
                        font-family:;
                        padding-top: 70px;
                        text-align: center;
                    }
                    h2{
                        padding-top: 1em;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-family: 'Garamond', 'Times New Roman', serif;
                        color: #660000;
                        margin: 5px;
                        line-height: 100%;
                    }
                    p {
                        font-size: 1.2em;
                        line-height: 1.2;
                        margin: 0.4em;
                    }
                    li{
                        font-size: 1.2em;
                        padding-left: 30px;
                    }
                    ol{
                        font-size: 1.2em;
                        padding-left: 30px;
                    }
                    blockquote {
                        margin: auto;
                        padding-left: 10px;
                        font-style: italic;
                        color: #000;
                        width: 75%;
                        background: rgba(200,200,200,.5);
                        border-radius: 0px 10px 0px 10px;
                    }
                    code{
                        background: none;
                        font-family:"ヒラギノ丸ゴ Pro W4","ヒラギノ丸ゴ Pro","Hiragino Maru Gothic Pro","ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","HG丸ｺﾞｼｯｸM-PRO","HGMaruGothicMPRO";
                        font-weight: bold;
                        padding: 20px;
                        display: block;
                        margin: auto;
                    }
                    pre {
                        background-color: #f4f4f4;
                        padding: 10px;
                        overflow: auto;
                        font-family: 'Courier New', monospace;
                    }
                    img{
                        margin: auto;
                        display: block;
                        max-width: 80%;
                        max-height: 180px;
                        opacity: 0.8;
                    }
                </style>
            </head>
            <body>
            ${htmlContent}
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
    <style>
        @page { size: b6; margin: 15mm; }
         body {
            font-family: 'Garamond', 'Times New Roman', serif;
            background-color: #fffaed;
            background-image: url(img/paper.webp);
            color: #000;
        }
        a{
            font-weight: bold;
            padding-left: 35px;
        }
        h1{
            font-family:;
            padding-top: 70px;
            text-align: center;
            break-before: page;
        }
        h2{
            padding-top: 1em;
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Garamond', 'Times New Roman', serif;
            color: #660000;
        }
        p {
            font-size: 1.2em;
            line-height: 1.2;
            margin: 0.4em;
        }
        blockquote {
            margin: auto;
            padding-left: 10px;
            font-style: italic;
            color: #000;
            width: 75%;
            background: #eee;
            border-radius: 0px 10px 0px 10px;
        }
        li{
            font-size: 1.2em;
            padding-left: 30px;
        }
        ol{
            font-size: 1.2em;
            padding-left: 30px;
        }
        code{
           background: none;
           font-family:"ヒラギノ丸ゴ Pro W4","ヒラギノ丸ゴ Pro","Hiragino Maru Gothic Pro","ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","HG丸ｺﾞｼｯｸM-PRO","HGMaruGothicMPRO";
           font-weight: bold;
           padding: 20px;
           display: block;
           margin: auto;
        }
        pre {
            background-color: #f4f4f4;
            padding: 10px;
            overflow: auto;
            font-family: 'Courier New', monospace;
        }
        img{
            margin: auto;
            display: block;
            max-width: 80%;
            max-height: 180px;
            opacity: 0.8;
        }
    </style>
</head>
<body onload="window.print()">
${marked(markdownText)}
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
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ゲームブック</title>
    <style>
        body {
            font-family: 'Garamond', 'Times New Roman', serif;
            background-color: #edd;
            background-image: url(img/wall.webp);
            color: #333;
        }
        #container{
            background-color: #fffaed;
            background-image: url(img/paper.webp);
            max-width: 600px;
            margin: 0 auto;
            padding: 15px;
        }
        a{
            font-weight: bold;
            padding-left: 35px;
        }
        h1{
            font-family:;
            padding-top: 90px;
            text-align: center;
        }
        h2{
            padding-top: 1em;
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Garamond', 'Times New Roman', serif;
            color: #660000;
        }
        p {
            font-size: 1.2em;
            line-height: 1.2;
            margin: 0.4em;
        }
        blockquote {
            margin: auto;
            padding-left: 10px;
            font-style: italic;
            color: #000;
            width: 75%;
            background: rgba(200,200,200,.5);
            border-radius: 0px 10px 0px 10px;
        }
        li{
            font-size: 1.2em;
            padding-left: 30px;
        }
        ol{
            font-size: 1.2em;
            padding-left: 30px;
        }
        code{
           background: none;
           font-family:"ヒラギノ丸ゴ Pro W4","ヒラギノ丸ゴ Pro","Hiragino Maru Gothic Pro","ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","HG丸ｺﾞｼｯｸM-PRO","HGMaruGothicMPRO";
           font-weight: bold;
           padding: 20px;
           display: block;
           margin: auto;
        }
        pre {
            background-color: #f4f4f4;
            padding: 10px;
            overflow: auto;
            font-family: 'Courier New', monospace;
        }
        img{
            margin: auto;
            display: block;
            max-width: 80%;
            max-height: 180px;
            opacity: 0.8;
        }
    </style>
</head>
<body><div id="container">
${marked(markdownText)}
</div></body>
</html>`;
    // HTMLファイルをダウンロード
    downloadHTMLFile(htmlContent, fileName + '.html');
});

});
