<?php
function get_urldlcontents($url, $file_name){
    #header
    $headers = get_headers($url, 1);
    if ($headers['Content-Type'] != null) {
        header("Content-Type: ".$headers['Content-Type']."\r\n");
    }
    header("Access-Control-Allow-Origin: *\r\n");
    header("Referer: ".$url."\r\n");
    header("Content-Disposition: attachment; filename=\"".$file_name."\"\r\n");

    #contents
    return file_get_contents($url);
}
?>