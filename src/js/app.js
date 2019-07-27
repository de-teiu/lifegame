"use strict";

import "../style/style.scss";
import NodeController from "./node-controller";
import P5 from "p5";

/** 画面に描画する1ノードの1辺の長さ(px) */
const NODE_SIZE = 10;

/**
 * p5.jsでキャンバス更新
 * @param {*} p p5.jsモジュール
 */
const sketch = p => {
    //画面描画用バッファ
    let bufferedImage;
    //ノード制御モジュール
    const nodeController = new NodeController();

    p.preload = () => {};

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        bufferedImage = p.createGraphics(p.windowWidth, p.windowHeight);
        bufferedImage.noStroke();
        bufferedImage.fill(255);
        p.background(0);
        p.frameRate(60);
        p.imageMode(p.CENTER);

        nodeController.initialize(p.windowWidth, p.windowHeight, NODE_SIZE);
    };

    //画面描画処理
    p.draw = () => {
        //背景描画(前フレームの描画内容を塗りつぶす)
        bufferedImage.background(0);
        const nodeMap = nodeController.nodeMap;
        for (let i = 1; i < nodeMap.length - 1; i++) {
            for (let j = 1; j < nodeMap[i].length - 1; j++) {
                if (nodeMap[i][j]) {
                    bufferedImage.rect(j * NODE_SIZE, i * NODE_SIZE, NODE_SIZE, NODE_SIZE)
                }
            }
        }
        p.image(bufferedImage, p.windowWidth / 2, p.windowHeight / 2);

        //次のフレームのノードの状態を設定
        nodeController.update();
    };


    /**
     * ウィンドウサイズ変更時イベント
     */
    p.windowResized = () => {
        //変更されたウィンドウサイズに合わせてキャンバスのサイズを更新
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        nodeController.initialize(p.windowWidth, p.windowHeight, NODE_SIZE);
        bufferedImage.resizeCanvas(nodeController.columnLength * 10, nodeController.rowLength * 10);
    };

};

new P5(sketch);