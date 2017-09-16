/*
SonyのReaderStoreのブラウザ閲覧ページから画像を保存するbookmarkletです。
保存を開始する前にReaderのページ中央上部または中央下部をクリックして、
ナビゲーションを表示させておく必要があります。
今のところGoogleChromeのみ動作確認.
ボタン
    [capture One]
    [capture Auto]⇒([stop]⇔[restart])⇒[save Zip]
    [save Zip]
*/
//(function(){
    /* ルートURI. */
    var root_uri = "http://www.formula25.sakura.ne.jp";
    /* このスクリプトのルートURI. */
    var script_root_uri = root_uri + "/bookmarklet/download/reader_store";

    /* ライブラリのinclude. */
    var jss = document.querySelectorAll("script.sony_book_download_subscr");
    if (jss != null && jss.length > 0) {
        jss.forEach(function(value){
            document.body.removeChild(value);
        })
    }
    ["jszip.min.sbd.js"
    , "mylib_util_dom.js"
    , "mylib_util_str.js"
    , "mylib_util_file.js"
    , "mylib_util_logic.js"
    ].forEach(function(value) {
        var s = document.createElement("script");
        s.setAttribute("class","sony_book_download_subscr");
        s.setAttribute("src", root_uri + "/bookmarklet/common/library/" + value);
        document.body.appendChild(s);
    });

    /* DOM追加処理 start. */
    /**
     * <html>以下要素追加.
     */
    function appendHtml() {
        appendHead();
        appendBody();
    }
    /**
     * <head>以下要素追加.
     */
    function appendHead() {
        appendStyle(document.head);
    }
    /**
     * スタイルシート要素追加.
     * @param {Element} parent 親要素.
     */
    function appendStyle(parent) {
        var elem = parent.querySelector("link.sony_book_download");
        if (elem != null) {
            parent.removeChild(elem);
        }
        var html = '\
        <link\
            class="sony_book_download"\
            rel="stylesheet"\
            type="text/css"\
            href= "' + script_root_uri + '/book_marklet_style.css">';
        parent.insertAdjacentHTML("beforeend", html);
    }
    /**
     * <body>以下要素追加.
     */
    function appendBody() {
        appendCaptureBtnArea(document.body);
    }
    /**
     * ボタンエリア追加.
     * @param {Element} parent 親要素.
     */
    function appendCaptureBtnArea(parent) {
        var elem = parent.querySelector("#captureBtnArea");
        if (elem != null) {
            parent.removeChild(elem);
        }
        var html = '\
        <div id="captureBtnArea">\
            <!-- 画像取得ボタン(1ページ取得用) -->\
            <div id="captureOneBtn"\
                class="captureBtn normal"\
                onMouseout="toggleMouseOverState(document.querySelector(\'#captureOneBtn\'))"\
                onMouseover="toggleMouseOverState(document.querySelector(\'#captureOneBtn\'))"\
                onClick="captureImgs()">\
                <span>capture One</span>\
            </div>\
            <!-- 画像取得ボタン(連続取得用) -->\
            <div id="captureAutoBtn"\
                class="captureBtn normal"\
                onMouseout="toggleMouseOverState(document.querySelector(\'#captureAutoBtn\'))"\
                onMouseover="toggleMouseOverState(document.querySelector(\'#captureAutoBtn\'))"\
                onClick="startAutoCaptureSequence()">\
                <span>capture Auto</span>\
            </div>\
            <!-- Zip保存ボタン -->\
            <div id="saveZipBtn"\
                class="captureBtn normal"\
                onMouseout="toggleMouseOverState(document.querySelector(\'#saveZipBtn\'))"\
                onMouseover="toggleMouseOverState(document.querySelector(\'#saveZipBtn\'))"\
                onClick="saveZip()">\
                <span>save Zip</span>\
            </div>\
        </div>';
        parent.insertAdjacentHTML("beforeend", html);
    }
    /**
     * マウスオーバー状態切替.
     * @param {Element} elem 対象要素.
     */
    function toggleMouseOverState(elem) {
        toggleAttr(elem,'class','normal');
        toggleAttr(elem,'class','over');
    }
    /** キャプチャボタンラベル配列. */
    var captureBtnLabel = ["capture Auto","stop","restart", "save Zip"];
    /**
     * 画像取得ボタン変更.
     * @description 自動ページ保存処理状態(mCapturingState)に連動したボタンに変更する.
     * @param {number} aState 自動ページ保存状態.
     */
    function changeCaptureBtn(aState) {
        var elem = document.querySelector("#captureAutoBtn");
        var text = document.querySelector("#captureAutoBtn span");
        if (elem != null && text != null) {
            switch(aState) {
            case 0:
                text.innerHTML = captureBtnLabel[0];
                changeAttr(elem, "onclick","startAutoCaptureSequence()");
                break;
            case 1:
                text.innerHTML = captureBtnLabel[1];
                changeAttr(elem, "onclick","changeCapturingState(2)");
                break;
            case 2:
                text.innerHTML = captureBtnLabel[2];
                changeAttr(elem, "onclick","startAutoCaptureSequence()");
                break;
            case 3:
                text.innerHTML = captureBtnLabel[3];
                changeAttr(elem, "onclick", "saveZip()");
                break;
            default:
                break;
            }
        }
    }
    /* DOM追加処理 end. */

    /* ページ情報 start. */
    /** ページcanvasのDataUrlを取得.
     * @return {string[]}
     */
    function getPageUrl() {
        var pages = document.querySelectorAll("#viewer .page canvas");
        var urls = [];
        for (var i=0;i<pages.length;i++) {
            urls.push(pages[i].toDataURL());
        }
        return urls;
    }
    /** 表示中のページ番号取得.
     * @description 0始まり.今のところ、下のナビゲーションが表示されている場合のみ有効.複数ページ表示している場合は最小の番号.
     * @return {number}
     */
    function getPageIndex() {
        var pnum_node = document.querySelector(".Pagenumber .indexLabel");
        var pnum_text = getElementText(pnum_node);
        var pnum_int = 0;
        if (pnum_text != null) {
            pnum_int = parseInt(pnum_text);
        }
        return pnum_int;
    }
    /** ページ数取得.
     * @description 今のところ、下のナビゲーションが表示されている場合のみ有効.
     * @return {number}
     */
    function getPageLength() {
        var pnum_node = document.querySelector(".Pagenumber .maxIndexLabel");
        var pnum_text = getElementText(pnum_node);
        var pnum_int = 0;
        if (pnum_text != null) {
            pnum_int = parseInt(pnum_text);
        }
        return pnum_int;
    }
    /** 書籍タイトル取得.
     * @description 今のところ、下のナビゲーションが表示されている場合のみ有効.
     * @return {string}
     */
    function getBookTitle() {
        var pnum_node = document.querySelector(".Menubar_top .title");
        return getElementText(pnum_node);
    }
    /** ページめくり順方向取得.
     * @description ページめくり順方向を返却する. 方向定義(0:左から右, 1:右から左).
     * @return {number}.
     */
    function getPageMoveDirection() {
        var dir = 0;
        var nextBtn = document.querySelector("button.next");
        if (hasAttrValue(nextBtn, "class", "Left")) {
            dir = 1;
        }
        return dir;
    }
    /* ページ情報 end. */

    /** 表示中のページ画像を保存. */
    function captureImgs() {
        var urls = getPageUrl();
        var page_num_digis = getDecimalNumberLength(getPageLength());
        var page_direc = getPageMoveDirection();
        
        for (var i=0; i<urls.length; i++) {
            saveFile(urls[(page_direc==0?i:urls.length-1-i)]
                    , getZeroFillString(getPageIndex()+i-1, page_num_digis) + ".png");
        }
    }

    /* 自動ページ画像保存 start. */
    /** 保存用ZIP. */
    var zip = null;
    /** 自動ページ保存処理状態.
     * @description 0:初期状態(処理を開始していない、またはリセットされた状態)
     * @description 1:処理中状態(保存処理実行中の状態)
     * @description 2:停止状態(保存処理を停止している状態、再開可能)
     * @description 3:完了状態(全ページ保存完了した状態)
    */
    var mCapturingState = 0;
    /**
     * 自動ページ保存処理状態変更.
     * @param {number} aState 遷移先の自動ページ保存処理状態.
     */
    function changeCapturingState(aState) {
        switch(aState) {
        case 0:
            zip = null;
            mCapturingState = 0;
            changeCaptureBtn(mCapturingState);
            break;
        case 1:
            if (mCapturingState == 0) {
                zip = new JSZip();
            }
            mCapturingState = 1;
            changeCaptureBtn(mCapturingState);
            break;
        case 2:
            mCapturingState = 2;
            changeCaptureBtn(mCapturingState);
            break;
        case 3:
            mCapturingState = 3;
            changeCaptureBtn(mCapturingState);
            break;
        default:
            break;
        }
    }
    /** 取得した画像をZipで保存. */
    function saveZip() {
        var zip_blob_url = null;
        if (zip != null) {
            zip_blob_url = window.URL.createObjectURL(zip.generate({ type: 'blob' }));
        }
        var filename = getBookTitle();
        if (filename == null) {
            filename = "book.zip";
        }
        saveFile(zip_blob_url, filename);
    }
    /** 自動ページ画像保存開始. */
    function startAutoCaptureSequence() {
        // 状態遷移.
        changeCapturingState(1);
        var page_num_digis = getDecimalNumberLength(getPageLength());
        var page_direc = getPageMoveDirection();
        loopSleep(
            getPageLength()
            , 700
            , function() {
                var isSuccess = true;
                try {
                    // ページ画像をZIPに追加.
                    var urls = getPageUrl();
                    for (var i=0; i<urls.length; i++) {
                        zip.file(getZeroFillString(getPageIndex()+i-1, page_num_digis) + ".png"
                                , convertDataUrlToArrayBuffer(urls[(page_direc==0?i:urls.length-1-i)]));
                    }
                    if (getPageIndex() + urls.length <= getPageLength()) {
                        // 次ページへ.
                        isSuccess = moveNextPage();
                    } else {
                        // 最後のページまで保存完了.
                        changeCapturingState(3);
                    }
                } catch (e) {
                    isSuccess = false;
                    console.log(e);
                }
                return isSuccess;
            }
            , function() {
                return mCapturingState != 1;
            }
        );
    }
    /**
     * 次のページに遷移.
     * @description ページ内ナビゲーションのボタンが表示されている場合のみ有効.
     * @description 次ボタンを押せたかどうか(true/false)を返却する.
     * @return {boolean}.
     */
    function moveNextPage() {
        var nextBtn = document.querySelector("button.next");
        var ret = false;
        if (nextBtn != null) {
            var event = document.createEvent( "MouseEvents" );
            event.initEvent("mousedown", true, true);
            nextBtn.dispatchEvent(event);
            ret = true;
        }
        return ret;
    }
    /* 自動ページ画像保存 end. */

    /* ページ書き出し実行. */
    appendHtml();
//})();