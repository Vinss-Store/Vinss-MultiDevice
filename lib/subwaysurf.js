// lib/subwaysurf.js
// Subway Surf - VINSS BOTZ
// Client-side mini endless runner
// ESM

function buildSubwaySurfPayload(namaBot = "VINSS BOTZ") {
    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>

<style>

* {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
}

body {
    background:
        linear-gradient(
            180deg,
            #07111f 0%,
            #101b2d 45%,
            #05070d 100%
        );

    color: #fff;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    overflow-x: hidden;
    user-select: none;
}

.game {
    width: 100%;
    max-width: 760px;

    margin: 0 auto;

    padding:
        8px 6px 16px;
}

.brand {
    text-align: center;

    color: #a96cff;

    font-size: 11px;

    font-weight: 900;

    letter-spacing: 2px;

    margin-bottom: 3px;
}

.title {
    text-align: center;

    font-size:
        clamp(
            24px,
            7vw,
            34px
        );

    font-weight: 900;

    margin: 0;

    line-height: 1.1;
}

.subtitle {
    text-align: center;

    color: #9da4b2;

    font-size:
        clamp(
            10px,
            3.5vw,
            14px
        );

    margin:
        5px 0 9px;
}

.stats {
    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 6px;

    margin-bottom: 8px;
}

.stat {
    min-width: 0;

    padding:
        7px 4px;

    border-radius: 11px;

    background:
        rgba(255,255,255,.065);

    border:
        1px solid
        rgba(255,255,255,.08);

    text-align: center;
}

.stat-label {
    display: block;

    color: #858b99;

    font-size: 8px;

    font-weight: 800;

    letter-spacing: 1px;

    margin-bottom: 2px;
}

.stat-value {
    display: block;

    color: #fff;

    font-size:
        clamp(
            14px,
            4.5vw,
            21px
        );

    font-weight: 900;
}

.status {
    width: 100%;

    min-height: 43px;

    display: flex;

    align-items: center;

    justify-content: center;

    padding:
        8px 10px;

    margin-bottom: 8px;

    border-radius: 13px;

    background:
        rgba(255,255,255,.055);

    border:
        1px solid
        rgba(160,100,255,.28);

    color: #f4f4f7;

    text-align: center;

    font-size:
        clamp(
            11px,
            3.5vw,
            14px
        );

    font-weight: 800;
}

.canvas-wrap {
    position: relative;

    width: 100%;

    border-radius: 17px;

    padding: 4px;

    background:
        linear-gradient(
            135deg,
            #6934c5,
            #20283a,
            #313b4d
        );

    box-shadow:
        0 12px 35px
        rgba(0,0,0,.45);
}

canvas {
    display: block;

    width: 100%;

    height: auto;

    aspect-ratio: 9 / 14;

    border-radius: 13px;

    background:
        #09111c;

    touch-action: none;
}

.overlay {
    position: absolute;

    inset: 4px;

    display: flex;

    align-items: center;

    justify-content: center;

    flex-direction: column;

    padding: 20px;

    border-radius: 13px;

    background:
        rgba(3,7,14,.72);

    backdrop-filter:
        blur(4px);

    opacity: 0;

    pointer-events: none;

    transition:
        opacity .2s ease;
}

.overlay.show {
    opacity: 1;

    pointer-events: auto;
}

.overlay-title {
    font-size:
        clamp(
            27px,
            8vw,
            42px
        );

    font-weight: 900;

    margin-bottom: 5px;
}

.overlay-score {
    color: #c9ced8;

    font-size: 14px;

    margin-bottom: 13px;
}

.controls {
    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 7px;

    margin-top: 8px;
}

button {
    border: 0;

    min-height: 43px;

    border-radius: 12px;

    color: #fff;

    background:
        linear-gradient(
            135deg,
            #7634df,
            #a94cff
        );

    font-size:
        clamp(
            11px,
            3.4vw,
            14px
        );

    font-weight: 900;

    cursor: pointer;
}

button.secondary {
    background:
        rgba(255,255,255,.10);

    border:
        1px solid
        rgba(255,255,255,.08);
}

button:active {
    transform:
        scale(.95);
}

.help {
    text-align: center;

    color: #777e8d;

    font-size:
        clamp(
            9px,
            2.8vw,
            12px
        );

    line-height: 1.5;

    margin-top: 9px;
}

.footer {
    text-align: center;

    color: #5d6471;

    font-size: 8px;

    letter-spacing: 2px;

    font-weight: 800;

    margin-top: 11px;
}

</style>
</head>

<body>

<div class="game">

    <div class="brand">
        ● ${namaBot}
    </div>

    <h1 class="title">
        Subway Surf 🏃
    </h1>

    <div class="subtitle">
        VINSS BOTZ • Endless Runner
    </div>

    <div class="stats">

        <div class="stat">
            <span class="stat-label">
                SCORE
            </span>

            <span
                class="stat-value"
                id="score"
            >
                0
            </span>
        </div>

        <div class="stat">
            <span class="stat-label">
                COIN
            </span>

            <span
                class="stat-value"
                id="coins"
            >
                0
            </span>
        </div>

        <div class="stat">
            <span class="stat-label">
                BEST
            </span>

            <span
                class="stat-value"
                id="best"
            >
                0
            </span>
        </div>

    </div>

    <div
        class="status"
        id="status"
    >
        🏃 Bersiap... geser atau gunakan tombol!
    </div>

    <div class="canvas-wrap">

        <canvas
            id="gameCanvas"
            width="450"
            height="700"
        ></canvas>

        <div
            class="overlay"
            id="gameOver"
        >

            <div class="overlay-title">
                💥 GAME OVER
            </div>

            <div
                class="overlay-score"
                id="finalScore"
            >
                Score: 0
            </div>

            <button
                id="restartOverlay"
                style="width:180px"
            >
                🔄 Main Lagi
            </button>

        </div>

    </div>

    <div class="controls">

        <button
            id="left"
            class="secondary"
        >
            ◀️ Kiri
        </button>

        <button
            id="jump"
        >
            ⬆️ Lompat
        </button>

        <button
            id="right"
            class="secondary"
        >
            Kanan ▶️
        </button>

    </div>

    <div class="controls">

        <button
            id="slide"
            class="secondary"
        >
            ⬇️ Slide
        </button>

        <button
            id="restart"
        >
            🔄 Game Baru
        </button>

        <button
            id="pause"
            class="secondary"
        >
            ⏸️ Pause
        </button>

    </div>

    <div class="help">
        Geser kiri/kanan untuk pindah jalur.
        Geser ke atas untuk lompat dan ke bawah untuk slide.
        Hindari 🚧 dan kumpulkan 🪙 sebanyak mungkin!
    </div>

    <div class="footer">
        POWERED BY ${namaBot} ⚡ SUBWAY AI
    </div>

</div>

<script>

(() => {

"use strict";

/* =========================
   CANVAS
========================= */

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;


/* =========================
   UI
========================= */

const scoreEl =
    document.getElementById("score");

const coinsEl =
    document.getElementById("coins");

const bestEl =
    document.getElementById("best");

const statusEl =
    document.getElementById("status");

const gameOverEl =
    document.getElementById("gameOver");

const finalScoreEl =
    document.getElementById("finalScore");


/* =========================
   STORAGE
========================= */

let best = 0;

try {

    best =
        Number(
            localStorage.getItem(
                "vinss_subway_best"
            ) || 0
        );

} catch (_) {

    best = 0;

}

bestEl.textContent = best;


/* =========================
   GAME STATE
========================= */

let running = false;
let paused = false;

let score = 0;
let coins = 0;

let speed = 5;

let spawnTimer = 0;
let coinTimer = 0;

let roadOffset = 0;

let lastTime = 0;

let animationId = 0;


/* =========================
   PLAYER
========================= */

const player = {

    lane: 1,

    x: 0,

    targetX: 0,

    y: H - 125,

    width: 48,

    height: 72,

    jumpY: 0,

    jumpVelocity: 0,

    sliding: false,

    slideTimer: 0,

    invincible: 0

};

const laneX = [
    W * 0.27,
    W * 0.50,
    W * 0.73
];

player.x =
    laneX[player.lane];

player.targetX =
    player.x;


/* =========================
   OBJECTS
========================= */

const obstacles = [];
const coinItems = [];


/* =========================
   HELPERS
========================= */

function random(min, max) {

    return Math.random() *
        (max - min) + min;

}


function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


function updateUI() {

    scoreEl.textContent =
        Math.floor(score);

    coinsEl.textContent =
        coins;

    if (score > best) {

        best =
            Math.floor(score);

        bestEl.textContent =
            best;

    }

}


/* =========================
   START
========================= */

function startGame() {

    cancelAnimationFrame(
        animationId
    );

    score = 0;
    coins = 0;

    speed = 5;

    spawnTimer = 0;
    coinTimer = 0;

    roadOffset = 0;

    obstacles.length = 0;
    coinItems.length = 0;

    player.lane = 1;

    player.x =
        laneX[1];

    player.targetX =
        laneX[1];

    player.jumpY = 0;
    player.jumpVelocity = 0;

    player.sliding = false;
    player.slideTimer = 0;

    player.invincible = 0;

    running = true;
    paused = false;

    gameOverEl.classList.remove(
        "show"
    );

    statusEl.textContent =
        "🏃 Lari! Hindari kereta dan kumpulkan coin!";

    lastTime =
        performance.now();

    animationId =
        requestAnimationFrame(
            loop
        );

    updateUI();

}


/* =========================
   GAME OVER
========================= */

function gameOver() {

    if (!running)
        return;

    running = false;

    finalScoreEl.textContent =
        "Score: " +
        Math.floor(score) +
        " • Coin: " +
        coins;

    gameOverEl.classList.add(
        "show"
    );

    statusEl.textContent =
        "💥 Tabrakan! Coba lagi.";

    if (score > best) {

        best =
            Math.floor(score);

        bestEl.textContent =
            best;

        try {

            localStorage.setItem(
                "vinss_subway_best",
                String(best)
            );

        } catch (_) {}

    }

}


/* =========================
   MOVE
========================= */

function moveLeft() {

    if (!running || paused)
        return;

    player.lane =
        clamp(
            player.lane - 1,
            0,
            2
        );

    player.targetX =
        laneX[player.lane];

}


function moveRight() {

    if (!running || paused)
        return;

    player.lane =
        clamp(
            player.lane + 1,
            0,
            2
        );

    player.targetX =
        laneX[player.lane];

}


function jump() {

    if (!running || paused)
        return;

    if (player.jumpY === 0) {

        player.jumpVelocity =
            15;

    }

}


function slide() {

    if (!running || paused)
        return;

    if (player.jumpY !== 0)
        return;

    player.sliding = true;

    player.slideTimer =
        420;

}


/* =========================
   SPAWN OBSTACLE
========================= */

function spawnObstacle() {

    const lane =
        Math.floor(
            random(0, 3)
        );

    const type =
        Math.random() < .72
            ? "barrier"
            : "train";

    obstacles.push({

        lane,

        y: -90,

        width:
            type === "train"
                ? 78
                : 62,

        height:
            type === "train"
                ? 105
                : 58,

        type,

        passed: false

    });

}


/* =========================
   SPAWN COIN
========================= */

function spawnCoins() {

    const lane =
        Math.floor(
            random(0, 3)
        );

    const count =
        Math.random() < .35
            ? 3
            : 1;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        coinItems.push({

            lane,

            y:
                -40 -
                i * 48,

            radius: 13,

            collected: false

        });

    }

}


/* =========================
   COLLISION
========================= */

function playerRect() {

    const sliding =
        player.sliding;

    const h =
        sliding
            ? 42
            : 72;

    const y =
        player.y -
        player.jumpY +
        (sliding ? 30 : 0);

    return {

        x:
            player.x -
            player.width / 2,

        y,

        width:
            player.width,

        height: h

    };

}


function obstacleRect(o) {

    const scale =
        0.70 +
        ((o.y + 100) / H) *
        0.30;

    return {

        x:
            laneX[o.lane] -
            (o.width * scale) / 2,

        y:
            o.y,

        width:
            o.width * scale,

        height:
            o.height * scale

    };

}


function intersects(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );

}


/* =========================
   UPDATE
========================= */

function update(dt) {

    score +=
        dt * 0.012 * speed;

    speed +=
        dt * 0.00010;

    speed =
        Math.min(
            speed,
            14
        );

    roadOffset +=
        speed *
        dt *
        0.08;

    if (
        roadOffset > 100
    ) {

        roadOffset = 0;

    }


    /* PLAYER */

    player.x +=
        (player.targetX - player.x) *
        Math.min(
            1,
            dt * 0.012
        );


    /* JUMP */

    if (
        player.jumpY > 0 ||
        player.jumpVelocity > 0
    ) {

        player.jumpY +=
            player.jumpVelocity *
            dt *
            0.055;

        player.jumpVelocity -=
            0.85 *
            dt *
            0.055;

        if (
            player.jumpY <= 0
        ) {

            player.jumpY = 0;
            player.jumpVelocity = 0;

        }

    }


    /* SLIDE */

    if (player.sliding) {

        player.slideTimer -= dt;

        if (
            player.slideTimer <= 0
        ) {

            player.sliding = false;

        }

    }


    /* INVINCIBLE */

    if (
        player.invincible > 0
    ) {

        player.invincible -= dt;

    }


    /* SPAWN */

    spawnTimer += dt;
    coinTimer += dt;

    const obstacleDelay =
        Math.max(
            470,
            1050 -
            speed * 38
        );

    if (
        spawnTimer >=
        obstacleDelay
    ) {

        spawnObstacle();

        spawnTimer = 0;

    }


    if (
        coinTimer >= 680
    ) {

        spawnCoins();

        coinTimer = 0;

    }


    /* OBSTACLES */

    for (
        let i = obstacles.length - 1;
        i >= 0;
        i--
    ) {

        const o =
            obstacles[i];

        o.y +=
            speed *
            dt *
            0.13;

        if (
            o.y > H + 130
        ) {

            obstacles.splice(
                i,
                1
            );

            continue;

        }

        const pr =
            playerRect();

        const or =
            obstacleRect(o);

        if (
            player.invincible <= 0 &&
            intersects(pr, or)
        ) {

            gameOver();

            return;

        }

    }


    /* COINS */

    const pr =
        playerRect();

    for (
        let i = coinItems.length - 1;
        i >= 0;
        i--
    ) {

        const c =
            coinItems[i];

        c.y +=
            speed *
            dt *
            0.13;

        if (
            c.y > H + 50
        ) {

            coinItems.splice(
                i,
                1
            );

            continue;

        }

        const cx =
            laneX[c.lane];

        const cy =
            c.y;

        const closestX =
            clamp(
                cx,
                pr.x,
                pr.x + pr.width
            );

        const closestY =
            clamp(
                cy,
                pr.y,
                pr.y + pr.height
            );

        const dx =
            cx - closestX;

        const dy =
            cy - closestY;

        if (
            dx * dx +
            dy * dy <
            c.radius * c.radius
        ) {

            coins++;

            score += 25;

            coinItems.splice(
                i,
                1
            );

        }

    }

    updateUI();

}


/* =========================
   DRAW BACKGROUND
========================= */

function drawBackground() {

    const sky =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    sky.addColorStop(
        0,
        "#10243b"
    );

    sky.addColorStop(
        .48,
        "#17283a"
    );

    sky.addColorStop(
        1,
        "#070b11"
    );

    ctx.fillStyle = sky;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* SUN */

    ctx.beginPath();

    ctx.arc(
        W / 2,
        115,
        46,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255,190,75,.18)";

    ctx.fill();


    /* BUILDINGS */

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const bw =
            38 + (i % 3) * 16;

        const bh =
            100 + (i % 4) * 38;

        const x =
            i * 55 - 20;

        const y =
            265 - bh;

        ctx.fillStyle =
            i % 2
                ? "#182536"
                : "#1d2b3c";

        ctx.fillRect(
            x,
            y,
            bw,
            bh
        );

        for (
            let wy = y + 12;
            wy < 250;
            wy += 22
        ) {

            ctx.fillStyle =
                "rgba(255,215,100,.18)";

            ctx.fillRect(
                x + 8,
                wy,
                7,
                8
            );

            ctx.fillRect(
                x + 24,
                wy,
                7,
                8
            );

        }

    }


    /* ROAD */

    ctx.fillStyle =
        "#20242a";

    ctx.beginPath();

    ctx.moveTo(
        W * .08,
        H
    );

    ctx.lineTo(
        W * .92,
        H
    );

    ctx.lineTo(
        W * .64,
        265
    );

    ctx.lineTo(
        W * .36,
        265
    );

    ctx.closePath();

    ctx.fill();


    /* SIDE */

    ctx.fillStyle =
        "#10151b";

    ctx.beginPath();

    ctx.moveTo(
        0,
        H
    );

    ctx.lineTo(
        W * .08,
        H
    );

    ctx.lineTo(
        W * .36,
        265
    );

    ctx.lineTo(
        0,
        265
    );

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(
        W,
        H
    );

    ctx.lineTo(
        W * .92,
        H
    );

    ctx.lineTo(
        W * .64,
        265
    );

    ctx.lineTo(
        W,
        265
    );

    ctx.closePath();

    ctx.fill();


    /* LANE LINES */

    ctx.save();

    ctx.strokeStyle =
        "rgba(255,255,255,.20)";

    ctx.lineWidth = 3;

    ctx.setLineDash([
        18,
        18
    ]);

    const dash =
        roadOffset;

    ctx.lineDashOffset =
        -dash;

    ctx.beginPath();

    ctx.moveTo(
        W * .36,
        265
    );

    ctx.lineTo(
        W * .08,
        H
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        W * .64,
        265
    );

    ctx.lineTo(
        W * .92,
        H
    );

    ctx.stroke();

    ctx.restore();


    /* RAILS */

    drawRail(
        W * .18
    );

    drawRail(
        W * .82
    );

}


