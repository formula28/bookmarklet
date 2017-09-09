/*
 * 文字列操作ユーティリティ.
 */

    /**
     * ファイル名禁止文字置換.
     * @description Windowsファイル名禁止の半角文字を全角文字に置換する.
     * @param{string} str 文字列.
     * @return{string} 置換文字列.
     */
    function replaceFilenameForbidden(str) {
        str = str.replace(/&/g, '＆');
        str = str.replace(/:/g, '：');
        str = str.replace(/\//g, '／');
        str = str.replace(/\\/g, '￥');
        str = str.replace(/\|/g, '｜');
        str = str.replace(/\*/g, '＊');
        str = str.replace(/\?/g, '？');
        str = str.replace(/"/g, '”');
        str = str.replace(/</g, '＜');
        str = str.replace(/>/g, '＞');

        return str;
    }

    /**
     * URLファイル名抽出.
     * @description URLからファイル名部分(拡張子付き)を取得する.
     * @param {string} url URL.
     * @return {string}
     */
    function getFilenameInUrl(url) {
        return url.match(".+/(.+?)([\?#;].*)?$")[1];
    }
    /**
     * URLファイル名抽出.
     * @description URLからファイル名部分(拡張子なし)を取得する.
     * @param {string} url URL.
     * @return {string}
     */
    function getFilenameWithoutExeInUrl(url) {
        return url.match(".+/(.+?)\.[a-z]+([\?#;].*)?$")[1];
    }
    /**
     * URL拡張子抽出.
     * @description URLから拡張子部分を取得する.
     * @param {string} url URL.
     * @return {string}
     */
    function getExeInUrl(url) {
        return url.match(".+/.+?\.([a-z]+)([\?#;].*)?$")[1];
    }

    /**
     * 桁数取得(非負整数10進数).
     * @description 非負整数値の10進数での桁数を取得する.
     * @param {number} aNum 非負整数.
     * @return {number} 非負整数値の10進数での桁数.
     */
    function getDecimalNumberLength(aNum) {
        var ret = 0;
        if (aNum > 0) {
            ret = Math.floor(Math.log(aNum) * Math.LOG10E) + 1;
        } else if (aNum == 0) {
            ret = 1;
        }
        return ret;
    }
    /**
     * 0詰め文字列取得.
     * @description size桁の0詰め文字列を取得する.
     * @param {number} num 非負整数.
     * @param {number} size 桁数.
     * @return {string} size桁の0詰め非負整数文字列.
     */
    function getZeroFillString(num, size) {
        var ret = "";
        if (0 <= num && 0 < size) {
            for (var i=0;i<size-getDecimalNumberLength(num);i++) {
                ret += "0";
            }
        }
        ret += String(num);
        return ret;
    }