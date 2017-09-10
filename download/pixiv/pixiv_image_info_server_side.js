/*
pixivのイラスト個別ページ閲覧中に実行すると、そのイラストのメタデータを別ページに表示するbookmarkletです。
*/
//(function(){
    /** ルートURI. */
    var root_uri = "//formula25.sakura.ne.jp";
    /** コンテンツダウンロード用プログラム. */
    var dl_proxy_uri = "//formula25.sakura.ne.jp/bookmarklet/download/common/url_download.php";
    /* このスクリプトのルートURI. */
    var script_root_uri = root_uri + "/bookmarklet/download/pixiv";

    /* ライブラリのinclude. */
    ["jszip.min.js"
    , "mylib_util_dom.js"
    , "mylib_util_str.js"
    , "mylib_util_file.js"
    , "mylib_util_logic.js"
    ].forEach(function(value) {
        var script = document.createElement("script");
        script.src = root_uri + "/bookmarklet/common/library/" + value;
        document.body.appendChild(script);
    });
    /* 分割スクリプトのinclude. */
    ["pixiv_imge_info_image_meta_data.js"   // pixiv 画像メタデータ取得.
    , "pixiv_image_info_append_dom.js"      // DOM追加処理.
    ].forEach(function(value) {
        var script = document.createElement("script");
        script.src = script_root_uri + "/" + value;
        document.body.appendChild(script);
    });

    /* プロキシURL取得. */
    function getProxyUrl(url, filename) {
        return dl_proxy_uri+"?url="+url+"&dlname="+filename;
    }
    /* URLからダウンロード用ファイル名取得. */
    function getDownloadFilename(url) {
        var org_fn = getFilenameWithoutExeInUrl(url);
        var org_exe = getExeInUrl(url);
        var ret = "["
            + user_name
            + "]"
            + image_title
            + "_"
            + org_fn;
        if (tags != null && tags.length > 0) {
            var tagtext = "[" + tags[0];
            for(var i=1;i < tags.length;i++){
                tagtext += ' ' + tags[i];
            }
            tagtext += "]";
            ret += tagtext;
        }
        ret += "." + org_exe;
        // ファイル名禁止文字を置換
        ret = replaceFilenameForbidden(ret);
        console.log(ret);
        return ret;
    }

    /* 画像ダウンロード. */
    var isDlProxy = true;
    function downloadIndivImage(url, filename) {
        if (isDlProxy) {
            downloadIndivImageProxy(url, filename);
        } else {
            downloadIndivImageAsync(url, filename);
        }
    }
    function downloadIndivImageProxy(url, filename) {
        saveFile(getProxyUrl(url, filename), filename);
    }
    function downloadIndivImageAsync(url, filename) {
        console.log(url, filename);
        if (url != null && filename != null) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function(e) {
                console.log("非同期通信による画像ダウンロード成功.");
                var blob_url = window.URL.createObjectURL(xhr.response);
                saveFile(blob_url, filename);
            }
            xhr.onerror = function(e) {
                console.log("readyState:" + xhr.readyState);
                console.log("response:" + xhr.response);
                console.log("status:" + xhr.status);
                console.log("statusText:" + xhr.statusText);
                console.log("非同期通信による画像ダウンロード失敗.");
                saveFile(url, filename);
            }
            // xhr.open("GET", url, true);
            var proxy_url = getProxyUrl(url, filename);
            console.log(proxy_url);
            xhr.open("GET", proxy_url, true);
            // xhr.withCredentials = true;
            // auth = btoa(user + ":" passwd);
            // console.log(auth);
            // xhr.setRequestHeader("Authorization", "Basic " + auth);
            xhr.responseType = "blob";
            xhr.send();
        }
    }

    /* まとめて画像ダウンロード start. */
    var zip_blob_url = null;
    var zip;
    /* 全画像ダウンロード開始. */
    function downloadAllImage() {
        if (isParsedImageUrlDecision()) {
            zip = new JSZip();
            changeAllDlBtn(1, " 0/" + page_count);
            zip_blob_url = null;
            downloadImage(0);
        }
    }
    /* count番目の画像ダウンロード開始. */
    function downloadImage(count) {
        try {
            var url = getDownloadImageUrl(count);
            var filename = getDownloadFilename(url);
            // 画像ダウンロード.
            var img = document.createElement("img");
            img.onload = function() {
                // 読み込み完了時.
                console.log("img.onload " + filename);
                zip.file(filename, convertDataUrlToArrayBuffer(ImageToBase64(img, "image/png")));
                if (count+1 < page_count) {
                    changeAllDlBtn(1, " " + (count+1) + "/" + page_count);
                    // 次の画像をダウンロード.
                    downloadImage(count+1);
                } else {
                    // 最後までダウンロード完了.
                    zip_blob_url = window.URL.createObjectURL(zip.generate({ type: 'blob' }));
                    changeAllDlBtn(2, "");
                }
            }
            img.src = getProxyUrl(url, filename);
        } catch (e) {
            changeAllDlBtn(3, "");
            console.log(e);
        }
    }
    /* まとめて画像ダウンロード end. */

    /* ページ書き出し実行(外部スクリプトのロード完了後に実行するようスリープ). */
    setTimeout(function(){appendHtml();}, 1000);
//})();