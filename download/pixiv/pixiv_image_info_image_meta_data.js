/* pixiv 画像メタデータ start. */

    /** 画像ID.
     * @type {string}
     */
    var image_id = null;
    function getImageId() {
        var ret,kv;
        var pair=location.search.substring(1).split('&');
        // URLのqueryパラメータから最初の1文字(?記号)を除いた文字列を取得し、&で区切り配列に分割する
        for(var i=0;pair[i];i++) {
            // 変数kvにpairを=で区切り配列に分割する
            kv = pair[i].split('=');
            if (kv[0] == "illust_id") {
                ret = kv[1];
                break;
            }
        }
        return ret;
    }
    image_id = getImageId();

    /** 画像メタデータ. */
    var image_meta = globalInitData.preload.illust[image_id];

    /** ページのタイトル.
     * @type {string}
     */
    var page_title = getElementText(document.querySelector("title"));
    /** ユーザーID.
     * @type {string}
     */
    var user_id = image_meta.userId;
    /** ユーザー名.
     * @type {string}
     */
    var user_name = globalInitData.preload.user[user_id].name;
    /** 画像タイトル.
     * @type {string}
     */
    var image_title = image_meta.illustTitle;
    /** 画像枚数.
     * @type {number}
     */
    var page_count = image_meta.pageCount;
    /** 画像サイズ(w x h).
     * @type {string}
     */
    var image_size = null;
    /** 画像サイズ.
     * @type {number}
     */
    var image_size_w = image_meta.width;
    var image_size_h = image_meta.height;
    if (image_size_w != null && image_size_h != null) {
        image_size = image_size_w + " x " + image_size_h;
    }
    /** 画像のキャプション.
     * @type {string}
     */
    var caption = image_meta.illustComment;
    /** 画像のタグ配列.
     * @type {string[]}
     */
    var tags = new Array();
    image_meta.tags.tags.forEach(function(element) {
        tags.push(element.tag);
    }, this);
    /** 閲覧数.
     * @type {number}
     */
    var view_count = image_meta.viewCount;
    /** お気に入り数.
     * @type {number}
     */
    var like_count = image_meta.likeCount;
    /** ブックマーク数.
     * @type {number}
     */
    var bookmark_count = image_meta.bookmarkCount;

    /** 共通画像URL.
     * @type {string}
     * @description (例) http://i4.pixiv.net/c/150x150/img-master/img/2015/07/02/21/03/35/51204151_p0_master1200.jpg */
    //var common_image_url = document.querySelector('meta[property="og:image"]').getAttribute("content");
    var common_image_url = image_meta.urls.thumb;
    console.log(common_image_url);
    /** 共通画像URLオリジン部分.
     * @type {string}
     * @description (例)「http://i4.pixiv.net」 */
    var image_url_origin = null;
    /** 画像サイズ種別ディレクトリ部分.
     * @type {string}
     * @description (例)「/c/150x150/img-master/img」 */
    var image_url_dir_imgsize = null;
    /** 日時ディレクトリ部分.
     * @type {string}
     * @description (例)「/2015/07/02/21/03/35/」 */
    var image_url_dir_datetime = null;
    var datetime_YYYY = null;
    var datetime_MM = null;
    var datetime_DD = null;
    var datetime_hh = null;
    var datetime_mm = null;
    var datetime_ss = null;
    /** ファイル名イラストID部分.
     * @type {string}
     * @description (例)「51204151」 */
    var image_url_filename_illust_id = null;
    /** ファイル名ページ番号部分.
     * @type {string}
     * (例)「_p」 */
    var image_url_filename_p = "_p";
    /** ファイル名ページ番号より後の部分.
     * @type {string}
     * (例)「_master1200」 */
    var image_url_filename_after_p = null;
    /** 拡張子部分.
     * @type {string}
     * (例)「jpg」 */
    var image_url_filename_exe = null;
    /** 画像URLパース成功フラグ.
     * @type {boolean}
     */
    var isParsedImageUrl = false;
    /** 画像URLパーサー.
     * @type {URL}
     */
    var url_parser = null;
    if (!isEmpty(common_image_url)) {
        url_parser = new URL(common_image_url);
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
    /** 画像投稿日時.
     * @type {string}
     */
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

    /* 画像URL start. */
    /**
     * サムネイル表示用画像URL取得.
     * @param {number} page_num ページ番号.
     * @returns {string} サムネイル表示用画像URL.
     */
    function getThumbnailImageUrl(page_num) {
        var ret = image_url_origin
                + "/c/240x240/img-master/img"
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
    /**
     * 表示用中サイズ画像URL取得.
     * @param {number} page_num ページ番号.
     * @returns {string} 表示用中サイズ画像URL.
     */
    function getMediumSizeImageUrl(page_num) {
        return image_url_origin
                + "/c/540x540_70/img-master/img"
                + image_url_dir_datetime
                + image_url_filename_illust_id
                + image_url_filename_p
                + page_num
                + image_url_filename_after_p
                + "."
                + image_url_filename_exe
                ;
    }
    /**
     * 表示用大サイズ画像URL取得.
     * @param {number} page_num ページ番号.
     * @returns {string} 表示用大サイズ画像URL.
     */
    function getLargeSizeImageUrl(page_num) {
        return image_url_origin
                + "/img-master/img"
                + image_url_dir_datetime
                + image_url_filename_illust_id
                + image_url_filename_p
                + page_num
                + image_url_filename_after_p
                + "."
                + image_url_filename_exe
                ;
    }
    /**
     * ダウンロード用画像(オリジナル画像)URL取得.
     * @param {number} page_num ページ番号
     * @returns {string} ダウンロード用画像URL.
     */
    function getDownloadImageUrl(page_num) {
        /* 
         * オリジナル画像はなにかアクセス制限があるらしく、直接開くと403エラーになる。
         * pixivページ等から一度画像を表示した後は正しく表示される。
         * 確実に表示する方法がわかるまでは暫定で1200x1200画像のURLを返すようにする。
         */
        var ret = image_url_origin
                + "/img-original/img"
                + image_url_dir_datetime
                + image_url_filename_illust_id
                + image_url_filename_p
                + page_num
                + "."
                + image_url_filename_exe
                ;
        // var ret = getLargeSizeImageUrl(page_num);
        console.log(ret);
        return ret;
    }
    /* 画像URL end. */

    /** うごイラZip URL.
     * @type {string}
     */
    var ugoIllZipUrl;
    // if (pixiv.context.ugokuIllustData != null) {
    //     ugoIllZipUrl = pixiv.context.ugokuIllustData.src;
    // }
    /** うごイラZip URL(High Quority).
     * @type {string}
     */
    var ugoIllHQZipUrl;
    // if (pixiv.context.ugokuIllustFullscreenData != null) {
    //     ugoIllHQZipUrl = pixiv.context.ugokuIllustFullscreenData.src;
    // }
/* pixiv 画像メタデータ end. */
