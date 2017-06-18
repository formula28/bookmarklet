
    /* 開いているページのdocument. */
    var doc = document;
    if (document.getElementById("originpage")) {
//        doc = document.getElementById("originpage").contentWindow.document;
        doc = originpage.document;
    }
    /* 現在開いているページのURL. */
    var present_url = doc.location.href;
    /* ユーザーID(String). */
    var user_id = doc.querySelector("div.related_info_main div#ko_watchlist_info").getAttribute("data-id");
    /* ユーザー名(String). */
    var user_name = getElementText(doc.querySelector("div.related_info_main div#ko_watchlist_info li.user_name strong"));
    //alert(user_id + "/" + user_name + "/" + location.href);
    /* API(/api/user/data)レスポンスの画像データ. */
    function ImageData() {
        this.id = "";
        this.user_id = "";
        this.title = "";
        this.description = "";
        this.view_count = "";
        this.comment_count = "";
        this.clip_count = "";
        this.summary = "";
        this.genre = "";
        this.category = "";
        this.image_type = "";
        this.illust_type = "";
        this.inspection_status = "";
        this.anonymous_flag = "";
        this.public_status = "";
        this.delete_flag = "";
        this.delete_type = "";
        this.cache_time = "";
        this.created = "";
    };
    var mApiUserDataList;
    
    // API(/api/user/data)リクエスト.
    function requestApiUserData(aUserId) {
            /* ダウンロード画像のURL取得. */
            var xhr = new XMLHttpRequest();
            var url = "http://seiga.nicovideo.jp/api/user/data?id=" + aUserId;
            xhr.onload = function(e) {
                console.log("APIレスポンス成功.");
                if (xhr.response) {
                    mApiUserDataList = parseApiUserData(xhr.response);
                }
                console.log(mApiUserDataList);
                openNewPage();
            }
            xhr.onerror = function(e) {
                console.log("APIレスポンス失敗.");
                console.log(url);
                alert("APIレスポンス失敗.\n"+url);
            }
            xhr.open("GET", url, true);
            xhr.responseType = "document";
            xhr.send();
    }
    // API(/api/user/data)レスポンス解析.
    function parseApiUserData(response) {
        var ret = [];
        if (response) {
            var image = response.querySelectorAll("image");
            for (var i = 0;i < image.length; i++) {
                var data = new ImageData();
                data.id = getElementText(image[i].querySelector("id"));
                data.user_id = getElementText(image[i].querySelector("user_id"));
                data.title = getElementText(image[i].querySelector("title"));
                data.description = getElementText(image[i].querySelector("description"));
                data.view_count = getElementText(image[i].querySelector("view_count"));
                data.comment_count = getElementText(image[i].querySelector("comment_count"));
                data.clip_count = getElementText(image[i].querySelector("clip_count"));
                data.summary = getElementText(image[i].querySelector("summary"));
                data.genre = getElementText(image[i].querySelector("genre"));
                data.category = getElementText(image[i].querySelector("category"));
                data.image_type = getElementText(image[i].querySelector("image_type"));
                data.illust_type = getElementText(image[i].querySelector("illust_type"));
                data.inspection_status = getElementText(image[i].querySelector("inspection_status"));
                data.anonymous_flag = getElementText(image[i].querySelector("anonymous_flag"));
                data.public_status = getElementText(image[i].querySelector("public_status"));
                data.delete_flag = getElementText(image[i].querySelector("delete_flag"));
                data.delete_type = getElementText(image[i].querySelector("delete_type"));
                data.cache_time = getElementText(image[i].querySelector("cache_time"));
                data.created = getElementText(image[i].querySelector("created"));
                ret.push(data);
            }
        }
        return ret;
    }
    // ElementをStringに変換.
    function getElementText(element) {
        var ret;
        if(element){
            ret = element.textContent;
        }
        return ret;
    }
    // インデントタブ取得.
    function getIndent(indentsize) {
        var indent = "";
        for (var i = 0; i < indentsize; i++) {
            indent += "    ";
        }
        return indent;
    }
    // 新しいページ生成.
    function openNewPage() {
        document.open();
        document.write(getDocumentHtml(0));
        document.close();
    }
    // 新しいページ用のHTML取得.
    function getDocumentHtml(indentsize) {
        var ret = "";
        var indent = getIndent(indentsize);
        ret += indent + "<html>\n";
        ret += getDocumentHead(indentsize+1);
        ret += getDocumentBody(indentsize+1);
        ret += indent + "</html>\n";
        return ret;
    }
    function getDocumentHead(indentsize) {
        var ret = "";
        var indent = getIndent(indentsize);
        ret += indent + "<head>\n";
        ret += indent + "    <link rel='stylesheet' type='text/css' href='/css/common/common_l.css?q7d40h'>\n";
        ret += indent + "    <link rel='stylesheet' type='text/css' href='/css/illust/all_l.css?nhrofc'>\n";
        ret += indent + "    <link rel='stylesheet' type='text/css' href='/css/cpp/cpp_l.css?l2qgrf'>\n";
        ret += getDocumentStyle(indentsize+1);
        ret += indent + "</head>\n";
        return ret;
    }
    function getDocumentStyle(indentsize) {
        var ret = "";
        var indent = getIndent(indentsize);
        ret += indent + "<style>\n";
        ret += indent + "div#user_illust_list_box {\n";
//        ret += indent + "    width:100%;\n";
        ret += indent + "}\n";
        ret += indent + "div#base_frame {\n";
        ret += indent + "    white-space:nowrap;\n";
        ret += indent + "}\n";
        ret += indent + "div#itemlist_frame {\n";
        ret += indent + "    width:150px;\n";
        ret += indent + "    height:99%;\n";
        ret += indent + "    border:0;\n";
        ret += indent + "    margin:0;\n";
        ret += indent + "    padding:0;\n";
        ret += indent + "    display:inline-block;\n";
        ret += indent + "}\n";
        ret += indent + "div#originpage_frame {\n";
        ret += indent + "    width:85%;\n";
        ret += indent + "    min-width:860px;\n";
        ret += indent + "    height:99%;\n";
        ret += indent + "    border:0;\n";
        ret += indent + "    margin:0;\n";
        ret += indent + "    padding:0;\n";
        ret += indent + "    display:inline-block;\n";
        ret += indent + "    white-space:nowrap;\n";
        ret += indent + "}\n";
        ret += indent + "iframe {\n";
        ret += indent + "    border:0;\n";
        ret += indent + "}\n";
        ret += indent + "</style>\n";
        return ret;
    }
    function getDocumentBody(indentsize) {
        var ret = "";
        var indent = getIndent(indentsize);
        ret += indent + "<body>\n";
        ret += indent + "    <div id='base_frame'>\n";
        ret += indent + "        <div id='itemlist_frame'>\n";
        ret += indent + "        <iframe id='itemlist' name='itemlist' width='150px' height='100%' srcdoc=\"\n";
        ret += indent + "            <html>\n";
        ret += indent + "                <head>\n";
        ret += indent + "                    <link rel='stylesheet' type='text/css' href='/css/common/common_l.css?q7d40h'>\n";
        ret += indent + "                    <link rel='stylesheet' type='text/css' href='/css/illust/all_l.css?nhrofc'>\n";
        ret += indent + "                    <link rel='stylesheet' type='text/css' href='/css/cpp/cpp_l.css?l2qgrf'>\n";
        ret += indent + "                    <style>\n";
        ret += indent + "                        div#user_illust_list_box {\n";
        ret += indent + "                            width:120px;\n";
        ret += indent + "                        }\n";
        ret += indent + "                        li.list_item_cutout.middle {\n";
        ret += indent + "                            border:2px solid rgba(50,50,50,0.8);\n";
        ret += indent + "                            border-radius:4px;\n";
        ret += indent + "                            -moz-border-radius:4px;\n";
        ret += indent + "                            margin:5px;\n";
        ret += indent + "                        }\n";
        ret += indent + "                        ul.illust_info {\n";
        ret += indent + "                            text-align:left;\n";
        ret += indent + "                        }\n";
        ret += indent + "                    </style>\n";
        ret += indent + "                </head>\n";
        ret += indent + "                <body>\n";
        ret += getDocumentIllustListWrapper(indentsize+5);
        ret += indent + "                </body>\n";
        ret += indent + "            </html>\n";
        ret += indent + "        \"></iframe>\n";
        ret += indent + "        </div>\n";
        ret += indent + "        <div id='originpage_frame'>\n";
        ret += indent + "        <iframe id='originpage' name='originpage' width='100%' height='100%' src=" + present_url + "></iframe>\n";
        ret += indent + "        </div>\n";
        ret += indent + "    </div>\n";
//        ret += getDocumentIllustListWrapper(indentsize+1);
        ret += indent + "</body>\n";
        return ret;
    }
    function getDocumentIllustListWrapper(indentsize) {
        var ret = "";
        var indent = getIndent(indentsize);
        ret += indent + "<div id='user_illust_list_box' class='other_illust user_illust'>\n";
        ret += getDocumentIllustList(indentsize+1);
        ret += indent + "</div>\n";
        return ret;
    }
    function getDocumentIllustList(indentsize) {
        var ret = "";
        var indent = getIndent(indentsize);
        ret += indent + "<div class='illust_list'>\n";
        ret += getDocumentItemList(indentsize+1);
        ret += indent + "</div>\n";
        return ret;
    }
    function getDocumentItemList(indentsize) {
        var ret = "";
        var indent = getIndent(indentsize);
        ret += indent + "<ul class='item_list'>\n";
        for (var i = 0; i < mApiUserDataList.length; i++) {
            ret += getDocumentItem(indentsize+1, i);
        }
        ret += indent + "</ul>\n";
        return ret;
    }
    function getDocumentItem(indentsize, listindex) {
        var ret = "";
        var indent = getIndent(indentsize);
        ret += indent + "<li class='list_item_cutout middle'>\n";
        ret += indent + "<div class='list_item_wrapper'>\n";
        ret += indent + "    <a target='originpage' href='/seiga/im" + mApiUserDataList[listindex].id + "' title='" + mApiUserDataList[listindex].title + "'>\n";
        ret += getDocumentItemThumbnail(indentsize+1, listindex);
        ret += getDocumentItemInfo(indentsize+1, listindex);
        ret += indent + "    </a>\n";
        ret += indent + "</div>\n";
        ret += indent + "</li>\n";
        return ret;
    }
    function getDocumentItemThumbnail(indentsize, listindex) {
        var ret = "";
        var indent = getIndent(indentsize);
        ret += indent + "<span class='thum'>\n";
        ret += indent + "<img src='http://lohas.nicoseiga.jp//thumb/" + mApiUserDataList[listindex].id + "c' alt=''>\n";
        ret += indent + "</span>\n";
        return ret;
    }
    function getDocumentItemInfo(indentsize, listindex) {
        var ret = "";
        var indent = getIndent(indentsize);
        ret += indent + "<ul class='illust_info'>\n";
        ret += indent + "    <li class='title'>" + mApiUserDataList[listindex].title + "</li>\n";
        ret += indent + "    <li class='user'>" + user_name + "</li>\n";
        ret += indent + "</ul>\n";
        return ret;
    }

    // 処理実行.
    requestApiUserData(user_id);
