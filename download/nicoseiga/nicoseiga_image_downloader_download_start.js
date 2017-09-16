    /**
     * ダウンロード用ファイル名生成.
     */
    function getDownloadFilename() {
        var ret = "["
            + user_name
            + "]"
            + image_title
            + "_"
            + illust_id;
        if (tags != null && tags.length > 0) {
            var tagtext = "[" + tags[0];
            for(var i=1;i < tags.length;i++){
                tagtext += ' ' + tags[i];
            }
            tagtext += "]";
            ret += tagtext;
        }
        // ファイル名禁止文字を置換
        ret = replaceFilenameForbidden(ret);
        console.log(ret);
        return ret;
    }

    /**
     * 画像ダウンロード.
     */
    function downloadImage() {
        if (illust_id != null) {
            filename = getDownloadFilename();
            if (filename != null) {
                saveFile(script_root_uri + "/dlimage.php?id=" + illust_id + "&dlname=" + filename, filename);
            }
        }
    }

    printMetaData();
    // ダウンロード実行.
    downloadImage();
