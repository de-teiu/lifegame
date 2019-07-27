import "../style/style.scss";
import P5 from "p5";

const sketch = p => {
    //画面描画用バッファ
    let bufferedImage;
    const NODE_SIZE = 10;
    const ALIVE = true;
    let nodeMap = [];

    p.preload = () => {};

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        bufferedImage = p.createGraphics(p.windowWidth, p.windowHeight);
        bufferedImage.noStroke();
        bufferedImage.fill(255);
        p.background(0);
        p.frameRate(60);
        p.imageMode(p.CENTER);
        p.initialize();
    };

    //画面描画処理
    p.draw = () => {
        //背景描画(前フレームの描画内容を塗りつぶす)
        bufferedImage.background(0);
        for (let i = 1; i < nodeMap.length - 1; i++) {
            for (let j = 1; j < nodeMap[i].length - 1; j++) {
                if (nodeMap[i][j]) {
                    bufferedImage.rect(j * NODE_SIZE, i * NODE_SIZE, NODE_SIZE, NODE_SIZE)
                }
            }
        }
        p.image(bufferedImage, p.windowWidth / 2, p.windowHeight / 2);

        //次のフレームのノードの状態を設定
        const nextNodeMap = new Array(nodeMap.length);
        for (let i = 0; i < nodeMap.length; i++) {
            nextNodeMap[i] = new Array(nodeMap[i].length).fill(false);
        }
        for (let i = 1; i < nodeMap.length - 1; i++) {
            for (let j = 1; j < nodeMap[i].length - 1; j++) {
                const aliveCount = p.countAliveNode(i, j);
                if (!nodeMap[i][j]) {
                    nextNodeMap[i][j] = aliveCount === 3;
                    continue;
                }
                nextNodeMap[i][j] = (aliveCount === 2 || aliveCount === 3);
            }
        }
        nodeMap = Array.from(nextNodeMap);
    };

    p.countAliveNode = (y, x) => {
        let count = 0;
        count += nodeMap[y - 1][x - 1] ? 1 : 0;
        count += nodeMap[y - 1][x] ? 1 : 0;
        count += nodeMap[y - 1][x + 1] ? 1 : 0;
        count += nodeMap[y][x - 1] ? 1 : 0;
        count += nodeMap[y][x + 1] ? 1 : 0;
        count += nodeMap[y + 1][x - 1] ? 1 : 0;
        count += nodeMap[y + 1][x] ? 1 : 0;
        count += nodeMap[y + 1][x + 1] ? 1 : 0;
        return count;
    }

    /**
     * min以上max未満の値をランダムに返す
     * @param {*} min 最小値
     * @param {*} max 最大値+1
     */
    p.getRand = (min, max) => {
        return Math.floor(p.random(max - min)) + min;
    };


    /**
     * ウィンドウサイズ変更時イベント
     */
    p.windowResized = () => {
        //変更されたウィンドウサイズに合わせてキャンバスのサイズを更新
        p.resizeCanvas(p.windowWidth, p.windowHeight);

        p.initialize();
    };

    p.initialize = () => {
        //ウィンドウサイズに合わせてライフゲームの行列数を決定
        const columnLength = Math.floor(p.windowWidth / NODE_SIZE);
        const rowLenght = Math.floor(p.windowHeight / NODE_SIZE);

        //端の行列をダミーノードとして使うためノードの配列を実際の要素数+2の大きさで初期化
        nodeMap = new Array(rowLenght);
        for (let i = 0; i < rowLenght + 2; i++) {
            nodeMap[i] = new Array(columnLength + 2).fill(false);
        }

        let startAliveCount = Math.floor(columnLength * rowLenght * 4 / 10);
        for (let i = 0; i < startAliveCount; i++) {
            const x = p.getRand(1, columnLength);
            const y = p.getRand(1, rowLenght);
            nodeMap[y][x] = ALIVE;
        }

        bufferedImage.resizeCanvas(columnLength * 10, rowLenght * 10);
    }
};

new P5(sketch);