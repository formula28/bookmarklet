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
            <tr><th>画像数</th><td>{5}</td></tr>\
            <tr><th><span>画像サイズ<br>(w x h [px])</span></th><td>{6}</td></tr>\
            <tr><th>制作ツール</th><td>{7}</td></tr>\
            <tr><th>キャプション</th><td>{8}</td></tr>\
            <tr><th>タグ</th><td>{9}</td></tr>\
            <tr><th>閲覧数</th><td>{10}</td></tr>\
            <tr><th>評価回数</th><td>{11}</td></tr>\
            <tr><th>総合点</th><td>{12}</td></tr>\
        </table>';
        parent.insertAdjacentHTML("beforeend", html.format(
            getElementText(image_title)
            , getElementText(image_id)
            , getElementText(user_name)
            , getElementText(user_id)
            , getElementText(image_upload_datetime)
            , getElementText(page_count)
            , getElementText(image_size)
            , getElementText(draw_tools)
            , getElementText(caption)
            , getElementText(tags)
            , getElementText(view_count)
            , getElementText(rated_count)
            , getElementText(score_count)
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
                                src="data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%14%00%00%00%1B%08%06%00%00%00%7C%DF%AF%D8%00%00%00%04sBIT%08%08%08%08%7C%08d%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0010%2F09%2F09%D6%A3%10%D0%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%01qIDATH%89%E5%95%CDM%C30%18%86_G%28%3FU%0E%7C7%8E%D9%21%03%D0%11%60%03%BAAG%E8%28%D9%A0%DD%A00K%D5%D2%5Cl%A3V%80%1C%D5%1F%97%B8j%FE%0C%B4%1C%40%3CR%94%C8~%DF%27%96b9%82%99%E1C%29%D5%08%10%91%F0%E5%03%AF%ED%0C%FE%A1P%F4%7D%14%A5%D4%1C%C0%DD%27%DD%05%11%DD%B7%07%87V%F8%00%40%7Bd%BA%CEt%E8%15%12%D1%CBP%C1%BD%B0%CE%7CM%08%60LD%D30%0C%3B%13Q%14%81%88%A6%00%C6%BDMf%3E%BD%C6%CC%BC%E4%1Ak-k%ADYJ%C9RJ%D6Z%B3%B5%96OX%D6%9D%A3%C3%3Dd%CC%3C%E7%1E%AA%AA%3A%0A%AB%AA%EA%8Bp%DD%CD%9C%B0%18J%9DA%21v%BB%DD%F3h4%BA%09%82%CB%B6%A41%06%AB%D5j%2B%A4%94%0C%00a%18%EE%93%24I%BF%2B6%C6%60%BD%5E%EF%A5%94%29%00%1C%85%8E%AF%8A%DB\"%C7UO05%C6%BC%C6ql%E28%BE%16%A2yZ%1D%0E%07l%B7%5B%5D%96e%C8%CCi%BB%DFYacR%88%B7%28%8AD%92%241%00l6%9B%F7%B2%2C%D9Z%9B%0Cv%7CB%87R%AAq%F7%F1%FB%8F%AF%BF%21%2C~%D0W%04D4%01%90%01X%5C%20Z%00%C8%F2%3C%9F4~%01J%A9%5B%003%B4%CE%3A%CF%B6y%040%CB%F3%FC%C9%0D%0C%FDS%1A%E2%1EaG%E4%15%B6%C5J%29%27%1E%149%3E%00%04%BB%7Dq%08F%E0%CE%00%00%00%00IEND%AEB%60%82"\
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

        /*
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
        */
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
