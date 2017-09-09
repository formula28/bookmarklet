/*
 * DOM操作ユーティリティ.
 */

    /**
     * 属性値設定.
     * @description elem要素のattr属性にattrValueを設定する.
     * @param {Element} elem DOM要素.
     * @param {string} attr 属性名.
     * @param {string} attrValue 属性値.
     */
    function changeAttr(elem,attr,attrValue) {
        if (elem != null && attr != null) {
            elem.setAttribute(attr,attrValue);
        }
    }

    /**
     * 属性値設定単体切替.
     * @description elem要素のattr属性にattrValueが含まれれば削除、含まれなければ追加する.
     * @param {Element} elem DOM要素.
     * @param {string} attr 属性名.
     * @param {string} attrValue 属性値.
     */
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

    /**
     * 属性値含有確認.
     * @description elem要素のattr属性にattrValueが含まれるかどうか.
     * @param {Element} elem DOM要素.
     * @param {string} attr 属性名.
     * @param {string} attrValue 属性値.
     * @return {boolean}
     */
    function hasAttrValue(elem,attr,attrValue) {
        var ret = false;
        if (elem != null && attr != null) {
            var curAttrList = elem.getAttribute(attr).split(/\s+/);
            var i = 0;
            for (i=0;i<curAttrList.length;i++) {
                if (curAttrList[i]==attrValue) {
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    }

    /**
     * DOM要素内テキスト取得.
     * @description elemをStringに変換.
     * @param {Node} elem DOM要素.
     * @return {string} DOM要素文字列(elemがnullの場合"null"を返す).
     */
    function getElementText(elem) {
        var ret = 'null';
        if(elem != null){
            ret = elem.textContent;
        }
        return ret;
    }