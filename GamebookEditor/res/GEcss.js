//////////////////////////////////////  共通CSS // /////////////////////////////////////////////////
const css = `
    body {
        font-family:  'Noto Serif JP', 'Garamond', 'Times New Roman', serif;
        background-color: #edd;
        background-image: url(img/wall.webp);
        margin: 0;
        padding: 0;
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
        padding-left: 20px;
    }
    p {
        font-size: 1.2em;
        line-height: 1.2;
        margin: 0.5em;
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
        font-style: italic;
        background: rgba(200,200,200,.5);
        border-radius: 0px 10px 0px 10px;
        margin: 0 auto;
        width: 75%;
    }
    code{
        background: none;
        font-family:"ヒラギノ丸ゴ Pro W4","ヒラギノ丸ゴ Pro","Hiragino Maru Gothic Pro","ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","HG丸ｺﾞｼｯｸM-PRO","HGMaruGothicMPRO";
        font-weight: bold;
        display: block;
        margin: 0 auto;
        padding: 10px;
        width: 75%;
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
    video{
        max-width: 90%;
    }
    .video{;
        margin: auto;
        display: block;
        text-align: center;
    }
    
    
        body {
            align-items: center;
        }
        #videoLayer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.5s ease;
            z-index: 1000;
        }
        #videoContainer {
            position: relative;
            width: 0;
            height: 80%;
            overflow: hidden;
            transition: width 1s ease;
        }
        #video {
            width: 100%;
            height: 100%;
        }
        #closeButton {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 1001;
        }
        .startButton {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
        }
        .originalVideo {
            display: none;
        }
`