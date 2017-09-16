/*
 * ロジックユーティリティ.
 */

    /**
     * スリープ付きループ処理.
     * @description 繰り返し毎に一定時間のスリープを入れるループ処理.
     * 本処理の引数にループ回数が渡される.
     * 本処理でfalseを返す、またはループ中断条件でtrueを返すとループを中断する.
     * @param {number} aLoopLimit ループ回数上限.
     * @param {number} aInterval スリープ時間[msec].
     * @param {function} aMainFunc ループ毎に実行する処理.
     * @param {function} aBreakFunc ループ中断条件(trueを返すと中断する).
     */
    function loopSleep(aLoopLimit, aInterval, aMainFunc, aBreakFunc){
        var i = 0;
        var loopFunc = function () {
            if (aBreakFunc(i)) return;
            var result = aMainFunc(i);
            if (result === false) return;
            i = i + 1;
            if (i < aLoopLimit) {
                setTimeout(loopFunc, aInterval);
            }
        }
        loopFunc();
    }