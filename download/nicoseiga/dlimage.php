<?php
/*
ニコニコ静画画像ダウンロード.
*/
require('niconico_client.php');
require('../common/get_urldlcontents.php');
$user_id = '';// メールアドレス、または電話番号.
$pass_word = '';// パスワード.

$illust_id = $_GET['id'];
if (empty($illust_id)) {
    return;
}
$download_file_name = $_GET['dlname'];
if (empty($download_file_name)) {
    $download_file_name = $illust_id;
}

// 画像ソースページを取得.
$nico_client = new NiconicoClient($user_id, $pass_word);
$image_source_html = $nico_client->get_image_source_page($illust_id);
$image_source_html = mb_convert_encoding($image_source_html, 'HTML-ENTITIES', 'UTF-8');
$image_source_dom = new DOMDocument();
@$image_source_dom->loadHTML($image_source_html);
$image_source_xpath = new DOMXPath($image_source_dom);

// 画像ソースページから画像のURLをパース.
$node = $image_source_xpath->query('//div[@id="content"]/div[@class="illust_view_big"]/img[@src]')->item(0);
if ($node == null) {
    return;
}
$image_url = $image_source_xpath->query('.//@src', $node)->item(0)->nodeValue;

// 画像出力.
echo(get_urldlcontents('http://lohas.nicoseiga.jp'.$image_url, $download_file_name));
?>