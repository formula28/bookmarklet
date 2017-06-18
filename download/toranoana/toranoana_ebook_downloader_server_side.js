/*
とらのあなの電子書籍閲覧ページから画像を保存するbookmarkletです。
*/
//(function(){
    /* ルートURI. */
    var root_uri = "http://www.formula25.sakura.ne.jp";

    /* ライブラリのinclude. */
    ["jszip.min.js"].forEach(function(value) {
        var script = document.createElement("script");
        script.src = root_uri + "/bookmarklet/common/library/" + value;
        document.body.appendChild(script);
    });

    /* ユーティリティ start. */
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
    /* 属性値設定処理(elem要素のattr属性にattrValueを設定する).
    */
    function changeAttr(elem,attr,attrValue) {
        if (elem != null && attr != null) {
            elem.setAttribute(attr,attrValue);
        }
    }
    /* 属性値設定単体切替処理(elem要素のattr属性にattrValueが含まれれば削除、含まれなければ追加する). */
    function toggleAttr(elem,attr,attrValue) {
        if (elem != null && attr != null) {
            var curAttrList = elem.getAttribute(attr).split(/\s+/);
            var i = 0;
            for (i=0;i<curAttrList.length;i++) {
                if (curAttrList[i]==attrValue) {
                    curAttrList[i] = "";
                    break;
                }
            }
            if (i >= curAttrList.length) {
                curAttrList.push(" "+attrValue);
            }
            elem.setAttribute(attr,curAttrList.join(' ').split(/\s+/).join(' '));
        }
    }
    /* マウスオーバー状態切替. */
    function toggleMouseOverState(elem) {
        toggleAttr(elem,'class','normal');
        toggleAttr(elem,'class','over');
    }
    /* html elementをStringに変換. */
    function getElementText(element) {
        var ret = 'null';
        if(element != null){
            ret = element.textContent;
        }
        return ret;
    }

    /* DataURLからBlobURLへ変換. */
    function convertDataUrlToBlobUrl(dataUrl) {
        var bin = atob(dataUrl.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        // Blobを作成
        var blob = new Blob([buffer.buffer], {type: "image/png"});
        return window.URL.createObjectURL(blob);
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

    /* ファイル保存. */
    function saveFile(aUrl, aFilename) {
        console.log(aFilename);
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
    /* 非負整数値の10進数での桁数. */
    function getDecimalNumberLength(aNum) {
        var ret = 0;
        if (aNum > 0) {
            ret = Math.floor(Math.log(aNum) * Math.LOG10E) + 1;
        } else if (aNum == 0) {
            ret = 1;
        }
        return ret;
    }
    /* 非負整数値0詰め文字列. */
    function getZeroFillString(aNum, aSize) {
        var ret = "";
        if (0 <= aNum && 0 < aSize) {
            for (var i=0;i<aSize-getDecimalNumberLength(aNum);i++) {
                ret += "0";
            }
        }
        ret += String(aNum);
        return ret;
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
    /* <style>~</style>. */
    function appendStyle(parent) {
        var elem = parent.querySelector("style.toranoana_ebook_download");
        if (elem != null) {
            parent.removeChild(elem);
        }
        var text = "";
        // キャプチャボタン.
        text += '#captureBtnArea {\n'
        text += 'position:absolute;\n'
        text += 'bottom:100px;\n'
        text += '}\n';

        text += '[class*="captureBtn"] {\n'
        text += 'width:120px;\n'
        text += 'height:40px;\n'
        text += 'margin:3px;\n'
        text += 'display: inline-block;\n';
        text += 'text-align: center;\n';
        text += 'vertical-align: middle;\n';
        text += '}\n';

        text += '[class*="captureBtn"][class*="normal"]\n';
        text += '{\n';
        text += 'border: solid #CCC;\n';
        text += 'border-width:1px 3px 3px 1px;\n';
        text += 'border-radius: 8px;\n';
        text += '-ms-border-radius: 8px;\n';
        text += '-moz-border-radius: 8px;\n';
        text += '-webkit-border-radius: 8px;\n';
        text += 'background: -ms-linear-gradient(top,#FFF 0%,#FFF 3%,#E6E6E6 3%,#FFF);\n';
        text += 'background: -moz-linear-gradient(top,#FFF 0%,#FFF 3%,#E6E6E6 3%,#FFF);\n';
        text += 'background: -webkit-gradient(linear, left top, left bottom, from(#FFF), color-stop(0.03,#FFF), color-stop(0.03,#E6E6E6), to(#FFF));\n';
        text += 'color: #111;\n';
        text += '}\n';

        text += '[class*="captureBtn"][class*="over"] \n';
        text += '{\n';
        text += 'border: solid #0099CC;\n';
        text += 'border-width:1px 3px 3px 1px;\n';
        text += 'border-radius: 8px;\n';
        text += '-ms-border-radius: 8px;\n';
        text += '-moz-border-radius: 8px;\n';
        text += '-webkit-border-radius: 8px;\n';
        text += 'background: -ms-linear-gradient(top,#B1D2E0 0%,#B1D2E0 3%,#0099CC 3%,#069);\n';
        text += 'background: -moz-linear-gradient(top,#B1D2E0 0%,#B1D2E0 3%,#0099CC 3%,#069);\n';
        text += 'background: -webkit-gradient(linear, left top, left bottom, from(#B1D2E0), color-stop(0.03,#B1D2E0), color-stop(0.03,#0099CC), to(#069));\n';
        text += 'color: #eee;\n';
        text += '}\n';

        text += '.captureBtn span\n';
        text += '{\n';
        text += 'position:relative;';
        text += 'top: 50%;\n';
        text += 'transform:translateY(-50%);\n';
        text += 'display:inline-block;';
        text += 'padding: 5px;\n';
        text += 'font-size: 14px;\n';
        text += '}\n';

        var node = document.createTextNode(text);
        var style = document.createElement('style');
        style.setAttribute("class","toranoana_ebook_download");
        style.appendChild(node);
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
    /* ページ内にZipファイル保存ボタンを追加. */
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
        var pages = document.querySelectorAll("canvas.content_canvas");
        var urls = [];
        for (var i=0;i<pages.length;i++) {
            // ※※※ 注意 ※※※
            // 画像データが「https://s3-ap-northeast-1.amazonaws.com/viewer.toraebook.com」に存在し、
            // クロスオリジン制約に抵触するため、通常のブラウザではcanvasからtoDataURLでDataURLが取得できない。
            // SecurityError が発生する。
            // GoogleChromeでは、オプションを付けて起動することで回避可能。
            // chrome.exe --disable-web-security --user-data-dir
            // ※※※ 注意 ※※※
            if (pages[i].width > 0 && pages[i].height > 0) {
                urls.push(pages[i].toDataURL());
            }
        }
        return urls;
    }
    /* 表示中のページ番号取得(0始まり.複数ページ表示している場合は最小の番号). */
    function getPageIndex() {
        var pnum_int = 0;
        if (currentPage) {
            // currentPage defined in http://viewer.toraebook.com/imageviewer/js/viewer.js
            pnum_int = currentPage;
            console.log("currentPage:"+currentPage);
        }
        return pnum_int;
    }
    /* ページ数取得. */
    var mPageNum = 0;
    function getPageLength() {
        var pnum_int = mPageNum;
        // pageInfo() defined in http://viewer.toraebook.com/imageviewer/js/viewer.js
        var pi = pageInfo();
        if (pi != null) {
            mPageNum = pnum_int = parseInt(pi.max);
        }
        return pnum_int;
    }
    /* 書籍タイトル取得. */
    function getBookTitle() {
        var pnum_node = document.querySelector("title");
        return getElementText(pnum_node);
    }
    /* 表示中のページ画像を保存. */
    function captureImgs() {
        var urls = getPageUrl();
        for (var i=urls.length-1; i>=0; i--) {
            saveFile(urls[i], getZeroFillString(getPageIndex()+urls.length-2-i, getDecimalNumberLength(getPageLength())) + ".png");
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
    /* スリープ付きループ処理.
        aLoopLimit:ループ回数上限.
        aInterval:スリープ時間[msec].
        aMainFunc:ループ毎に実行する処理.
    */
    function loopSleep(aLoopLimit, aInterval, aMainFunc){
        var i = 0;
        var loopFunc = function () {
            var result = aMainFunc(i);
            if (result === false
                || mCapturingState != 1) {
                return;
            }
            i = i + 1;
            if (i < aLoopLimit) {
                setTimeout(loopFunc, aInterval);
            }
        }
        loopFunc();
    }
    /* 自動ページ画像保存開始. */
    function startAutoCaptureSequence() {
        // 状態遷移.
        changeCapturingState(1);
        loopSleep(getPageLength(), 700, function() {
            var isSuccess = true;
            try {
                // ページ画像をZIPに追加.
                var urls = getPageUrl();
                for (var i=urls.length-1; i>=0; i--) {
                    zip.file(getZeroFillString(getPageIndex()+urls.length-2-i, getDecimalNumberLength(getPageLength())) + ".png", convertDataUrlToArrayBuffer(urls[i]));
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
        var nextBtn = document.querySelector("#box_left");
        var ret = false;
        if (nextBtn != null) {
            var event = document.createEvent( "MouseEvents" );
            event.initEvent("mousedown", true, true);
            nextBtn.dispatchEvent(event);
            event = document.createEvent( "MouseEvents" );
            event.initEvent("mouseup", true, true);
            nextBtn.dispatchEvent(event);
            ret = true;
        }
        return ret;
    }
    /* 自動ページ画像保存 end. */

    appendHtml();
//})();