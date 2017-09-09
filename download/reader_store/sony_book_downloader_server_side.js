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
    ["jszip.min.sbd.js"
    , "mylib_util_dom.js"
    , "mylib_util_str.js"
    , "mylib_util_file.js"
    , "mylib_util_logic.js"
    ].forEach(function(value) {
        var script = document.createElement("script");
        script.src = root_uri + "/bookmarklet/common/library/" + value;
        document.body.appendChild(script);
    });

    /* ユーティリティ start. */
    /* マウスオーバー状態切替. */
    function toggleMouseOverState(elem) {
        toggleAttr(elem,'class','normal');
        toggleAttr(elem,'class','over');
    }
    /* ユーティリティ end. */

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
    /* スタイルシート. */
    function appendStyle(parent) {
        var elem = parent.querySelector("link.sony_book_download");
        if (elem != null) {
            parent.removeChild(elem);
        }
        var style = document.createElement('link');
        style.setAttribute("class","sony_book_download");
        style.setAttribute("rel","stylesheet");
        style.setAttribute("type","text/css");
        style.setAttribute("href",script_root_uri + "/book_marklet_style.css");
        parent.appendChild(style);
    }
    /* <body>~</body>. */
    function appendBody() {
        appendCaptureBtnArea(document.body);
    }
    /* ボタンエリアを追加. */
    function appendCaptureBtnArea(parent) {
        var elem = parent.querySelector("#captureBtnArea");
        if (elem != null) {
            parent.removeChild(elem);
        }
        elem = document.createElement('div');
        elem.setAttribute("id","captureBtnArea");
        parent.appendChild(elem);

        appendCaptureOneBtn(elem);
        appendCaptureAutoBtn(elem);
        appendSaveZipBtn(elem);
    }
    /* ページ内に画像取得ボタン(1ページ取得用)を追加. */
    function appendCaptureOneBtn(parent) {
        var elem = parent.querySelector("#captureOneBtn");
        if (elem != null) {
            parent.removeChild(elem);
        }
        var btn = document.createElement('div');
        btn.setAttribute("id","captureOneBtn");
        btn.setAttribute("class","captureBtn normal");
        btn.setAttribute("onMouseout","toggleMouseOverState(document.querySelector('#captureOneBtn'))");
        btn.setAttribute("onMouseover","toggleMouseOverState(document.querySelector('#captureOneBtn'))");
        btn.setAttribute("onClick","captureImgs()"); //クリックで画像保存.

        var text = "capture One";
        var textElem = document.createElement("span");
        textElem.appendChild(document.createTextNode(text));
        btn.appendChild(textElem);

        parent.appendChild(btn);
    }
    /* ページ内に画像取得ボタン(連続取得用)を追加. */
    function appendCaptureAutoBtn(parent) {
        var elem = parent.querySelector("#captureAutoBtn");
        if (elem != null) {
            parent.removeChild(elem);
        }
        var btn = document.createElement('div');
        btn.setAttribute("id","captureAutoBtn");
        btn.setAttribute("class","captureBtn normal");
        btn.setAttribute("onMouseout","toggleMouseOverState(document.querySelector('#captureAutoBtn'))");
        btn.setAttribute("onMouseover","toggleMouseOverState(document.querySelector('#captureAutoBtn'))");
        btn.setAttribute("onClick","startAutoCaptureSequence()"); //クリックで画像保存.

        var text = "capture Auto";
        var textElem = document.createElement("span");
        textElem.appendChild(document.createTextNode(text));
        btn.appendChild(textElem);

        parent.appendChild(btn);
    }
    /* 画像取得ボタン変更(自動ページ保存処理状態に連動したボタンに変更する). */
    var captureBtnLabel = ["capture Auto","stop","restart", "save Zip"];
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
    /* ページ内に画像取得ボタン(1ページ取得用)を追加. */
    function appendSaveZipBtn(parent) {
        var elem = parent.querySelector("#saveZipBtn");
        if (elem != null) {
            parent.removeChild(elem);
        }
        var btn = document.createElement('div');
        btn.setAttribute("id","saveZipBtn");
        btn.setAttribute("class","captureBtn normal");
        btn.setAttribute("onMouseout","toggleMouseOverState(document.querySelector('#saveZipBtn'))");
        btn.setAttribute("onMouseover","toggleMouseOverState(document.querySelector('#saveZipBtn'))");
        btn.setAttribute("onClick","saveZip()"); //クリックで画像保存.

        var text = "save Zip";
        var textElem = document.createElement("span");
        textElem.appendChild(document.createTextNode(text));
        btn.appendChild(textElem);

        parent.appendChild(btn);
    }
    /* DOM追加処理 end. */

    /* ページcanvasのDataUrlを取得. */
    function getPageUrl() {
        var pages = document.querySelectorAll("#viewer .page canvas");
        var urls = [];
        for (var i=0;i<pages.length;i++) {
            urls.push(pages[i].toDataURL());
        }
        return urls;
    }
    /* 表示中のページ番号取得(0始まり.今のところ、下のナビゲーションが表示されている場合のみ有効.複数ページ表示している場合は最小の番号). */
    function getPageIndex() {
        var pnum_node = document.querySelector(".Pagenumber .indexLabel");
        var pnum_text = getElementText(pnum_node);
        var pnum_int = 0;
        if (pnum_text != null) {
            pnum_int = parseInt(pnum_text);
        }
        return pnum_int;
    }
    /* ページ数取得(今のところ、下のナビゲーションが表示されている場合のみ有効). */
    function getPageLength() {
        var pnum_node = document.querySelector(".Pagenumber .maxIndexLabel");
        var pnum_text = getElementText(pnum_node);
        var pnum_int = 0;
        if (pnum_text != null) {
            pnum_int = parseInt(pnum_text);
        }
        return pnum_int;
    }
    /* 書籍タイトル取得(今のところ、下のナビゲーションが表示されている場合のみ有効). */
    function getBookTitle() {
        var pnum_node = document.querySelector(".Menubar_top .title");
        return getElementText(pnum_node);
    }
    /* ページめくり順方向取得(0:左から右, 1:右から左). */
    function getPageMoveDirection() {
        var dir = 0;
        var nextBtn = document.querySelector("button.next");
        if (hasAttrValue(nextBtn, "class", "Left")) {
            dir = 1;
        }
        return dir;
    }
    /* 表示中のページ画像を保存. */
    function captureImgs() {
        var urls = getPageUrl();
        if(getPageMoveDirection() == 0) {
            // ←方向ページめくり.
            for (var i=0; i<urls.length; i++) {
                saveFile(urls[i], getZeroFillString(getPageIndex()+i-1, getDecimalNumberLength(getPageLength())) + ".png");
            }
        } else {
            for (var i=urls.length-1; i>=0; i--) {
                saveFile(urls[i], getZeroFillString(getPageIndex()+urls.length-2-i, getDecimalNumberLength(getPageLength())) + ".png");
            }
        }
    }

    /* 自動ページ画像保存 start. */
    // 保存用ZIP.
    var zip = null;
    // 自動ページ保存処理状態.
    // 0:初期状態(処理を開始していない、またはリセットされた状態)
    // 1:処理中状態(保存処理実行中の状態)
    // 2:停止状態(保存処理を停止している状態、再開可能)
    // 3:完了状態(全ページ保存完了した状態)
    var mCapturingState = 0;
    /* 自動ページ保存処理状態変更. */
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
    /* 取得した画像をZipで保存. */
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
    /* 自動ページ画像保存開始. */
    function startAutoCaptureSequence() {
        // 状態遷移.
        changeCapturingState(1);
        getPageLength();
        loopSleep(getPageLength(), 700, function() {
            var isSuccess = true;
            try {
                // ページ画像をZIPに追加.
                var urls = getPageUrl();
                if(getPageMoveDirection() == 0) {
                    // ←方向ページめくり.
                    for (var i=0; i<urls.length; i++) {
                        zip.file(getZeroFillString(getPageIndex()+i-1, getDecimalNumberLength(getPageLength())) + ".png", convertDataUrlToArrayBuffer(urls[i]));
                    }
                } else {
                    // →方向ページめくり.
                    for (var i=urls.length-1; i>=0; i--) {
                        zip.file(getZeroFillString(getPageIndex()+urls.length-2-i, getDecimalNumberLength(getPageLength())) + ".png", convertDataUrlToArrayBuffer(urls[i]));
                    }
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
        });
    }
    /* 次のページに遷移(ページ内ナビゲーションのボタンが表示されている場合のみ有効).
        return:次ボタンを押せたかどうか(true/false).
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

    appendHtml();
//})();