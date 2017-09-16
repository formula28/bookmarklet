/* pixiv 画像メタデータ start. */
    /** ページのタイトル.
     * @type {string}
     */
    var page_title = getElementText(document.querySelector("title"));
    /** ユーザーID.
     * @type {string}
     */
    var user_id = pixiv.context.userId;
    /** ユーザー名.
     * @type {string}
     */
    var user_name = pixiv.context.userName;
    if (user_name == null) {
        user_name = getElementText(document.querySelector(".profile-unit .user"));
    }
    /** 画像ID.
     * @type {string}
     */
    var image_id = pixiv.context.illustId;
    /** 画像タイトル.
     * @type {string}
     */
    var image_title = pixiv.context.illustTitle;
    if (image_title == null) {
        image_title = getElementText(document.querySelector("section.work-info .title"));
    }
    /** 画像サイズ(w x h).
     * @type {string}
     */
    var image_size = null;
    image_size = getElementText(document.querySelectorAll("section.work-info .meta li")[1]);
    /** 画像枚数.
     * @type {number}
     */
    var page_count = 1;
    if (image_size != null
        && /複数枚投稿\s*([0-9]+)/.test(image_size)) {
        page_count = RegExp.$1;
    }
    /** 画像サイズ.
     * @type {number}
     */
    var image_size_w = pixiv.context.illustSize[0];
    var image_size_h = pixiv.context.illustSize[1];
    if (image_size_w != null && image_size_h != null) {
        image_size = image_size_w + " x " + image_size_h;
    }
    /** 作成ツール.
     * @type {string}
     */
    var draw_tools = getElementText(document.querySelector("section.work-info .meta .tools"));
    /** 画像のキャプション.
     * @type {string}
     */
    var caption = getElementText(document.querySelector("section.work-info .caption"));
    /** 画像のタグ配列.
     * @type {string[]}
     */
    var tags = new Array();
    var tagsNodeList = document.querySelectorAll("section.work-tags .tags-container .tags .tag a.text");
    for(var i=0;i < tagsNodeList.length;i++){
        tags.push(getElementText(tagsNodeList[i]));
    }
    /** 閲覧数.
     * @type {string}
     */
    var view_count = getElementText(document.querySelector("section.work-info section.score .view-count"));
    /** 評価回数.
     * @type {string}
     */
    var rated_count = getElementText(document.querySelector("section.work-info section.score .rated-count"));
    /** 総合点.
     * @type {string}
     */
    var score_count = getElementText(document.querySelector("section.work-info section.score .score-count"));

    /** 共通画像URL.
     * @type {string}
     * @description (例) http://i4.pixiv.net/c/150x150/img-master/img/2015/07/02/21/03/35/51204151_p0_master1200.jpg */
    //var common_image_url = document.querySelector('meta[property="og:image"]').getAttribute("content");
    var common_image_url = "";
    var common_image = document.querySelector('.works_display ._layout-thumbnail img');
    if (common_image != null && common_image.getAttribute("src") != null) {
        common_image_url = common_image.getAttribute("src");
    }
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
    /**
     * 表示用中サイズ画像URL取得.
     * @param {number} page_num ページ番号.
     * @returns {string} 表示用中サイズ画像URL.
     */
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
    /**
     * 表示用大サイズ画像URL取得.
     * @param {number} page_num ページ番号.
     * @returns {string} 表示用大サイズ画像URL.
     */
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
    /* 画像URL end. */

    /** うごイラZip URL.
     * @type {string}
     */
    var ugoIllZipUrl;
    if (pixiv.context.ugokuIllustData != null) {
        ugoIllZipUrl = pixiv.context.ugokuIllustData.src;
    }
    /** うごイラZip URL(High Quority).
     * @type {string}
     */
    var ugoIllHQZipUrl;
    if (pixiv.context.ugokuIllustFullscreenData != null) {
        ugoIllHQZipUrl = pixiv.context.ugokuIllustFullscreenData.src;
    }
/* pixiv 画像メタデータ end. */
