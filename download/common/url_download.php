<?php
function put_help() {
    header("Content-Type: text/html\r\n");
    header("Access-Control-Allow-Origin: *\r\n");
    echo("
    <html><head><title>help</title></head>
    <body>
        [how to use]<br>
        /url_download.php?url=[ダウンロードしたいURL]&dlname=[ダウンロードコンテンツにつけるファイル名]&referer=[リファラー]
    </body>
    </html>
    ");
}
$url = $_GET['url'];
if ($url == null) {
    echo put_help();
} else {
    $dlname = $_GET['dlname'];
    if ( $dlname == null) {
        $dlname = 'tmp';
    }
    $referer = $_GET['referer'];
    if ( $referer == null) {
        $referer = $url;
    }
    require_once('get_urldlcontents.php');
    $file = get_urldlcontents($url, $dlname, $referer);
    echo $file;
}
?>