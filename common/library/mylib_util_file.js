/*
 * ファイル/データ操作ユーティリティ.
 */

    /**
     * URLファイル保存.
     * @param {string} aUrl 保存対象のURL.
     * @param {string} aFilename 保存時のファイル名.
     */
    function saveFile(aUrl, aFilename) {
        console.log("url = " + aUrl);
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
