javascript:(
    function(){
        var elem = document.querySelector("script#[適当なID]");
        if (elem != null) {
            document.body.removeChild(elem);
        }
        var s = document.createElement("script");
        s.setAttribute("charset","UTF-8");
        s.setAttribute("class","[適当なクラス名]");
        s.setAttribute("id","[適当なID]");
        s.setAttribute("src","[サーバサイドのjsのURL]");
        document.body.appendChild(s);
    }
)();
