"use strict";

/**
 * 汎用クラス
 */
export default class Utils {
    /**
     * min以上max未満の乱数を返す
     */
    static getRand(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}