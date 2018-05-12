/* DOM追加処理 start. */
    /**
     * マウスオーバー状態切替.
     * @param {Element} elem 対象要素.
     */
    function toggleMouseOverState(elem) {
        toggleAttr(elem,'class','normal');
        toggleAttr(elem,'class','over');
    }

    /* <html>以下要素追加. */
    function appendHtml() {
        appendHead();
        appendBody();
    }
    /* <head>以下要素追加. */
    function appendHead() {
        appendStyle(document.head);
    }
    /**
     * スタイルシート追加.
     * @param {Element} parent 親要素.
     */
    function appendStyle(parent) {
        var elem = parent.querySelector("link.pixiv_image_info");
        if (elem != null) {
            parent.removeChild(elem);
        }
        var html = '\
        <link\
            class="pixiv_image_info"\
            rel="stylesheet"\
            type="text/css"\
            href= "' + script_root_uri + '/book_marklet_style.css">';
        parent.insertAdjacentHTML("beforeend", html);
    }

    /* <body>以下要素追加. */
    function appendBody() {
        var elem = document.querySelector("#pixiv_image_info_layer");
        if (elem != null) {
            document.body.removeChild(elem);
        }
        // レイヤー追加.
        var html = '\
        <div\
            id="pixiv_image_info_layer"\
            class="pixiv_image_info"\
            >\
            <div\
                id="wholebox"\
                class="pixiv_image_info">\
            </div>\
        </div>';
        document.body.insertAdjacentHTML("beforeend", html);

        var appendLayer = document.querySelector("#pixiv_image_info_layer");
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
        var wholebox = document.querySelector("#wholebox");
        appendMetaDataTable(wholebox);
        appendBtnArea(wholebox);
        appendImages(wholebox);
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
        var html = '\
        <table id="metadata">\
            <tr><th>タイトル</th><td>{0}</td></tr>\
            <tr><th>イラストID</th><td>{1}</td></tr>\
            <tr><th>ユーザー名</th><td>{2}</td></tr>\
            <tr><th>ユーザーID</th><td>{3}</td></tr>\
            <tr><th>投稿日時</th><td>{4}</td></tr>\
            <tr><th>画像枚数</th><td>{5}</td></tr>\
            <tr><th><span>画像サイズ<br>(w x h [px])</span></th><td>{6}</td></tr>\
            <tr><th>キャプション</th><td>{7}</td></tr>\
            <tr><th>タグ</th><td>{8}</td></tr>\
            <tr><th>閲覧数</th><td>{9}</td></tr>\
            <tr><th>お気に入り数</th><td>{10}</td></tr>\
            <tr><th>ブックマーク数</th><td>{11}</td></tr>\
        </table>';
        parent.insertAdjacentHTML("beforeend", html.format(
            getElementText(image_title)
            , getElementText(image_id)
            , getElementText(user_name)
            , getElementText(user_id)
            , getElementText(image_upload_datetime)
            , getElementText(page_count)
            , getElementText(image_size)
            , getElementText(caption)
            , getElementText(tags)
            , getElementText(view_count)
            , getElementText(like_count)
            , getElementText(bookmark_count)
            ));
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

    /**
     * まとめてダウンロード状態.
     * @type {number}
     * @description 0:ダウンロード前.
     * @description 1:ダウンロード中.
     * @description 2:ダウンロード完了.
     * @description 3:ダウンロード失敗.
     */
    var allDlstate = 0;
    /** まとめてダウンロードボタンラベル. */
    var allDlBtnLabel = ["all download","downloading","save Zip", "download failed"];
    /**
     * まとめてダウンロードボタン表示.
     * @param {Element} parent 親要素.
     */
    function appendAllDownloadBtn(parent) {
        var html = '\
        <div id="all_download_button"\
            class="download_button normal"\
            onMouseout="toggleMouseOverState(document.querySelector(\'#all_download_button\'))"\
            onMouseover="toggleMouseOverState(document.querySelector(\'#all_download_button\'))"\
            onClick="downloadAllImage()"\
        >\
            <span>{0}</span>\
        </div>';
        parent.insertAdjacentHTML("beforeend",html.format(
            allDlBtnLabel[allDlstate]
            ));
    }
    /**
     * まとめてダウンロードボタン状態変更処理.
     * @param {number} aDlState ダウンロード状態.
     * @param {string} addText 補足テキスト.
     */
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

    /**
     * うごイラZipダウンロード状態.
     * @type {number}
     * @description 現状、Zipをそのまま保存できるので、遷移可能な状態は2のみ.
     * @description 0:ダウンロード前.
     * @description 1:ダウンロード中.
     * @description 2:ダウンロード完了
     * @description 3:ダウンロード失敗.
     */
    var ugoIllDlstate = 2;
    /** うごイラZipダウンロードボタンラベル. */
    var ugoIllDlBtnLabel = ["download UgoIllZip","downloading","save UgoIllZip", "download failed"];
    /**
     * うごイラZipダウンロードボタン表示.
     * @param {Element} parent 親要素.
     */
    function appendUgoIllZipDownloadBtn(parent) {
        var html = '\
        <div id="ugoillzip_download_button"\
            class="download_button normal"\
            onMouseout="toggleMouseOverState(document.querySelector(\'#ugoillzip_download_button\'))"\
            onMouseover="toggleMouseOverState(document.querySelector(\'#ugoillzip_download_button\'))"\
            onClick="saveFile(\'{0}\', \'{1}\')"\
        >\
            <span>{2}</span>\
        </div>';
        parent.insertAdjacentHTML("beforeend",html.format(
            ugoIllZipUrl
            , getDownloadFilename(ugoIllZipUrl)
            , ugoIllDlBtnLabel[ugoIllDlstate]
            ));
    }
    /**
     * うごイラZip(フルスクリーンサイズ)ダウンロード状態.
     * @type {number}
     * @description 現状、Zipをそのまま保存できるので、遷移可能な状態は2のみ.
     * @description 0:ダウンロード前.
     * @description 1:ダウンロード中.
     * @description 2:ダウンロード完了
     * @description 3:ダウンロード失敗.
     */
    var ugoIllHQDlstate = 2;
    /** うごイラZip(フルスクリーンサイズ)ダウンロードボタンラベル. */
    var ugoIllHQDlBtnLabel = ["download UgoIllZip","downloading","save UgoIllHQZip", "download failed"];
    function appendUgoIllHQZipDownloadBtn(parent) {
        var html = '\
        <div id="ugoillhqzip_download_button"\
            class="download_button normal"\
            onMouseout="toggleMouseOverState(document.querySelector(\'#ugoillhqzip_download_button\'))"\
            onMouseover="toggleMouseOverState(document.querySelector(\'#ugoillhqzip_download_button\'))"\
            onClick="saveFile(\'{0}\', \'{1}\')"\
        >\
            <span>{2}</span>\
        </div>';
        parent.insertAdjacentHTML("beforeend",html.format(
            ugoIllHQZipUrl
            , getDownloadFilename(ugoIllHQZipUrl)
            , ugoIllHQDlBtnLabel[ugoIllHQDlstate]
            ));
    }

    /**
     * サムネイル画像表示.
     * @param {Element} parent 親要素.
     */
    function appendImages(parent) {
        var html = '<div id="image_display_box">{0}</div>';
        if (common_image_url == null) {
            html = html.format("no image.");
        } else {
            if (!isParsedImageUrlDecision()) {
                html = html.format("no image.");
            } else {
                var inner_box_html = '';
                for (var i=0;i<page_count;i++) {
                    var dlImageUrl = getDownloadImageUrl(i);
                    var inner_image_wrapper_html = '\
                    <div class="image_wrapper"\
                        onMouseOver="setVisibilityDlOverlay(this,true)"\
                        onMouseOut="setVisibilityDlOverlay(this,false)"\
                    >\
                        <div class="dl_overlay"\
                            onClick="downloadIndivImage(\'{0}\',\'{1}\')"\
                        >\
                            <img class="indiv_dl_btn"\
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAbCAYAAAB836/YAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8wOS8wOdajENAAAAAYdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3Jrc0+zH04AAAFxSURBVEiJ5ZXNTcMwGIZfRyg/VQ58N47ZIQPQEWADukFH6CjZoN2gMEvV0lxso1aAHNUfl7hq/gy0HEA8UpTIft8nlmI5gpnhQynVCBCR8OUDr+0M/qFQ9H0UpdQcwN0n3QUR3bcHh1b4AEB7ZLrOdOgVEtHLUMG9sM58TQhgTETTMAw7E1EUgYimAMa9TWY+vcbMvOQaay1rrVlKyVJK1lqztZZPWNado8M9ZMw85x6qqjoKq6rqi3DdzZywGEqdQSF2u93zaDS6CYLLtqQxBqvVaiuklAwAYRjukyRJvys2xmC9Xu+llCkAHIWOr4rbIsdVTzA1xrzGcWziOL4WonlaHQ4HbLdbXZZlyMxpu99ZYWNSiLcoikSSJDEAbDab97Is2VqbDHZ8QodSqnH38fuPr78hLH7QVwRENAGQAVhcIFoAyPI8nzR+AUqpWwAztM46z7Z5BDDL8/zJDQz9UxriHmFH5BW2xUopJx4UOT4ABLt9cQhG4M4AAAAASUVORK5CYII="\
                                />\
                            <span class="dl_overlay_text">No.{2}</span>\
                        </div>\
                        <img alt="No.{3}"\
                            src="{4}"\
                            title="No.{5}"\
                            />\
                    </div>';
                    inner_box_html += inner_image_wrapper_html.format(
                        dlImageUrl
                        , getDownloadFilename(dlImageUrl)
                        , i+1
                        , i+1
                        , getThumbnailImageUrl(i)
                        , i+1
                    );
                }
                html = html.format(inner_box_html);
            }
        }
        parent.insertAdjacentHTML("beforeend",html);
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

    /* ページ書き出し実行. */
    appendHtml();
