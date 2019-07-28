"use strict";

import "../style/style.scss";
import CellController from "./cell-controller";
import P5 from "p5";
import "p5/lib/addons/p5.sound";

/** 画面に描画する1セルの1辺の長さ(px) */
const CELL_SIZE = 10;

/**
 * p5.jsでキャンバス更新
 * @param {*} p p5.jsモジュール
 */
const sketch = p => {
    //画面描画用バッファ
    let bufferedImage;
    //セル制御モジュール
    const cellController = new CellController();
    const CELL_COLOR = p.color(255, 255, 255);
    const SOUND_LINE_COLOR = p.color(255, 0, 0);
    const SOUND_CELL_COLOR = p.color(0, 255, 0);
    let soundLineX = 0;
    let oscList = [];
    let envelopeList = [];

    p.preload = () => {};

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(30);
        p.imageMode(p.CENTER);
        cellController.initialize(p.windowWidth, p.windowHeight, CELL_SIZE);
        bufferedImage = p.createGraphics((cellController.columnLength - 2) * CELL_SIZE, (cellController.rowLength - 2) * CELL_SIZE);
        bufferedImage.noStroke();
        bufferedImage.fill(255);

        soundLineX = bufferedImage.width;
        p.background(0);

        if (
            navigator.userAgent.indexOf("iPhone") > 0 ||
            navigator.userAgent.indexOf("iPad") > 0 ||
            navigator.userAgent.indexOf("iPod") > 0
        ) {
            p.touchStarted = p.startPlaySoundMode;
        } else {
            p.mouseClicked = p.startPlaySoundMode;
        }

    };

    p.startPlaySoundMode = () => {
        if (oscList.length === 0) {
            p.resetOsc();
        }
    }

    //画面描画処理
    p.draw = () => {
        //背景描画(前フレームの描画内容を塗りつぶす)
        p.background(0);
        bufferedImage.background(0);
        bufferedImage.fill(CELL_COLOR);
        bufferedImage.noStroke();
        const cellMap = cellController.cellMap;
        for (let i = 1; i < cellMap.length - 1; i++) {
            for (let j = 1; j < cellMap[i].length - 1; j++) {
                if (cellMap[i][j]) {
                    bufferedImage.rect((j - 1) * CELL_SIZE, (i - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE)
                }
            }
        }
        //次のフレームのセルの状態を設定
        cellController.update();

        if (oscList.length > 0) {
            bufferedImage.stroke(SOUND_LINE_COLOR);
            bufferedImage.line(soundLineX, 0, soundLineX, bufferedImage.height);

            let nextSoundLineX = soundLineX - CELL_SIZE / 10 * 2;
            if (nextSoundLineX < 0) {
                nextSoundLineX = bufferedImage.width;
            }
            const nowLine = Math.floor(soundLineX / CELL_SIZE);
            const nextLine = Math.floor(nextSoundLineX / CELL_SIZE);
            if (nowLine !== nextLine) {
                p.playCellSound(nextLine);
            }
            soundLineX = nextSoundLineX;



            bufferedImage.noStroke();
            bufferedImage.fill(SOUND_CELL_COLOR);
            for (let i = 0; i < cellController.rowLength; i++) {
                if (cellController.cellMap[i][nextLine]) {
                    bufferedImage.rect((nextLine - 1) * CELL_SIZE, (i - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE)
                }
            }
        }
        p.image(bufferedImage, p.windowWidth / 2, p.windowHeight / 2);
    };

    /**
     * 効果音再生
     */
    p.playCellSound = (nextLine) => {
        for (let i = 0; i < cellController.rowLength; i++) {
            if (cellController.cellMap[i][nextLine]) {
                const freq = p.midiToFreq(Math.floor(i * 64 / cellController.rowLength) + 64);
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
        cellController.initialize(p.windowWidth, p.windowHeight, CELL_SIZE);
        bufferedImage.resizeCanvas((cellController.columnLength - 2) * CELL_SIZE, (cellController.rowLength - 2) * CELL_SIZE);
        if (oscList.length > 0) {
            p.resetOsc();
        }
    };



    /**
     * 発振器オブジェクトのリセット
     */
    p.resetOsc = () => {
        oscList.forEach(osc => {
            osc.stop();
        });
        oscList.length = 0;
        envelopeList.length = 0;
        for (let i = 0; i < cellController.rowLength; i++) {
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