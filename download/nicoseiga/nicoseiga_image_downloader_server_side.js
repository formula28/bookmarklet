/*
ニコニコ静画のイラスト個別ページ閲覧中に実行すると、そのイラストをダウンロードするbookmarkletです。
*/
//(function(){
    /** ルートURI. */
    var root_uri = "//formula25.sakura.ne.jp";
    /** 共通ライブラリのルートURI. */
    var root_com_lib_uri = root_uri + "/bookmarklet/common/library";
    /** このスクリプトのルートURI. */
    var script_root_uri = root_uri + "/bookmarklet/download/nicoseiga";
    /** コンテンツダウンロード用プログラム. */
    var dl_proxy_uri = script_root_uri + "/dlimage.php";
    
    /* 外部スクリプトの削除. */
    var jss = document.querySelectorAll("script.nicoseiga_image_downloader_subscr");
    if (jss != null && jss.length > 0) {
        jss.forEach(function(value){
            document.body.removeChild(value);
        })
    }
    /* 外部スクリプト追加 start. */
    var scripts = [
        root_com_lib_uri + "/mylib_util_dom.js"
        , root_com_lib_uri + "/mylib_util_str.js"
        , root_com_lib_uri + "/mylib_util_file.js"
        , script_root_uri + "/nicoseiga_image_downloader_meta_data.js"
        , script_root_uri + "/nicoseiga_image_downloader_download_start.js"
    ];
    /** スクリプトを順次読み込み.
        @description 普通にscriptタグ埋め込むと、並列で読み込むが、
        依存関係のあるスクリプトがあるので前のスクリプトが読み込み終わってから、
        次のスクリプトを読み込む.
     */
    var loadScripts = function() {
        var i = 0;
        var loopMain = function(uri) {
            var s = document.createElement("script");
            s.setAttribute("class","nicoseiga_image_downloader_subscr");
            s.setAttribute("src", uri);
            s.onload = function() {
                i=i+1;
                if (i<scripts.length) {
                    loopMain(scripts[i]);
                }
            };
            document.body.appendChild(s);
        };
        loopMain(scripts[i]);
    };
    loadScripts();
    /* 外部スクリプト追加 end. */

    /* 開いているページのdocument. */
    var doc = document;
    if (document.getElementById("originpage")) {
//        doc = document.getElementById("originpage").contentWindow.document;
        doc = originpage.document;
    }

//})();