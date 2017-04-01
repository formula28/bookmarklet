<?php
Class NiconicoClient {
    // クッキー.
    var $cookie = 'cookie';
    // ID.
    var $id;
    // パスワード.
    var $password;

    // コンストラクタ.
    // ニコニコにログインし、セッションを保持する.
    function __construct($mail_tel, $passwd) {
        $this->id = $mail_tel;
        $this->password = $passwd;
        // URL.
        $url = 'https://account.nicovideo.jp/api/v1/login?site=niconico';
        // POSTデータ.
        $post_data = array(
            'next_url' => '',
            'mail_tel' => $this->id,
            'password' => $this->password,
            'auth_id' => '1730473446', //フィンガープリント(どんな環境からアクセスしているかを表す)値. なくてもログインできるが、適当な値を指定しておく.
        );

        $curl = curl_init();
        // URLを設定.
        curl_setopt($curl, CURLOPT_URL, $url);
        // メソッドをPOSTに設定.
        curl_setopt ($curl, CURLOPT_POST, true);
        // POSTデータ設定.
        curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
        // クッキー保存ファイルを指定.
        curl_setopt($curl, CURLOPT_COOKIEJAR, $this->cookie);
        // Locationをたどる
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        // 返り値を取得する.
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        // ログイン実行.
        $page = curl_exec($curl);
        //echo($page); //ログイン後のページ表示. ログイン成功したか確認したい場合に蓋開け.

        // cURLのリソースを解放する
        curl_close($curl);
    }

    // ニコニコ静画のイラストソースページ取得.
    public function get_image_source_page($illust_id) {
        $ret = null;
        if (!empty($illust_id)) {
            // URL.
            $url = "http://seiga.nicovideo.jp/image/source/".$illust_id;

            $curl = curl_init();
            // URLを設定.
            curl_setopt($curl, CURLOPT_URL, $url);
            // クッキー読み込みファイルを指定.
            curl_setopt($curl, CURLOPT_COOKIEFILE, $this->cookie);
            // Locationをたどる
            curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
            // 返り値を取得する.
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

            // ページ取得.
            $ret = curl_exec($curl);
            // cURLのリソースを解放する
            curl_close($curl);
        }
        return $ret;
    }
}
?>
