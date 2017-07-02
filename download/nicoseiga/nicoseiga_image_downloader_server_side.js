/*
ニコニコ静画のイラスト個別ページ閲覧中に実行すると、そのイラストをダウンロードするbookmarkletです。
*/
//(function(){

    /* 開いているページのdocument. */
    var doc = document;
    if (document.getElementById("originpage")) {
//        doc = document.getElementById("originpage").contentWindow.document;
        doc = originpage.document;
    }

    /* 画像メタデータ start. */
    /* ページのタイトル(String). */
    var page_title = getElementText(doc.querySelector("title"));
    /* ユーザー名(String). */
    var user_name = getElementText(doc.querySelector("li.user_name strong"));
    if (user_name == "null") {
        user_name = getElementText(doc.querySelector("div.illust_user_name strong"));
    }
    /* 画像タイトル(String). */
    var image_title = getElementText(doc.querySelector("h1.title"));
    if (image_title == "null") {
        image_title = getElementText(doc.querySelector("li.active span[itemprop='title']"));
    }
    /* 画像のタグ配列(String Array). */
    var tags = Video.tags;
    printMetaData();

    function printMetaData() {
        console.log(page_title);
        console.log(user_name);
        console.log(image_title);
        console.log(tags);
    }
    /* 画像メタデータ end. */

    /* ユーティリティメソッド start. */
    /* html elementをStringに変換. */
    function getElementText(element) {
        var ret = 'null';
        if(element != null){
            ret = element.textContent;
        }
        return ret;
    }
    /* 属性値設定処理. */
    function changeAttr(elem,attr,attrValue) {
        if (elem != null && attr != null) {
            elem.setAttribute(attr,attrValue);
        }
    }

    /* URLからファイル名部分(拡張子付き)取得. */
    function getFilenameInUrl(url) {
        return url.match(".+/(.+?)([\?#;].*)?$")[1];
    }
    /* URLからファイル名部分(拡張子なし)取得. */
    function getFilenameWithoutExeInUrl(url) {
        return url.match(".+/(.+?)\.[a-z]+([\?#;].*)?$")[1];
    }
    /* URLから拡張子部分取得. */
    function getExeInUrl(url) {
        return url.match(".+/.+?\.([a-z]+)([\?#;].*)?$")[1];
    }
    function getIllustId() {
        return window.location.href.match(".+/im(.+?)([\?#;].*)?$")[1]
    }
    /* ユーティリティメソッド end. */

    /* イラストIDからダウンロード用ファイル名生成. */
    function getDownloadFilename(illust_id) {
        var ret = "["
            + user_name
            + "]"
            + image_title
            + "_"
            + illust_id;
        if (tags != null && tags.length > 0) {
            var tagtext = "[" + tags[0];
            for(var i=1;i < tags.length;i++){
                tagtext += ' ' + tags[i];
            }
            tagtext += "]";
            ret += tagtext;
        }
        //ret += "." + org_exe;
        // ファイル名禁止文字を置換
        ret = ret.replace(/&/g, '＆');
        ret = ret.replace(/:/g, '：');
        ret = ret.replace(/\//g, '／');
        ret = ret.replace(/\\/g, '￥');
        ret = ret.replace(/\|/g, '｜');
        ret = ret.replace(/\*/g, '＊');
        ret = ret.replace(/\?/g, '？');
        ret = ret.replace(/"/g, '”');
        ret = ret.replace(/</g, '＜');
        ret = ret.replace(/>/g, '＞');
        console.log(ret);
        return ret;
    }

    /* 画像ダウンロード. */
    function downloadImage() {
        php_base_url = "//formula25.sakura.ne.jp/bookmarklet/download/nicoseiga/dlimage.php";
        illust_id = getIllustId();
        console.log(illust_id);
        if (illust_id != null) {
            filename = getDownloadFilename(illust_id);
            console.log(filename);
            if (filename != null) {
                saveFile(php_base_url + "?id=" + illust_id + "&dlname=" + filename, filename);
            }
        }
    }
    /* ファイル保存. */
    function saveFile(aUrl, aFilename) {
        console.log(aUrl, aFilename);
        if (aUrl != null) {
            var a = doc.createElement("a");
            a.href = aUrl;
            if (aFilename != null) {
                a.download = aFilename;
            }
            a.target = "_blank";
            doc.body.appendChild(a);
            a.click();
            doc.body.removeChild(a);
        }
    }

    printMetaData();
    downloadImage();
//})();