/*
twitterタイムラインに表示された画像をダウンロードするbookmarkletです。
twitterは、Content Security Policyによって外部scriptの追加が抑制されるので、
ページをローカルにダウンロードするなど、Content Security Policyがかからない状態にして実行する。
*/
//(function(){
    /* ルートURI. */
    var root_uri = "http://formula25.sakura.ne.jp";
    /* コンテンツダウンロード用プログラム. */
    var dl_proxy_uri = "http://formula25.sakura.ne.jp/bookmarklet/download/common/url_download.php";

    /* ライブラリのinclude. */
    ["jszip.min.js", "jquery-3.2.1.min.js"].forEach(function(value) {
        var script = document.createElement("script");
        script.src = root_uri + "/bookmarklet/common/library/" + value;
        document.body.appendChild(script);
    });

    /* <style>~</style>. */
    function appendStyle(parent) {
        var elem = parent.querySelector("style.twitter_image_download");
        if (elem != null) {
            parent.removeChild(elem);
        }
        var text = "";
        text += '.Icon--download::before {content:"\f01a";}\n';

        var textNode = document.createTextNode(text);
        var style = document.createElement('style');
        style.setAttribute("class","twitter_image_download");
        style.appendChild(textNode);
        parent.appendChild(style);
    }

    /* ダウンロードボタン追加.
        parent: 親要素.
        key: 画像つきtweetの何番目かを表すkey.
     */
    function appendDlBtn(parent, key) {
        var elem = parent.querySelector("div.twitter_image_download");
        if (elem != null) {
            parent.removeChild(elem);
        }

        var outer = document.createElement("div");
        // outer.setAttribute("class","twitter_image_download ProfileTweet-action ProfileTweet-action--reply");
        outer.setAttribute("class","twitter_image_download ProfileTweet-action");
        outer.setAttribute("onClick","downloadImage(" + key + ")");
        parent.appendChild(outer);

        var btn = document.createElement("button");
        // btn.setAttribute("class","ProfileTweet-actionButton js-actionButton js-actionReply");
        btn.setAttribute("class","ProfileTweet-actionButton js-actionButton");
        // btn.setAttribute("data-modal","ProfileTweet-reply");
        btn.setAttribute("type","button");
        outer.appendChild(btn);

        var btnIcon = document.createElement("div");
        btnIcon.setAttribute("class","IconContainer js-tooltip");
        btnIcon.setAttribute("title","ダウンロード");
        btn.appendChild(btnIcon);

        var iconImg = document.createElement("span");
        iconImg.setAttribute("class","Icon Icon--medium Icon--download");
        btnIcon.appendChild(iconImg);

        var btnText = document.createElement("span");
        btnText.setAttribute("class","ProfileTweet-actionCount ");
        btnText.appendChild(document.createTextNode("ダウンロード"));
        btn.appendChild(btnText);
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
    /* URLからダウンロード用ファイル名取得. */
    function getDownloadFilename(url, user_name, title) {
        if (title == undefined || title == null) title = "";
        var ret = "["
            + user_name
            + "]"
            + title
            + "_"
            + getFilenameInUrl(url);
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

    /* プロキシURL取得. */
    function getProxyUrl(url, filename) {
        return dl_proxy_uri+"?url="+url+"&dlname="+filename;
    }
    /* ファイル保存. */
    function saveFile(aUrl, aFilename) {
        console.log(aUrl, aFilename);
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
    /* 画像ダウンロード.
        key: 画像つきtweetの何番目かを表すkey.
     */
    function downloadImage(key) {
        console.log(key);
        var value = $(tweet_list_have_image[key]);
        var user_name = value.find("div.js-stream-tweet").attr("data-name");
        var tweet = value.find("div.js-tweet-text-container")[0].innerText;
        // var img_url = value.find("div.AdaptiveMedia-photoContainer").attr("data-image-url");
        // var file_name = getDownloadFilename(img_url, user_name, tweet);
        
        var images = value.find("div.AdaptiveMedia-photoContainer");
        if (images) {
            Object.keys(images).forEach(function(key) {
                console.log(key);
                var img_url = $(images[key]).attr("data-image-url");
                var file_name = getDownloadFilename(img_url, user_name, tweet);
                saveFile(getProxyUrl(img_url + ":orig", file_name), file_name);
            });
        }
    }

    /* スタイルシート追加. */
    appendStyle(document.head);

    /* ダウンロードボタン追加. */
    var tweet_list_have_image = $("li.js-stream-item:has(div.AdaptiveMedia-photoContainer img)");
    console.log(tweet_list_have_image);
    if (tweet_list_have_image) {
        Object.keys(tweet_list_have_image).forEach(function(key) {
            console.log(key);
            var value = $(tweet_list_have_image[key]);
            var actionList = value.find("div.ProfileTweet-actionList")[0];
            appendDlBtn(actionList, key);
        });
    }
//})();