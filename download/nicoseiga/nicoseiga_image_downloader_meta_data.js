    /* 画像メタデータ start. */
    /**
     * ページのタイトル.
     * @type {string}
     */
    var page_title = getElementText(doc.querySelector("title"));

    /**
     * ユーザー名.
     * @type {string}
     */
    var user_name = getElementText(doc.querySelector("li.user_name strong"));
    if (user_name == "null") {
        user_name = getElementText(doc.querySelector("div.illust_user_name strong"));
    }

    /**
     * 画像タイトル.
     * @type {string}
     */
    var image_title = getElementText(doc.querySelector("h1.title"));
    if (image_title == "null") {
        image_title = getElementText(doc.querySelector("li.active span[itemprop='title']"));
    }

    /**
     * 画像のタグ配列.
     * @type {string[]}
     */
    var tags = Video.tags;

    /**
     * イラストID.
     * @type {string}
     */
    var illust_id = window.location.href.match(".+/im(.+?)([\?#;].*)?$")[1]

    /**
     * メタデータログ出力.
     */
    function printMetaData() {
        console.log("page_title:" + page_title);
        console.log("user_name:" + user_name);
        console.log("image_title:" + image_title);
        console.log("illust_id:" + illust_id)
        console.log(tags);
    }
    /* 画像メタデータ end. */
