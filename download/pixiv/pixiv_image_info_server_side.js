/*
pixivのイラスト個別ページ閲覧中に実行すると、そのイラストのメタデータを別ページに表示するbookmarkletです。
*/
//(function(){
    /* ルートURI. */
    var root_uri = "//formula25.sakura.ne.jp";
    /* コンテンツダウンロード用プログラム. */
    var dl_proxy_uri = "//formula25.sakura.ne.jp/bookmarklet/download/common/url_download.php";

    /* ライブラリのinclude. */
    ["jszip.min.js"].forEach(function(value) {
        var script = document.createElement("script");
        script.src = root_uri + "/bookmarklet/common/library/" + value;
        document.body.appendChild(script);
    });

    /* pixiv 画像メタデータ start. */
    /* ページのタイトル(String). */
    var page_title = getElementText(document.querySelector("title"));
    /* ユーザーID(String). */
    var user_id = pixiv.context.userId;
    /* ユーザー名(String). */
    var user_name = pixiv.context.userName;
    if (user_name == null) {
        user_name = getElementText(document.querySelector(".profile-unit .user"));
    }
    /* 画像ID(String). */
    var image_id = pixiv.context.illustId;
    /* 画像タイトル(String). */
    var image_title = pixiv.context.illustTitle;
    if (image_title == null) {
        image_title = getElementText(document.querySelector("section.work-info .title"));
    }
    /* 画像枚数(int). */
    var image_size = null;
    image_size = getElementText(document.querySelectorAll("section.work-info .meta li")[1]);
    var page_count = 1;
    if (image_size != null
        && /複数枚投稿\s*([0-9]+)/.test(image_size)) {
        page_count = RegExp.$1;
    }
    /* 画像サイズ(String). */
    var image_size_w = pixiv.context.illustSize[0];
    var image_size_h = pixiv.context.illustSize[1];
    if (image_size_w != null && image_size_h != null) {
        image_size = image_size_w + " x " + image_size_h;
    }
    /* 作成ツール(String). */
    var draw_tools = getElementText(document.querySelector("section.work-info .meta .tools"));
    /* 画像のキャプション(String). */
    var caption = getElementText(document.querySelector("section.work-info .caption"));
    /* 画像のタグ配列(String Array). */
    var tags = new Array();
    var tagsNodeList = document.querySelectorAll("section.work-tags .tags-container .tags .tag a.text");
    for(var i=0;i < tagsNodeList.length;i++){
        tags.push(getElementText(tagsNodeList[i]));
    }
    /* 閲覧数(html elements). */
    var view_count = getElementText(document.querySelector("section.work-info section.score .view-count"));
    /* 評価回数(html elements). */
    var rated_count = getElementText(document.querySelector("section.work-info section.score .rated-count"));
    /* 総合点(html elements). */
    var score_count = getElementText(document.querySelector("section.work-info section.score .score-count"));

    /* 共通画像URL(String) */
    /* (例) http://i4.pixiv.net/c/150x150/img-master/img/2015/07/02/21/03/35/51204151_p0_master1200.jpg */
    //var common_image_url = document.querySelector('meta[property="og:image"]').getAttribute("content");
    var common_image_url = document.querySelector('.works_display ._layout-thumbnail img').getAttribute("src");
    console.log(common_image_url);
    /* オリジン部分「http://i4.pixiv.net」 */
    var image_url_origin = null;
    /* 画像サイズ種別ディレクトリ部分「/c/150x150/img-master/img」 */
    var image_url_dir_imgsize = null;
    /* 日時ディレクトリ部分「/2015/07/02/21/03/35/」 */
    var image_url_dir_datetime = null;
    var datetime_YYYY = null;
    var datetime_MM = null;
    var datetime_DD = null;
    var datetime_hh = null;
    var datetime_mm = null;
    var datetime_ss = null;
    /* ファイル名イラストID部分「51204151」 */
    var image_url_filename_illust_id = null;
    /* ファイル名ページ番号部分「_p」 */
    var image_url_filename_p = "_p";
    /* ファイル名ページ番号より後の部分「_master1200」 */
    var image_url_filename_after_p = null;
    /* 拡張子部分「jpg」 */
    var image_url_filename_exe = null;
    /* 画像URLパース成功フラグ. */
    var isParsedImageUrl = false;
    /* 画像URLパーサー. */
    var url_parser = new URL(common_image_url);
    if (url_parser != null) {
        image_url_origin = url_parser.origin;
        var matched = url_parser.pathname.match(/^(.+)(\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/([0-9]{2})\/([0-9]{2})\/([0-9]{2})\/)([0-9]+)_p[0-9]+(.+)\.(.+)$/);
        console.log(matched);
        if (matched != null && matched.length >= 12) {
            image_url_dir_imgsize = matched[1];
            image_url_dir_datetime = matched[2];
            datetime_YYYY = matched[3];
            datetime_MM = matched[4];
            datetime_DD = matched[5];
            datetime_hh = matched[6];
            datetime_mm = matched[7];
            datetime_ss = matched[8];
            image_url_filename_illust_id = matched[9];
            image_url_filename_after_p = matched[10];
            image_url_filename_exe = matched[11];
            isParsedImageUrl = true;
        }
    }
    /* 画像投稿日時(String). */
    var image_upload_datetime = null;
    if (datetime_YYYY != null
        && datetime_MM != null
        && datetime_DD != null
        && datetime_hh != null
        && datetime_mm != null
        && datetime_ss != null
    ) {
        image_upload_datetime = datetime_YYYY + "/" + datetime_MM + "/" + datetime_DD + " " + datetime_hh + ":" + datetime_mm + ":" + datetime_ss;
    } else {
        image_upload_datetime = getElementText(document.querySelectorAll("section.work-info .meta li")[0]);
    }

    /* 画像URLパース成功判定 start. */
    function isParsedImageUrlDecision() {
        return isParsedImageUrl
            && image_url_dir_imgsize != null
            && image_url_dir_datetime != null
            && datetime_YYYY != null
            && datetime_MM != null
            && datetime_DD != null
            && datetime_hh != null
            && datetime_mm != null
            && datetime_ss != null
            && image_url_filename_illust_id != null
            && image_url_filename_after_p != null
            && image_url_filename_exe != null
        ;
    }
    /* 画像URLパース成功判定 end. */

    /* うごイラZip URL. */
    var ugoIllZipUrl;
    if (pixiv.context.ugokuIllustData != null) {
        ugoIllZipUrl = pixiv.context.ugokuIllustData.src;
    }
    var ugoIllHQZipUrl;
    if (pixiv.context.ugokuIllustFullscreenData != null) {
        ugoIllHQZipUrl = pixiv.context.ugokuIllustFullscreenData.src;
    }
    /* pixiv 画像メタデータ end. */

    /* DOM追加処理 start. */
    /* <html>~</html>. */
    function appendHtml() {
        appendHead();
        appendBody();
    }
    /* <head>~</head>. */
    function appendHead() {
        appendStyle(document.head);
    }
    /* <style>~</style>. */
    function appendStyle(parent) {
        var elem = parent.querySelector("style.pixiv_image_info");
        if (elem != null) {
            parent.removeChild(elem);
        }
        var text = "";
        text += 'body {position:relative;}\n';
        // レイヤー表示全体.
        text += '#pixiv_image_info_layer {position:absolute; top:0; left:0; z-index:10000; margin:0; padding:0; width:100%; height:100%; background-color:rgba(0,0,0,0.45);}\n';
        text += '#pixiv_image_info_layer * {font-size:10pt;}\n';
        text += '#wholebox {\n'
        text += 'position:relative;\n'
        text += 'padding:20px;\n'
        text += '}\n';

        // メタデータテーブル.
        text += '#pixiv_image_info_layer table#metadata {margin:0px; border:2px solid #555555; border-spacing:0px;}\n';
        text += '#pixiv_image_info_layer table#metadata tr {margin:0px; border:2px solid #555555;}\n';
        text += '#pixiv_image_info_layer table#metadata th {margin:0px; padding:5px; border:2px solid #555555; min-width:100px; background-color:rgba(206,245,204,0.80);}\n';
        text += '#pixiv_image_info_layer table#metadata td {margin:0px; padding:5px; border:2px solid #555555; min-width:100px; background-color:rgba(255,255,255,0.80);}\n';

        // ダウンロードボタン start.
        text += '#pixiv_image_info_layer #btn_area\n'
        text += '{\n';
        text += 'margin-top: 10px;\n';
        text += '}\n';
        text += '#pixiv_image_info_layer #all_download_button\n'
        text += ', #pixiv_image_info_layer #ugoillzip_download_button\n'
        text += ', #pixiv_image_info_layer #ugoillhqzip_download_button\n'
        text += '{\n';
        text += 'display: inline-block;\n';
        text += 'margin: 0px 5px 0px 0px;\n';
        text += 'padding: 0px;\n';
        text += 'width: 140px;\n';
        text += 'height: 30px;\n';
        text += 'text-decoration: none;\n';
        text += 'font-weight: bold;\n';
        text += 'text-align: center;\n';
        text += '}\n';
/*
        text += '#pixiv_image_info_layer #all_download_button:before\n';
        text += ', #pixiv_image_info_layer #ugoillzip_download_button:before\n'
        text += ', #pixiv_image_info_layer #ugoillhqzip_download_button:before\n'
        text += '{\n';
        text += 'content:"";';
        text += 'display:inline-block;';
        text += 'width:0px;';
        text += 'height:100%;';
        text += 'vertical-align: middle;\n';
        text += '}\n';
*/
        text += '#pixiv_image_info_layer #all_download_button span\n';
        text += ', #pixiv_image_info_layer #ugoillzip_download_button span\n'
        text += ', #pixiv_image_info_layer #ugoillhqzip_download_button span\n'
        text += '{\n';
        text += 'display:inline-block;';
        text += 'padding: 5px;\n';
        text += 'font-size: 14px;\n';
        text += 'vertical-align: middle;\n';
        text += '}\n';

        text += '#all_download_button[class="normal"]\n';
        text += ', #ugoillzip_download_button[class="normal"]\n'
        text += ', #ugoillhqzip_download_button[class="normal"]\n'
        text += '{\n';
        text += 'border: solid #CCC;\n';
        text += 'border-width:1px 3px 3px 1px;\n';
        text += 'border-radius: 8px;\n';
        text += '-moz-border-radius: 8px;\n';
        text += '-webkit-border-radius: 8px;\n';
        text += 'background: -ms-linear-gradient(top,#FFF 0%,#FFF 3%,#E6E6E6 3%,#FFF);\n';
        text += 'background: -moz-linear-gradient(top,#FFF 0%,#FFF 3%,#E6E6E6 3%,#FFF);\n';
        text += 'background: -webkit-gradient(linear, left top, left bottom, from(#FFF), color-stop(0.03,#FFF), color-stop(0.03,#E6E6E6), to(#FFF));\n';
        text += 'color: #111;\n';
        text += '}\n';

        text += '#all_download_button[class="over"] \n';
        text += ', #ugoillzip_download_button[class="over"]\n'
        text += ', #ugoillhqzip_download_button[class="over"]\n'
        text += '{\n';
        text += 'border: solid #0099CC;\n';
        text += 'border-width:1px 3px 3px 1px;\n';
        text += 'border-radius: 8px;\n';
        text += '-moz-border-radius: 8px;\n';
        text += '-webkit-border-radius: 8px;\n';
        text += 'background: -ms-linear-gradient(top,#B1D2E0 0%,#B1D2E0 3%,#0099CC 3%,#069);\n';
        text += 'background: -moz-linear-gradient(top,#B1D2E0 0%,#B1D2E0 3%,#0099CC 3%,#069);\n';
        text += 'background: -webkit-gradient(linear, left top, left bottom, from(#B1D2E0), color-stop(0.03,#B1D2E0), color-stop(0.03,#0099CC), to(#069));\n';
        text += 'color: #eee;\n';
        text += '}\n';
        // ダウンロードボタン end.

        // サムネイル.
        text += '#pixiv_image_info_layer #image_display_box{display:inline-block; margin-top:15px;}\n'
        text += '#pixiv_image_info_layer .image_wrapper {position:relative; display:inline-block; margin:2px; border:1px solid #51b5e6; line-height:0;}\n';
        text += '#pixiv_image_info_layer .dl_overlay {position:absolute; width:100%; height:100%; background-color:rgba(0,0,0,0.5); text-align:center; visibility:hidden; color:#ffffff;}\n';
        text += '#pixiv_image_info_layer .dl_overlay:before {content:""; display:inline-block; width:0px; height:100%; vertical-align:middle;}\n';
        text += '#pixiv_image_info_layer .indiv_dl_btn {display:inline-block; vertical-align:middle;}\n';

        var node = document.createTextNode(text);
        var style = document.createElement('style');
        style.setAttribute("class","pixiv_image_info");
        style.appendChild(node);
        parent.appendChild(style);
    }

    /* <body>~</body>. */
    function appendBody() {
        var elem = document.querySelector("#pixiv_image_info_layer");
        if (elem != null) {
            document.body.removeChild(elem);
        }
        // レイヤー追加.
        var appendLayer = document.createElement("div");
        appendLayer.setAttribute("id","pixiv_image_info_layer");
        appendLayer.setAttribute("class","pixiv_image_info");
        appendLayer.addEventListener("click",
            function(e){
                // レイヤー上の何もオブジェクトが表示されていない部分をクリックしたらレイヤー削除.
                if (e != null) {
                    console.log("onClick", e.target);
                    if (e.target.id == "pixiv_image_info_layer"
                        || e.target.id == "wholebox"
                        || e.target.id == "image_display_box"
                        || e.target.id == "btn_area"
                        ) {
                        removeAppendLayer(e);
                    }
                }
            },
            false
        );
        document.body.appendChild(appendLayer);
        var wholebox = document.createElement("div");
        wholebox.setAttribute("id","wholebox");
        wholebox.setAttribute("class","pixiv_image_info");
        appendLayer.appendChild(wholebox);
        appendMetaDataTable(wholebox);
        appendBtnArea(wholebox);
        appendImages(wholebox);
    }

    /* 属性値設定処理. */
    function changeAttr(elem,attr,attrValue) {
        if (elem != null && attr != null) {
            elem.setAttribute(attr,attrValue);
        }
    }
    /* レイヤー削除処理. */
    function removeAppendLayer(e) {
        var elem = document.querySelector("#pixiv_image_info_layer");
        if (elem != null) {
            document.body.removeChild(elem);
        }
    }
    /* 画像メタデータ表示用table. */
    function appendMetaDataTable(parent) {
        var metadataTable = document.createElement("table");
        metadataTable.setAttribute("id","metadata");
        parent.appendChild(metadataTable);
        appendMetaDataTr(metadataTable,document.createTextNode('タイトル'), image_title);
        appendMetaDataTr(metadataTable,document.createTextNode('イラストID'), image_id);
        appendMetaDataTr(metadataTable,document.createTextNode('ユーザー名'), user_name);
        appendMetaDataTr(metadataTable,document.createTextNode('ユーザーID'), user_id);
        appendMetaDataTr(metadataTable,document.createTextNode('投稿日時'), image_upload_datetime);
        appendMetaDataTr(metadataTable,document.createTextNode('画像数'), page_count);
        var th = document.createElement("span");
        th.appendChild(document.createTextNode('画像サイズ'));
        th.appendChild(document.createElement("br"));
        th.appendChild(document.createTextNode('(w x h [px])'));
        appendMetaDataTr(metadataTable,th,image_size);
        appendMetaDataTr(metadataTable,document.createTextNode('制作ツール'),draw_tools);
        appendMetaDataTr(metadataTable,document.createTextNode('キャプション'),caption);
        appendMetaDataTr(metadataTable,document.createTextNode('タグ'),tags);
        appendMetaDataTr(metadataTable,document.createTextNode('閲覧数'),view_count);
        appendMetaDataTr(metadataTable,document.createTextNode('評価回数'),rated_count);
        appendMetaDataTr(metadataTable,document.createTextNode('総合点'),score_count);
    }
    /* 画像メタデータ表示用table tr. */
    function appendMetaDataTr(parent,headerElement,dataElement) {
        var tr = document.createElement("tr");
        parent.appendChild(tr);
        appendMetaDataTh(tr,headerElement);
        appendMetaDataTd(tr,dataElement);
    }
    /* 画像メタデータ表示用table th. */
    function appendMetaDataTh(parent,headerElement) {
        var th = document.createElement("th");
        parent.appendChild(th);
        th.appendChild(headerElement);
    }
    /* 画像メタデータ表示用table td. */
    function appendMetaDataTd(parent,dataElement) {
        var td = document.createElement("td");
        parent.appendChild(td);
        var text = "-";
        if (dataElement instanceof NodeList) {
            if (dataElement.length > 0) {
                text = getElementText(dataElement[0]);
                for(var i=1;i < dataElement.length;i++){
                    text += ' / ' + getElementText(dataElement[i]);
                }
            }
        } else if (dataElement instanceof Element) {
            text = getElementText(dataElement);
        } else if (dataElement instanceof Array) {
            if (dataElement.length > 0) {
                text = dataElement[0].toString();
                for(var i=1;i < dataElement.length;i++){
                    text += ' / ' + dataElement[i].toString();
                }
            }
        } else if (dataElement != null) {
            text = dataElement.toString();
        }
        td.appendChild(document.createTextNode(text));
    }
    /* html elementをStringに変換. */
    function getElementText(element) {
        var ret = 'null';
        if(element != null){
            ret = element.textContent;
        }
        return ret;
    }

    /* ボタンエリア表示. */
    function appendBtnArea(parent) {
        var btnArea = document.createElement("div");
        btnArea.setAttribute("id","btn_area");
        parent.appendChild(btnArea);
        if (page_count > 1) {
            appendAllDownloadBtn(btnArea);
        }
        if (ugoIllZipUrl != null) {
            appendUgoIllZipDownloadBtn(btnArea);
        }
        if (ugoIllHQZipUrl != null) {
            appendUgoIllHQZipDownloadBtn(btnArea);
        }
    }

    /* まとめてダウンロードボタン表示. */
    var allDlstate = 0;//0:ダウンロード前, 1:ダウンロード中, 2:ダウンロード完了, 3:ダウンロード失敗,
    var allDlBtnLabel = ["all download","downloading","save Zip", "download failed"];
    function appendAllDownloadBtn(parent) {
        var btn = document.createElement("div");
        btn.setAttribute("id","all_download_button");
        btn.setAttribute("class","normal");
        btn.setAttribute("onMouseout","changeAttr(document.querySelector('#all_download_button'),'class','normal')");
        btn.setAttribute("onMouseover","changeAttr(document.querySelector('#all_download_button'),'class','over')");
        btn.setAttribute("onClick","downloadAllImage()");
        var textElem = document.createElement("span");
        textElem.appendChild(document.createTextNode(allDlBtnLabel[allDlstate]));
        btn.appendChild(textElem);
        parent.appendChild(btn);
    }
    /* まとめてダウンロードボタン状態変更処理. */
    function changeAllDlBtn(aDlState, addText) {
        allDlstate = aDlState;
        var btn = document.querySelector("#all_download_button");
        var text = document.querySelector("#all_download_button span");
        if (btn != null && text != null) {
            switch(allDlstate) {
            case 0:
                text.innerHTML = allDlBtnLabel[0];
                changeAttr(btn, "onclick","downloadAllImage()");
                break;
            case 1:
                text.innerHTML = allDlBtnLabel[1] + addText;
                changeAttr(btn, "onclick", "javascript:void(0);");
                break;
            case 2:
                text.innerHTML = allDlBtnLabel[2];
                changeAttr(btn, "onclick", "saveFile(\"" + zip_blob_url + "\",\"" + image_url_filename_illust_id + ".zip\")");
                break;
            case 3:
                text.innerHTML = allDlBtnLabel[3];
                changeAttr(btn, "onclick", "changeAllDlBtn(0,'')");
                break;
            default:
                break;
            }
        }
    }
    /* うごイラZipダウンロードボタン表示. */
    var ugoIllDlstate = 2;//0:ダウンロード前, 1:ダウンロード中, 2:ダウンロード完了, 3:ダウンロード失敗,(現状、Zipをそのまま保存できるので、遷移可能な状態は2のみ)
    var ugoIllDlBtnLabel = ["download UgoIllZip","downloading","save UgoIllZip", "download failed"];
    function appendUgoIllZipDownloadBtn(parent) {
        var btn = document.createElement("div");
        btn.setAttribute("id","ugoillzip_download_button");
        btn.setAttribute("class","normal");
        btn.setAttribute("onMouseout","changeAttr(document.querySelector('#ugoillzip_download_button'),'class','normal')");
        btn.setAttribute("onMouseover","changeAttr(document.querySelector('#ugoillzip_download_button'),'class','over')");
        btn.setAttribute("onClick","saveFile('" + ugoIllZipUrl + "', '" + getDownloadFilename(ugoIllZipUrl) + "')");
        var textElem = document.createElement("span");
        textElem.appendChild(document.createTextNode(ugoIllDlBtnLabel[ugoIllDlstate]));
        btn.appendChild(textElem);
        parent.appendChild(btn);
    }
    /* うごイラZip(フルスクリーンサイズ)ダウンロードボタン表示. */
    var ugoIllHQDlstate = 2;//0:ダウンロード前, 1:ダウンロード中, 2:ダウンロード完了, 3:ダウンロード失敗,(現状、Zipをそのまま保存できるので、遷移可能な状態は2のみ)
    var ugoIllHQDlBtnLabel = ["download UgoIllZip","downloading","save UgoIllHQZip", "download failed"];
    function appendUgoIllHQZipDownloadBtn(parent) {
        var btn = document.createElement("div");
        btn.setAttribute("id","ugoillhqzip_download_button");
        btn.setAttribute("class","normal");
        btn.setAttribute("onMouseout","changeAttr(document.querySelector('#ugoillhqzip_download_button'),'class','normal')");
        btn.setAttribute("onMouseover","changeAttr(document.querySelector('#ugoillhqzip_download_button'),'class','over')");
        btn.setAttribute("onClick","saveFile('" + ugoIllHQZipUrl + "', '" + getDownloadFilename(ugoIllHQZipUrl) + "')");
        var textElem = document.createElement("span");
        textElem.appendChild(document.createTextNode(ugoIllHQDlBtnLabel[ugoIllHQDlstate]));
        btn.appendChild(textElem);
        parent.appendChild(btn);
    }

    /* サムネイル画像表示. */
    function appendImages(parent) {
        var imageDisplayBox = document.createElement("div");
        imageDisplayBox.setAttribute("id","image_display_box");
        parent.appendChild(imageDisplayBox);
        var noImageTextNode = document.createTextNode("no image.");
        if (common_image_url == null) {
            imageDisplayBox.appendChild(noImageTextNode);
        } else {
            if (isParsedImageUrlDecision()) {
                for (var i=0;i<page_count;i++) {
                    var dlImageUrl = getDownloadImageUrl(i);
                    var dlFilename = getDownloadFilename(dlImageUrl);
                    var imageWrapper = document.createElement("div");
                    imageWrapper.setAttribute("class","image_wrapper");
                    imageWrapper.setAttribute("onMouseOver","setVisibilityDlOverlay(this,true)");
                    imageWrapper.setAttribute("onMouseOut","setVisibilityDlOverlay(this,false)");
                    imageDisplayBox.appendChild(imageWrapper);

                    var dlOverlay = document.createElement("div");
                    dlOverlay.setAttribute("class","dl_overlay");
                    dlOverlay.setAttribute("onClick","downloadIndivImage('" + dlImageUrl + "','" + dlFilename + "')");
                    imageWrapper.appendChild(dlOverlay);

                    var indivDlBtn = document.createElement("img");
                    indivDlBtn.setAttribute("class","indiv_dl_btn");
                    indivDlBtn.setAttribute("src","data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%14%00%00%00%1B%08%06%00%00%00%7C%DF%AF%D8%00%00%00%04sBIT%08%08%08%08%7C%08d%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0010%2F09%2F09%D6%A3%10%D0%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%01qIDATH%89%E5%95%CDM%C30%18%86_G%28%3FU%0E%7C7%8E%D9%21%03%D0%11%60%03%BAAG%E8%28%D9%A0%DD%A00K%D5%D2%5Cl%A3V%80%1C%D5%1F%97%B8j%FE%0C%B4%1C%40%3CR%94%C8~%DF%27%96b9%82%99%E1C%29%D5%08%10%91%F0%E5%03%AF%ED%0C%FE%A1P%F4%7D%14%A5%D4%1C%C0%DD%27%DD%05%11%DD%B7%07%87V%F8%00%40%7Bd%BA%CEt%E8%15%12%D1%CBP%C1%BD%B0%CE%7CM%08%60LD%D30%0C%3B%13Q%14%81%88%A6%00%C6%BDMf%3E%BD%C6%CC%BC%E4%1Ak-k%ADYJ%C9RJ%D6Z%B3%B5%96OX%D6%9D%A3%C3%3Dd%CC%3C%E7%1E%AA%AA%3A%0A%AB%AA%EA%8Bp%DD%CD%9C%B0%18J%9DA%21v%BB%DD%F3h4%BA%09%82%CB%B6%A41%06%AB%D5j%2B%A4%94%0C%00a%18%EE%93%24I%BF%2B6%C6%60%BD%5E%EF%A5%94%29%00%1C%85%8E%AF%8A%DB\"%C7UO05%C6%BC%C6ql%E28%BE%16%A2yZ%1D%0E%07l%B7%5B%5D%96e%C8%CCi%BB%DFYacR%88%B7%28%8AD%92%241%00l6%9B%F7%B2%2C%D9Z%9B%0Cv%7CB%87R%AAq%F7%F1%FB%8F%AF%BF%21%2C~%D0W%04D4%01%90%01X%5C%20Z%00%C8%F2%3C%9F4~%01J%A9%5B%003%B4%CE%3A%CF%B6y%040%CB%F3%FC%C9%0D%0C%FDS%1A%E2%1EaG%E4%15%B6%C5J%29%27%1E%149%3E%00%04%BB%7Dq%08F%E0%CE%00%00%00%00IEND%AEB%60%82");
                    dlOverlay.appendChild(indivDlBtn);

                    var dlOverlayText = document.createElement("span");
                    dlOverlayText.setAttribute("class","dl_overlay_text");
                    var dlOverlayTextNode = document.createTextNode("No." + (i+1));
                    dlOverlayText.appendChild(dlOverlayTextNode);
                    dlOverlay.appendChild(dlOverlayText);

                    var image = document.createElement("img");
                    image.setAttribute("alt","No." + (i+1));
                    image.setAttribute("src",getThumbnailImageUrl(i));
                    image.setAttribute("title","No." + (i+1));
                    imageWrapper.appendChild(image);
                }
            } else {
                imageDisplayBox.appendChild(noImageTextNode);
            }
        }
    }
    /* サムネイル画像オーバーレイ表示/非表示切り替え. */
    function setVisibilityDlOverlay(element, visibility) {
        if (element != null && element.querySelector(".dl_overlay") != null) {
            if (visibility) {
                element.querySelector("#pixiv_image_info_layer .dl_overlay").style.visibility="visible";
            } else {
                element.querySelector("#pixiv_image_info_layer .dl_overlay").style.visibility="hidden";
            }
        }
    }
    /* DOM追加処理 end. */

    /* サムネイル表示用画像URL取得. */
    function getThumbnailImageUrl(page_num) {
        var ret = image_url_origin
                + "/c/150x150/img-master/img"
                + image_url_dir_datetime
                + image_url_filename_illust_id
                + image_url_filename_p
                + page_num
                + image_url_filename_after_p
                + "."
                + image_url_filename_exe
                ;
        console.log(ret);
        return ret;
    }
    /* 表示用中サイズ画像URL取得. */
    function getMediumSizeImageUrl(page_num) {
        return image_url_origin
                + "/c/600x600/img-master/img"
                + image_url_dir_datetime
                + image_url_filename_illust_id
                + image_url_filename_p
                + page_num
                + image_url_filename_after_p
                + "."
                + image_url_filename_exe
                ;
    }
    /* 表示用大サイズ画像URL取得. */
    function getLargeSizeImageUrl(page_num) {
        return image_url_origin
                + "/c/1200x1200/img-master/img"
                + image_url_dir_datetime
                + image_url_filename_illust_id
                + image_url_filename_p
                + page_num
                + image_url_filename_after_p
                + "."
                + image_url_filename_exe
                ;
    }
    /* ダウンロード用画像(オリジナル画像)URL取得. */
    function getDownloadImageUrl(page_num) {
        /* 
        * オリジナル画像はなにかアクセス制限があるらしく、直接開くと403エラーになる。
        * pixivページ等から一度画像を表示した後は正しく表示される。
        * 確実に表示する方法がわかるまでは暫定で1200x1200画像のURLを返すようにする。
        */
        /*var ret = image_url_origin
                + "/img-original/img"
                + image_url_dir_datetime
                + image_url_filename_illust_id
                + image_url_filename_p
                + page_num
                + "."
                + image_url_filename_exe
                ;*/
        var ret = getLargeSizeImageUrl(page_num);
        console.log(ret);
        return ret;
    }
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
    /* <img>からBase64エンコード. */
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
    /* DataURLからArrayBufferへ変換. */
    function convertDataUrlToArrayBuffer(dataUrl) {
        var bin = atob(dataUrl.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        return buffer.buffer;
    }
    /* まとめて画像ダウンロード end. */

    /* ページ書き出し実行. */
    appendHtml();
//})();