"use strict";

import Utils from "./utils";
/** セル生存 */
const ALIVE = true;
/**
 * セル管理クラス
 */
export default class CellController {
    /**
     * コンストラクタ
     */
    constructor() {
        this.cellMap = [];
        this.cellSize = 0;
    }

    /**
     * セル行列初期化処理
     * @param {*} windowWidth 画面の幅
     * @param {*} windowHeight 画面の高さ
     * @param {*} cellSize セルの1辺の長さ(px)
     */
    initialize(windowWidth, windowHeight, cellSize) {
        this.cellSize = cellSize;
        const columnLength = Math.floor(windowWidth / cellSize);
        const rowLength = Math.floor(windowHeight / cellSize);

        //端の行列をダミーセルとして使うためセルの配列を実際の要素数+2の大きさで初期化
        this.cellMap = new Array(rowLength);
        for (let i = 0; i < rowLength + 2; i++) {
            this.cellMap[i] = new Array(columnLength + 2).fill(false);
        }

        //初期配置するセルをランダムに指定
        const startAliveCount = Math.floor(columnLength * rowLength * 6 / 10);
        for (let i = 0; i < startAliveCount; i++) {
            const x = Utils.getRand(1, columnLength - 1);
            const y = Utils.getRand(1, rowLength - 1);
            this.cellMap[y][x] = ALIVE;
        }
    }

    /**
     * セルを次世代に進める
     */
    update() {
        const nextCellMap = new Array(this.cellMap.length);
        for (let i = 0; i < this.cellMap.length; i++) {
            nextCellMap[i] = new Array(this.cellMap[i].length).fill(false);
        }
        for (let i = 1; i < this.cellMap.length - 1; i++) {
            for (let j = 1; j < this.cellMap[i].length - 1; j++) {
                const aliveCount = this.countAliveCell(i, j);
                if (!this.cellMap[i][j]) {
                    nextCellMap[i][j] = aliveCount === 3;
                    continue;
                }
                nextCellMap[i][j] = (aliveCount === 2 || aliveCount === 3);
            }
        }
        this.cellMap = Array.from(nextCellMap);
    }

    /**
     * 指定したセルの周囲の生存セル数をカウント
     * @param {*} y y座標
     * @param {*} x x座標
     * @returns 生存セル数
     */
    countAliveCell(y, x) {
        let count = 0;
        count += this.cellMap[y - 1][x - 1] ? 1 : 0;
        count += this.cellMap[y - 1][x] ? 1 : 0;
        count += this.cellMap[y - 1][x + 1] ? 1 : 0;
        count += this.cellMap[y][x - 1] ? 1 : 0;
        count += this.cellMap[y][x + 1] ? 1 : 0;
        count += this.cellMap[y + 1][x - 1] ? 1 : 0;
        count += this.cellMap[y + 1][x] ? 1 : 0;
        count += this.cellMap[y + 1][x + 1] ? 1 : 0;
        return count;
    }

    /**
     * セルの行数を取得
     */
    get rowLength() {
        return this.cellMap.length;
    }

    /**
     * セルの列数を取得
     */
    get columnLength() {
        return this.cellMap.length === 0 ? 0 : this.cellMap[0].length;
    }
}