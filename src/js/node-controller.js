"use strict";

import Utils from "./utils";
/** ノード生存 */
const ALIVE = true;
/**
 * ノード管理クラス
 */
export default class NodeController {
    /**
     * コンストラクタ
     */
    constructor() {
        this.nodeMap = [];
        this.nodeSize = 0;
    }

    /**
     * ノード行列初期化処理
     * @param {*} windowWidth 画面の幅
     * @param {*} windowHeight 画面の高さ
     * @param {*} nodeSize ノードの1辺の長さ(px)
     */
    initialize(windowWidth, windowHeight, nodeSize) {
        this.nodeSize = nodeSize;
        const columnLength = Math.floor(windowWidth / nodeSize);
        const rowLenght = Math.floor(windowHeight / nodeSize);

        //端の行列をダミーノードとして使うためノードの配列を実際の要素数+2の大きさで初期化
        this.nodeMap = new Array(rowLenght);
        for (let i = 0; i < rowLenght + 2; i++) {
            this.nodeMap[i] = new Array(columnLength + 2).fill(false);
        }

        //初期配置するノードをランダムに指定
        const startAliveCount = Math.floor(columnLength * rowLenght * 4 / 10);
        for (let i = 0; i < startAliveCount; i++) {
            const x = Utils.getRand(1, columnLength);
            const y = Utils.getRand(1, rowLenght);
            this.nodeMap[y][x] = ALIVE;
        }
    }

    /**
     * ノードを次世代に進める
     */
    update() {
        const nextNodeMap = new Array(this.nodeMap.length);
        for (let i = 0; i < this.nodeMap.length; i++) {
            nextNodeMap[i] = new Array(this.nodeMap[i].length).fill(false);
        }
        for (let i = 1; i < this.nodeMap.length - 1; i++) {
            for (let j = 1; j < this.nodeMap[i].length - 1; j++) {
                const aliveCount = this.countAliveNode(i, j);
                if (!this.nodeMap[i][j]) {
                    nextNodeMap[i][j] = aliveCount === 3;
                    continue;
                }
                nextNodeMap[i][j] = (aliveCount === 2 || aliveCount === 3);
            }
        }
        this.nodeMap = Array.from(nextNodeMap);
    }

    /**
     * 指定したノードの周囲の生存ノード数をカウント
     * @param {*} y y座標
     * @param {*} x x座標
     * @returns 生存ノード数
     */
    countAliveNode(y, x) {
        let count = 0;
        count += this.nodeMap[y - 1][x - 1] ? 1 : 0;
        count += this.nodeMap[y - 1][x] ? 1 : 0;
        count += this.nodeMap[y - 1][x + 1] ? 1 : 0;
        count += this.nodeMap[y][x - 1] ? 1 : 0;
        count += this.nodeMap[y][x + 1] ? 1 : 0;
        count += this.nodeMap[y + 1][x - 1] ? 1 : 0;
        count += this.nodeMap[y + 1][x] ? 1 : 0;
        count += this.nodeMap[y + 1][x + 1] ? 1 : 0;
        return count;
    }

    /**
     * ノードの行数を取得
     */
    get rowLength() {
        return this.nodeMap.length;
    }

    /**
     * ノードの列数を取得
     */
    get columnLength() {
        return this.nodeMap.length === 0 ? 0 : this.nodeMap[0].length;
    }
}