/*
 * ロジックユーティリティ.
 */

    /**
     * スリープ付きループ処理.
     * @description 繰り返し毎に一定時間のスリープを入れるループ処理.
     * 本処理の引数にループ回数が渡される.本処理でfalseを返すとループを中断する.
     * @param {number} aLoopLimit ループ回数上限.
     * @param {number} aInterval スリープ時間[msec].
     * @param {function} aMainFunc ループ毎に実行する処理.
     */
    function loopSleep(aLoopLimit, aInterval, aMainFunc){
        var i = 0;
        var loopFunc = function () {
            var result = aMainFunc(i);
            if (result === false
                || mCapturingState != 1) {
                return;
            }
            i = i + 1;
            if (i < aLoopLimit) {
                setTimeout(loopFunc, aInterval);
            }
        }
        loopFunc();
    }