function drawRail(x) {

    ctx.strokeStyle =
        "#59636f";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(
        x,
        H
    );

    ctx.lineTo(
        W / 2 +
        (x - W / 2) *
        .18,
        265
    );

    ctx.stroke();

}


/* =========================
   DRAW COINS
========================= */

function drawCoins() {

    for (
        const c of coinItems
    ) {

        const x =
            laneX[c.lane];

        const y =
            c.y;

        const glow =
            ctx.createRadialGradient(
                x,
                y,
                2,
                x,
                y,
                23
            );

        glow.addColorStop(
            0,
            "rgba(255,220,60,.75)"
        );

        glow.addColorStop(
            1,
            "rgba(255,220,60,0)"
        );

        ctx.fillStyle =
            glow;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            23,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#ffd52e";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            c.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#fff1a3";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "#e8a900";

        ctx.lineWidth = 2;

        ctx.stroke();

    }

}


/* =========================
   DRAW OBSTACLES
========================= */

function drawObstacles() {

    for (
        const o of obstacles
    ) {

        const r =
            obstacleRect(o);

        if (
            o.type === "train"
        ) {

            drawTrain(
                r
            );

        } else {

            drawBarrier(
                r
            );

        }

    }

}


function drawBarrier(r) {

    ctx.fillStyle =
        "#e54848";

    ctx.fillRect(
        r.x,
        r.y,
        r.width,
        r.height
    );


    ctx.fillStyle =
        "#ffd54a";

    const stripe =
        r.height / 4;

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        ctx.fillRect(
            r.x,
            r.y +
            i * stripe,
            r.width,
            stripe * .45
        );

    }


    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 18px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "STOP",
        r.x + r.width / 2,
        r.y + r.height / 2 + 6
    );

}


