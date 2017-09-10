/*
 * ファイル/データ操作ユーティリティ.
 */

    /**
     * URLファイル保存.
     * @param {string} aUrl 保存対象のURL.
     * @param {string} aFilename 保存時のファイル名.
     */
    function saveFile(aUrl, aFilename) {
        console.log("filename = " + aFilename);
        if (aUrl != null) {
            var a = document.createElement("a");
            a.href = aUrl;
            if (aFilename != null) {
                a.download = aFilename;
            }
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    /**
     * <img>からBase64エンコード.
     * @param {Element} imgElem 
     * @param {string} mime_type 
     */
    function ImageToBase64(imgElem, mime_type) {
        imgElem.crossOrigin = "Anonymous";
        // New Canvas
        var canvas = document.createElement('canvas');
        canvas.width  = imgElem.width;
        canvas.height = imgElem.height;
        // Draw Image
        var ctx = canvas.getContext('2d');
        ctx.drawImage(imgElem, 0, 0);
        // To Base64
        // ※通常だと、toDataURLでエラーが起きる.セキュリティOFF起動したchromeで利用すること.
        return canvas.toDataURL(mime_type);
    }
    /**
     * DataURLからBlobURL変換
     * @description (画像の)DataURLからBlobURLへ変換する.
     * @param {URL} dataUrl (画像の)DataURL.
     * @return {string} BlobURL.
     */
    function convertDataUrlToBlobUrl(dataUrl) {
        var bin = atob(dataUrl.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        // Blobを作成
        var blob = new Blob([buffer.buffer], {type: "image/png"});
        return window.URL.createObjectURL(blob);
    }
    /**
     * DataURLからArrayBuffer変換.
     * @description DataURLからArrayBufferへ変換する.
     * @param {URL} dataUrl DataURL.
     * @return {string} BlobURL.
     */
    function convertDataUrlToArrayBuffer(dataUrl) {
        var bin = atob(dataUrl.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        return buffer.buffer;
    }
