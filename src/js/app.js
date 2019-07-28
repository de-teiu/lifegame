"use strict";

import "../style/style.scss";
import NodeController from "./node-controller";
import P5 from "p5";
import "p5/lib/addons/p5.sound";

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
    const NODE_COLOR = p.color(255, 255, 255);
    const SOUND_LINE_COLOR = p.color(255, 0, 0);
    const SOUND_NODE_COLOR = p.color(0, 255, 0);
    let soundLineX = 0;
    let oscList = [];
    let envelopeList = [];

    p.preload = () => {};

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(30);
        p.imageMode(p.CENTER);
        nodeController.initialize(p.windowWidth, p.windowHeight, NODE_SIZE);
        bufferedImage = p.createGraphics((nodeController.columnLength - 2) * NODE_SIZE, (nodeController.rowLength - 2) * NODE_SIZE);
        bufferedImage.noStroke();
        bufferedImage.fill(255);

        soundLineX = bufferedImage.width;
        p.resetOsc();
        p.background(0);

    };

    //画面描画処理
    p.draw = () => {
        //背景描画(前フレームの描画内容を塗りつぶす)
        p.background(0);
        bufferedImage.background(0);
        bufferedImage.fill(NODE_COLOR);
        bufferedImage.noStroke();
        const nodeMap = nodeController.nodeMap;
        for (let i = 1; i < nodeMap.length - 1; i++) {
            for (let j = 1; j < nodeMap[i].length - 1; j++) {
                if (nodeMap[i][j]) {
                    bufferedImage.rect(j * NODE_SIZE, i * NODE_SIZE, NODE_SIZE, NODE_SIZE)
                }
            }
        }
        bufferedImage.stroke(SOUND_LINE_COLOR);
        bufferedImage.line(soundLineX, 0, soundLineX, bufferedImage.height);

        //次のフレームのノードの状態を設定
        nodeController.update();
        let nextSoundLineX = soundLineX - NODE_SIZE / 10 * 2;
        if (nextSoundLineX < 0) {
            nextSoundLineX = bufferedImage.width;
        }
        const nowLine = Math.floor(soundLineX / NODE_SIZE);
        const nextLine = Math.floor(nextSoundLineX / NODE_SIZE);
        if (nowLine !== nextLine) {
            p.playNodeSound(nextLine);
        }
        soundLineX = nextSoundLineX;

        bufferedImage.noStroke();
        bufferedImage.fill(SOUND_NODE_COLOR);
        for (let i = 0; i < nodeController.rowLength; i++) {
            if (nodeController.nodeMap[i][nextLine]) {
                bufferedImage.rect(nextLine * NODE_SIZE, i * NODE_SIZE, NODE_SIZE, NODE_SIZE)
            }
        }

        p.image(bufferedImage, p.windowWidth / 2, p.windowHeight / 2);
    };


    p.playNodeSound = (nextLine) => {
        console.log("change");
        for (let i = 0; i < nodeController.rowLength; i++) {
            if (nodeController.nodeMap[i][nextLine]) {
                const freq = p.midiToFreq(Math.floor(i * 64 / nodeController.rowLength) + 64);
                oscList[i].freq(freq);
                envelopeList[i].play(oscList[i], 0, 0.1);
            }
        }
    }


    /**
     * ウィンドウサイズ変更時イベント
     */
    p.windowResized = () => {
        //変更されたウィンドウサイズに合わせてキャンバスのサイズを更新
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        soundLineX = p.windowWidth - 1;
        nodeController.initialize(p.windowWidth, p.windowHeight, NODE_SIZE);
        bufferedImage.resizeCanvas((nodeController.columnLength - 2) * NODE_SIZE, (nodeController.rowLength - 2) * NODE_SIZE);
        p.resetOsc();
    };

    p.resetOsc = () => {
        oscList.forEach(osc => {
            osc.stop();
        });
        oscList.length = 0;
        envelopeList.length = 0;
        for (let i = 0; i < nodeController.rowLength; i++) {
            const osc = new P5.SinOsc();
            osc.freq(0);
            osc.start();
            oscList.push(osc);

            const envelope = new P5.Envelope();
            envelope.setADSR(0.001, 0.25, 0.1, 0.5);
            envelope.setRange(1, 0);
            envelopeList.push(envelope);
        }
    }
};

new P5(sketch);