function drawTrain(r) {

    ctx.fillStyle =
        "#26384a";

    ctx.fillRect(
        r.x,
        r.y,
        r.width,
        r.height
    );


    ctx.fillStyle =
        "#e8edf3";

    ctx.fillRect(
        r.x + r.width * .15,
        r.y + r.height * .18,
        r.width * .70,
        r.height * .30
    );


    ctx.fillStyle =
        "#39a9ff";

    ctx.fillRect(
        r.x + r.width * .18,
        r.y + r.height * .22,
        r.width * .28,
        r.height * .18
    );

    ctx.fillRect(
        r.x + r.width * .54,
        r.y + r.height * .22,
        r.width * .28,
        r.height * .18
    );


    ctx.fillStyle =
        "#ff4646";

    ctx.beginPath();

    ctx.arc(
        r.x + r.width * .30,
        r.y + r.height * .82,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        r.x + r.width * .70,
        r.y + r.height * .82,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================
   DRAW PLAYER
========================= */

function drawPlayer() {

    const x =
        player.x;

    const y =
        player.y -
        player.jumpY;

    ctx.save();

    ctx.translate(
        x,
        y
    );


    /* SHADOW */

    ctx.fillStyle =
        "rgba(0,0,0,.35)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        5,
        28 -
        player.jumpY * .06,
        9 -
        player.jumpY * .02,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* JUMP */

    ctx.translate(
        0,
        -5
    );


    if (
        player.sliding
    ) {

        drawSlidingPlayer();

    } else {

        drawRunningPlayer();

    }

    ctx.restore();

}


function drawRunningPlayer() {

    /* LEGS */

    ctx.strokeStyle =
        "#20232b";

    ctx.lineWidth = 8;

    ctx.lineCap =
        "round";

    ctx.beginPath();

    ctx.moveTo(
        -8,
        44
    );

    ctx.lineTo(
        -14,
        67
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        8,
        44
    );

    ctx.lineTo(
        15,
        67
    );

    ctx.stroke();


    /* SHOES */

    ctx.fillStyle =
        "#f2f2f2";

    ctx.fillRect(
        -21,
        63,
        15,
        7
    );

    ctx.fillRect(
        9,
        63,
        15,
        7
    );


    /* BODY */

    ctx.fillStyle =
        "#7136d9";

    ctx.fillRect(
        -18,
        5,
        36,
        42
    );


    /* HEAD */

    ctx.fillStyle =
        "#c9835c";

    ctx.beginPath();

    ctx.arc(
        0,
        -9,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CAP */

    ctx.fillStyle =
        "#191c28";

    ctx.beginPath();

    ctx.arc(
        0,
        -16,
        19,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillRect(
        -19,
        -16,
        27,
        5
    );


    /* ARMS */

    ctx.strokeStyle =
        "#c9835c";

    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(
        -18,
        12
    );

    ctx.lineTo(
        -30,
        29
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        18,
        12
    );

    ctx.lineTo(
        30,
        29
    );

    ctx.stroke();

}


function drawSlidingPlayer() {

    ctx.rotate(
        -.08
    );

    ctx.fillStyle =
        "#7136d9";

    ctx.fillRect(
        -35,
        5,
        58,
        29
    );


    ctx.fillStyle =
        "#c9835c";

    ctx.beginPath();

    ctx.arc(
        28,
        2,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#191c28";

    ctx.fillRect(
        16,
        -10,
        27,
        6
    );


    ctx.strokeStyle =
        "#20232b";

    ctx.lineWidth = 8;

    ctx.beginPath();

    ctx.moveTo(
        -20,
        28
    );

    ctx.lineTo(
        -39,
        41
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        -5,
        28
    );

    ctx.lineTo(
        16,
        43
    );

    ctx.stroke();

}


/* =========================
   DRAW
========================= */

function draw() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );

    drawBackground();

    drawCoins();

    drawObstacles();

    drawPlayer();

}


/* =========================
   LOOP
========================= */

function loop(time) {

    const dt =
        Math.min(
            35,
            time - lastTime
        );

    lastTime =
        time;

    if (
        running &&
        !paused
    ) {

        update(dt);

    }

    draw();

    if (
        running
    ) {

        animationId =
            requestAnimationFrame(
                loop
            );

    }

}


/* =========================
   PAUSE
========================= */

function togglePause() {

    if (!running)
        return;

    paused =
        !paused;

    if (paused) {

        statusEl.textContent =
            "⏸️ Game dijeda.";

    } else {

        statusEl.textContent =
            "🏃 Lanjut! Jangan tabrak obstacle.";

        lastTime =
            performance.now();

    }

}


/* =========================
   BUTTONS
========================= */

document
    .getElementById("left")
    .addEventListener(
        "click",
        moveLeft
    );

document
    .getElementById("right")
    .addEventListener(
        "click",
        moveRight
    );

document
    .getElementById("jump")
    .addEventListener(
        "click",
        jump
    );

document
    .getElementById("slide")
    .addEventListener(
        "click",
        slide
    );

document
    .getElementById("restart")
    .addEventListener(
        "click",
        startGame
    );

document
    .getElementById("restartOverlay")
    .addEventListener(
        "click",
        startGame
    );

document
    .getElementById("pause")
    .addEventListener(
        "click",
        togglePause
    );


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    e => {

        if (
            e.key === "ArrowLeft" ||
            e.key.toLowerCase() === "a"
        ) {

            moveLeft();

        }

        else if (
            e.key === "ArrowRight" ||
            e.key.toLowerCase() === "d"
        ) {

            moveRight();

        }

        else if (
            e.key === "ArrowUp" ||
            e.key === " "
        ) {

            e.preventDefault();

            jump();

        }

        else if (
            e.key === "ArrowDown" ||
            e.key.toLowerCase() === "s"
        ) {

            slide();

        }

    }
);


/* =========================
   SWIPE
========================= */

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener(
    "touchstart",
    e => {

        const t =
            e.changedTouches[0];

        touchStartX =
            t.clientX;

        touchStartY =
            t.clientY;

    },
    {
        passive: true
    }
);


canvas.addEventListener(
    "touchend",
    e => {

        const t =
            e.changedTouches[0];

        const dx =
            t.clientX -
            touchStartX;

        const dy =
            t.clientY -
            touchStartY;

        const absX =
            Math.abs(dx);

        const absY =
            Math.abs(dy);

        const threshold = 25;

        if (
            Math.max(absX, absY) <
            threshold
        ) {

            return;

        }

        if (
            absX > absY
        ) {

            if (
                dx > 0
            ) {

                moveRight();

            } else {

                moveLeft();

            }

        } else {

            if (
                dy < 0
            ) {

                jump();

            } else {

                slide();

            }

        }

    },
    {
        passive: true
    }
);


/* =========================
   INITIAL DRAW
========================= */

draw();

startGame();

})();

