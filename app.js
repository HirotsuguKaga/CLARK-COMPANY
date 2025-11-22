// pdf-libはindex.htmlで読み込まれているため、グローバル変数としてPDFLibを使用
// import { PDFDocument } from 'pdf-lib'; は不要

// 安全を期した最大ファイルサイズ: 8MB (8 * 1024 * 1024 バイト)
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

const pdfFileElement = document.getElementById('pdfFile');
const downloadLinksDiv = document.getElementById('downloadLinks');
const statusDiv = document.getElementById('status');

// pdf-libが読み込まれた後に、ファイル入力を有効化する
// (pdf-libは非同期で読み込まれるため、念のため遅延させる)
document.addEventListener('DOMContentLoaded', () => {
    // 実際にはCDN読み込みに依存するが、DOMが準備できた時点でメッセージを更新
    statusDiv.textContent = '準備完了。PDFファイルを選択してください。';
    statusDiv.className = 'status success';
    pdfFileElement.disabled = false;
});


pdfFileElement.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    statusDiv.textContent = `「${file.name}」の分割を開始します...`;
    statusDiv.className = 'status info';
    downloadLinksDiv.innerHTML = '';
    
    try {
        // 1. 元のPDFを読み込む
        const arrayBuffer = await file.arrayBuffer();
        const originalPdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const totalPages = originalPdfDoc.getPageCount();
        
        let startPage = 0;
        let partNumber = 1;

        // すべてのページを処理するまでループ
        while (startPage < totalPages) {
            let currentPdfDoc = await PDFLib.PDFDocument.create();
            let currentPage = startPage;
            let pageCountInPart = 0;
            
            while (currentPage < totalPages) {
                // ページをコピーし、現在のドキュメントに追加
                const [copiedPage] = await currentPdfDoc.copyPages(originalPdfDoc, [currentPage]);
                currentPdfDoc.addPage(copiedPage);
                pageCountInPart++;
                
                // ページ追加後のサイズをチェック (近似値)
                // save()はメモリ上でエンコードし、バイト配列を返します。
                const currentBytes = await currentPdfDoc.save();
                
                if (currentBytes.length > MAX_SIZE_BYTES) {
                    // ?? サイズオーバー: 最後に加えたページを削除し、このチャンクを確定
                    currentPdfDoc.removePage(currentPdfDoc.getPageCount() - 1);
                    pageCountInPart--;
                    
                    if (currentPdfDoc.getPageCount() === 0) {
                        // 1ページで既に8MBを超えている場合、このページ単体で保存して次のページへ進む
                        // (ただし、この場合はGoogle翻訳の制限は超えてしまう)
                        const singlePageDoc = await PDFLib.PDFDocument.create();
                        const [singleCopiedPage] = await singlePageDoc.copyPages(originalPdfDoc, [currentPage]);
                        singlePageDoc.addPage(singleCopiedPage);
                        await saveChunk(singlePageDoc, partNumber, file.name, downloadLinksDiv, `（※1ページで8MB超）`);
                        
                        startPage = currentPage + 1; // 次のページから開始
                        partNumber++;
                        break;
                    }
                    
                    // チャンクをファイルとして保存
                    await saveChunk(currentPdfDoc, partNumber, file.name, downloadLinksDiv);

                    // 次のチャンクはサイズオーバーの原因となったページから開始
                    startPage = currentPage;
                    partNumber++;
                    break;
                }
                
                // 制限内: 次のページへ
                currentPage++;
            }
            
            // ループが最後まで完了した場合 (最後のチャンク)
            if (currentPage === totalPages) {
                if (currentPdfDoc.getPageCount() > 0) {
                    await saveChunk(currentPdfDoc, partNumber, file.name, downloadLinksDiv);
                }
                startPage = totalPages; // 処理終了
            }
        }
        
        statusDiv.textContent = '?? 分割が完了しました！ダウンロードリンクをご確認ください。';
        statusDiv.className = 'status success';

    } catch (error) {
        console.error(error);
        statusDiv.textContent = `?? エラーが発生しました: ${error.message}`;
        statusDiv.className = 'status error';
    }
});

/**
 * PDFドキュメントをバイト配列として取得し、ダウンロードリンクを生成します。
 */
async function saveChunk(pdfDoc, partNum, originalFileName, container, note = '') {
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // ダウンロードリンクを作成
    const url = URL.createObjectURL(blob);
    const fileName = `${originalFileName.replace('.pdf', '')}_part${partNum}.pdf`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.textContent = `${fileName} (${(blob.size / (1024 * 1024)).toFixed(2)} MB) ${note}`;
    
    const li = document.createElement('li');
    li.appendChild(a);
    
    const ul = container.querySelector('ul') || document.createElement('ul');
    if (!container.querySelector('ul')) {
        container.innerHTML = ''; // "ここに分割されたファイルが表示されます"を消す
        container.appendChild(ul);
    }
    ul.appendChild(li);
}