</script>

</body>
</html>
`;

    return {
        richResponseMessage: {
            title: "Subway Surf 🏃",
            description:
                `${namaBot} • Endless Runner`,
            placeholder:
                "🏃 Memuat Subway Surf...",
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🎮 Main Subway Surf",
                        url: "https://www.google.com/"
                    })
                }
            ],
            nativeFlowMessage: {
                messageVersion: 1,
                buttons: []
            }
        },

        contextInfo: {
            mentionedJid: []
        },

        interactiveMessage: {
            body: {
                text: html
            }
        }
    };
}


function buildSubwaySurfMessage(
    namaBot = "VINSS BOTZ"
) {
    const payload = buildSubwaySurfPayload(namaBot)
    const html = payload.interactiveMessage.body.text

    const jsonPayload = {
        response_id: Math.random().toString(36).slice(2) + Date.now().toString(36),
        sections: [
            {
                view_model: {
                    primitive: {
                        __typename: 'GenAIaeacdsnwHtmlPrimitive',
                        payload: html,
                        trusted_sources: ['vinss.bot', 'vinss.dev']
                    },
                    __typename: 'GenAISingleLayoutViewModel'
                }
            }
        ]
    }

    const dataB64 = Buffer.from(JSON.stringify(jsonPayload)).toString('base64')

    const SIG = Buffer.from(
        'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==',
        'base64'
    )
    const CERT1 = 'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg'
    const CERT2 = 'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ=='

    return {
        messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
            botMetadata: {
                messageDisclaimerText: '',
                botResponseId: 'c3f51a90-7b12-44e1-a2c0-389daf667f12',
                verificationMetadata: {
                    proofs: [{
                        version: 1,
                        useCase: 'WA_BOT_MSG',
                        signature: SIG,
                        certificateChain: [CERT1, CERT2]
                    }]
                }
            }
        },
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 'AI_RICH_RESPONSE_TYPE_STANDARD',
                    submessages: [{
                        messageType: 'AI_RICH_RESPONSE_TEXT',
                        messageText: 'Subway Surf 🏃'
                    }],
                    unifiedResponse: {
                        data: Buffer.from(dataB64, 'base64')
                    },
                    contextInfo: {
                        stanzaId: 'B6GCA869902B27GE371878D3680G98F5',
                        participant: '0@s.whatsapp.net',
                        quotedMessage: {
                            extendedTextMessage: {
                                previewType: 'NONE',
                                inviteLinkGroupTypeV2: 'DEFAULT'
                            }
                        },
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedAiBotMessageInfo: {
                            botJid: '867051314767696@bot'
                        },
                        forwardOrigin: 'META_AI'
                    }
                }
            }
        }
    }
}


/*
 * Random bytes sederhana.
 * Tidak membutuhkan package tambahan.
 */
function cryptoRandom() {

    const arr =
        new Uint8Array(16);

    for (
        let i = 0;
        i < arr.length;
        i++
    ) {

        arr[i] =
            Math.floor(
                Math.random() * 256
            );

    }

    return arr;

}


export {
    buildSubwaySurfPayload,
    buildSubwaySurfMessage
};