/**
 * =============================================
 * VINSS MULTIDEVICE
 * CHESS / CATUR VS AI
 * =============================================
 */

const PIECES = {
    w: {
        k: "♔",
        q: "♕",
        r: "♖",
        b: "♗",
        n: "♘",
        p: "♙"
    },

    b: {
        k: "♚",
        q: "♛",
        r: "♜",
        b: "♝",
        n: "♞",
        p: "♟"
    }
};

const START_BOARD = [
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
];

const FILES = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h"
];


function cloneBoard(board) {
    return board.map(row => [...row]);
}

function inside(r, c) {
    return (
        r >= 0 &&
        r < 8 &&
        c >= 0 &&
        c < 8
    );
}

function colorOf(piece) {
    return piece ? piece[0] : null;
}

function typeOf(piece) {
    return piece ? piece[1] : null;
}

function opponent(color) {
    return color === "w" ? "b" : "w";
}

function squareName(r, c) {
    return `${FILES[c]}${8 - r}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function findKing(board, color) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === `${color}k`) {
                return {
                    r,
                    c
                };
            }
        }
    }

    return null;
}

function isSquareAttacked(
    board,
    r,
    c,
    byColor
) {
    /*
     * Pawn
     */
    const pawnRow =
        byColor === "w"
            ? r + 1
            : r - 1;

    for (const dc of [-1, 1]) {
        const pc = c + dc;

        if (
            inside(pawnRow, pc) &&
            board[pawnRow][pc] === `${byColor}p`
        ) {
            return true;
        }
    }

    const knightMoves = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1]
    ];

    for (const [dr, dc] of knightMoves) {
        const nr = r + dr;
        const nc = c + dc;

        if (
            inside(nr, nc) &&
            board[nr][nc] === `${byColor}n`
        ) {
            return true;
        }
    }

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) {
                continue;
            }

            const nr = r + dr;
            const nc = c + dc;

            if (
                inside(nr, nc) &&
                board[nr][nc] === `${byColor}k`
            ) {
                return true;
            }
        }
    }

    const straight = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    for (const [dr, dc] of straight) {
        let nr = r + dr;
        let nc = c + dc;

        while (inside(nr, nc)) {
            const piece = board[nr][nc];

            if (piece) {
                if (
                    colorOf(piece) === byColor &&
                    (
                        typeOf(piece) === "r" ||
                        typeOf(piece) === "q"
                    )
                ) {
                    return true;
                }

                break;
            }

            nr += dr;
            nc += dc;
        }
    }

    const diagonal = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
    ];

    for (const [dr, dc] of diagonal) {
        let nr = r + dr;
        let nc = c + dc;

        while (inside(nr, nc)) {
            const piece = board[nr][nc];

            if (piece) {
                if (
                    colorOf(piece) === byColor &&
                    (
                        typeOf(piece) === "b" ||
                        typeOf(piece) === "q"
                    )
                ) {
                    return true;
                }

                break;
            }

            nr += dr;
            nc += dc;
        }
    }

    return false;
}

function isInCheck(board, color) {
    const king = findKing(board, color);

    if (!king) {
        return true;
    }

    return isSquareAttacked(
        board,
        king.r,
        king.c,
        opponent(color)
    );
}


function pseudoMoves(
    board,
    r,
    c
) {
    const piece = board[r][c];

    if (!piece) {
        return [];
    }

    const color = colorOf(piece);
    const type = typeOf(piece);

    const moves = [];

    function addMove(
        nr,
        nc,
        promotion = null
    ) {
        if (!inside(nr, nc)) {
            return;
        }

        const target = board[nr][nc];

        /*
         * Tidak boleh makan bidak sendiri.
         */
        if (
            target &&
            colorOf(target) === color
        ) {
            return;
        }

        /*
         * King tidak boleh ditangkap langsung.
         * Checkmate ditentukan dari posisi check.
         */
        if (
            target &&
            typeOf(target) === "k"
        ) {
            return;
        }

        moves.push({
            from: {
                r,
                c
            },

            to: {
                r: nr,
                c: nc
            },

            promotion
        });
    }

    /* ========================================================
     * PAWN
     * ========================================================
     */

    if (type === "p") {
        const direction =
            color === "w"
                ? -1
                : 1;

        const startRow =
            color === "w"
                ? 6
                : 1;

        const promotionRow =
            color === "w"
                ? 0
                : 7;

        /*
         * Jalan maju.
         */
        const nr = r + direction;

        if (
            inside(nr, c) &&
            !board[nr][c]
        ) {
            addMove(
                nr,
                c,
                nr === promotionRow
                    ? "q"
                    : null
            );

            /*
             * Double move.
             */
            if (
                r === startRow &&
                !board[r + direction * 2][c]
            ) {
                addMove(
                    r + direction * 2,
                    c
                );
            }
        }

        /*
         * Capture diagonal.
         */
        for (const dc of [-1, 1]) {
            const nc = c + dc;

            if (!inside(nr, nc)) {
                continue;
            }

            const target = board[nr][nc];

            if (
                target &&
                colorOf(target) !== color &&
                typeOf(target) !== "k"
            ) {
                addMove(
                    nr,
                    nc,
                    nr === promotionRow
                        ? "q"
                        : null
                );
            }
        }

        return moves;
    }

    /* ========================================================
     * KNIGHT
     * ========================================================
     */

    if (type === "n") {
        const jumps = [
            [-2, -1],
            [-2, 1],
            [-1, -2],
            [-1, 2],
            [1, -2],
            [1, 2],
            [2, -1],
            [2, 1]
        ];

        for (const [dr, dc] of jumps) {
            addMove(
                r + dr,
                c + dc
            );
        }

        return moves;
    }

    /* ========================================================
     * KING
     * ========================================================
     */

    if (type === "k") {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (
                    dr === 0 &&
                    dc === 0
                ) {
                    continue;
                }

                addMove(
                    r + dr,
                    c + dc
                );
            }
        }

        return moves;
    }

    /* ========================================================
     * ROOK / BISHOP / QUEEN
     * ========================================================
     */

    const directions = [];

    if (
        type === "r" ||
        type === "q"
    ) {
        directions.push(
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1]
        );
    }

    if (
        type === "b" ||
        type === "q"
    ) {
        directions.push(
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        );
    }

    for (const [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;

        while (inside(nr, nc)) {
            const target = board[nr][nc];

            if (!target) {
                addMove(nr, nc);
            } else {
                if (
                    colorOf(target) !== color &&
                    typeOf(target) !== "k"
                ) {
                    addMove(
                        nr,
                        nc
                    );
                }

                break;
            }

            nr += dr;
            nc += dc;
        }
    }

    return moves;
}

/* ============================================================
 * APPLY MOVE
 * ============================================================
 */

function applyMove(
    board,
    move
) {
    const next = cloneBoard(board);

    const piece =
        next[
            move.from.r
        ][
            move.from.c
        ];

    next[
        move.from.r
    ][
        move.from.c
    ] = null;

    let finalPiece = piece;

    if (move.promotion) {
        finalPiece =
            `${colorOf(piece)}${move.promotion}`;
    }

    next[
        move.to.r
    ][
        move.to.c
    ] = finalPiece;

    return next;
}

/* ============================================================
 * LEGAL MOVES
 * ============================================================
 */

function legalMoves(
    board,
    color
) {
    const moves = [];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];

            if (
                !piece ||
                colorOf(piece) !== color
            ) {
                continue;
            }

            const possible =
                pseudoMoves(
                    board,
                    r,
                    c
                );

            for (const move of possible) {
                const next =
                    applyMove(
                        board,
                        move
                    );

                if (
                    !isInCheck(
                        next,
                        color
                    )
                ) {
                    moves.push(move);
                }
            }
        }
    }

    return moves;
}

/* ============================================================
 * MATERIAL EVALUATION
 * ============================================================
 */

function evaluateBoard(board) {
    const values = {
        p: 100,
        n: 320,
        b: 330,
        r: 500,
        q: 900,
        k: 20000
    };

    let score = 0;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];

            if (!piece) {
                continue;
            }

            const value =
                values[typeOf(piece)] || 0;

            if (colorOf(piece) === "b") {
                score += value;
            } else {
                score -= value;
            }

            /*
             * Bonus kecil untuk kontrol tengah papan.
             */
            if (
                r >= 2 &&
                r <= 5 &&
                c >= 2 &&
                c <= 5
            ) {
                if (colorOf(piece) === "b") {
                    score += 5;
                } else {
                    score -= 5;
                }
            }
        }
    }

    return score;
}

/* ============================================================
 * MINIMAX AI
 * ============================================================
 */

function minimax(
    board,
    depth,
    maximizing,
    alpha,
    beta
) {
    const color =
        maximizing
            ? "b"
            : "w";

    const moves =
        legalMoves(
            board,
            color
        );

    /*
     * Checkmate / stalemate.
     */
    if (moves.length === 0) {
        if (
            isInCheck(
                board,
                color
            )
        ) {
            return maximizing
                ? -999999
                : 999999;
        }

        return 0;
    }

    if (depth === 0) {
        return evaluateBoard(board);
    }

    if (maximizing) {
        let best = -Infinity;

        for (const move of moves) {
            const next =
                applyMove(
                    board,
                    move
                );

            const score =
                minimax(
                    next,
                    depth - 1,
                    false,
                    alpha,
                    beta
                );

            best =
                Math.max(
                    best,
                    score
                );

            alpha =
                Math.max(
                    alpha,
                    score
                );

            if (beta <= alpha) {
                break;
            }
        }

        return best;
    }

    let best = Infinity;

    for (const move of moves) {
        const next =
            applyMove(
                board,
                move
            );

        const score =
            minimax(
                next,
                depth - 1,
                true,
                alpha,
                beta
            );

        best =
            Math.min(
                best,
                score
            );

        beta =
            Math.min(
                beta,
                score
            );

        if (beta <= alpha) {
            break;
        }
    }

    return best;
}

/* ============================================================
 * FIND BEST AI MOVE
 * ============================================================
 */

function findBestMove(board) {
    const moves =
        legalMoves(
            board,
            "b"
        );

    if (!moves.length) {
        return null;
    }

    let bestScore = -Infinity;
    let bestMoves = [];

    for (const move of moves) {
        const next =
            applyMove(
                board,
                move
            );

        const score =
            minimax(
                next,
                2,
                false,
                -Infinity,
                Infinity
            );

        if (score > bestScore) {
            bestScore = score;
            bestMoves = [move];
        } else if (score === bestScore) {
            bestMoves.push(move);
        }
    }

    /*
     * Kalau beberapa move memiliki score sama,
     * pilih random agar AI tidak selalu identik.
     */
    return bestMoves[
        Math.floor(
            Math.random() *
            bestMoves.length
        )
    ];
}

/* ============================================================
 * BUILD HTML GAME
 * ============================================================
 */

function buildChessHtml(
    namaBot = "VINSS BOTZ"
) {
    const safeBot =
        escapeHtml(namaBot);

    return `
<!DOCTYPE html>

<html lang="id">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width,
    initial-scale=1.0,
    maximum-scale=1.0,
    user-scalable=no"
>

<title>VINSS CHESS</title>

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
    min-width: 0;
}

body {
    width: 100%;
    min-height: 100vh;

    padding: 10px 6px 18px;

    background:
        radial-gradient(
            circle at top,
            #211536 0%,
            #09070e 55%,
            #050509 100%
        );

    color: #fff;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    text-align: center;

    overflow-x: hidden;
}

.container {
    width: 100%;
    max-width: 760px;

    margin: 0 auto;

    padding: 0;
}

.brand {
    display: flex;

    align-items: center;
    justify-content: center;

    gap: 8px;

    color: #b982ff;

    font-size: 12px;

    font-weight: 900;

    letter-spacing: 2px;

    margin:
        4px 0 3px;
}

.title {
    margin: 0;

    font-size:
        clamp(
            25px,
            7vw,
            34px
        );

    line-height: 1.1;

    font-weight: 900;
}

.subtitle {
    margin:
        5px 0 12px;

    color: #a7a4ae;

    font-size:
        clamp(
            11px,
            3.5vw,
            14px
        );
}

.status {
    width: 100%;

    min-height: 48px;

    display: flex;

    align-items: center;
    justify-content: center;

    padding:
        10px 12px;

    margin:
        0 0 10px;

    border:
        1px solid
        rgba(170, 95, 255, .35);

    border-radius: 14px;

    background:
        rgba(255,255,255,.055);

    color: #fff;

    font-size:
        clamp(
            12px,
            3.6vw,
            15px
        );

    font-weight: 800;

    line-height: 1.35;
}

.board-wrap {
    width: 100%;

    padding: 5px;

    border:
        1px solid
        rgba(170, 95, 255, .40);

    border-radius: 15px;

    background:
        rgba(0,0,0,.34);

    box-shadow:
        0 12px 38px
        rgba(0,0,0,.45);
}

.board {
    width: 100%;

    aspect-ratio: 1 / 1;

    display: grid;

    grid-template-columns:
        repeat(8, 1fr);

    grid-template-rows:
        repeat(8, 1fr);

    overflow: hidden;

    border-radius: 9px;
}

.square {
    position: relative;

    width: 100%;
    height: 100%;

    display: flex;

    align-items: center;
    justify-content: center;

    font-size:
        clamp(
            30px,
            9vw,
            64px
        );

    line-height: 1;

    cursor: pointer;

    user-select: none;

    transition:
        transform .08s ease;
}

.square:active {
    transform:
        scale(.93);
}

.light {
    background:
        #f0d9b5;
}

.dark {
    background:
        #b58863;
}

.selected {
    outline:
        4px solid
        #b55cff;

    outline-offset:
        -4px;
}

.possible {
    box-shadow:
        inset
        0 0 0
        999px
        rgba(0,255,140,.23);
}

.last {
    box-shadow:
        inset
        0 0 0
        999px
        rgba(255,220,0,.23);
}

.check {
    box-shadow:
        inset
        0 0 0
        999px
        rgba(255,40,40,.42);
}

.coord {
    position: absolute;

    right: 3px;
    bottom: 2px;

    font-size:
        clamp(
            6px,
            1.7vw,
            9px
        );

    line-height: 1;

    font-weight: 800;

    color:
        rgba(0,0,0,.45);

    pointer-events: none;
}

.captured {
    width: 100%;

    min-height: 29px;

    padding:
        5px 3px;

    color: #ddd;

    font-size:
        clamp(
            17px,
            5vw,
            23px
        );

    line-height: 1.2;

    letter-spacing: 2px;

    overflow: hidden;
}

.controls {
    width: 100%;

    display: flex;

    gap: 8px;

    margin-top: 9px;
}

button {
    flex: 1;

    min-width: 0;

    min-height: 46px;

    padding:
        9px 8px;

    border: none;

    border-radius: 13px;

    background:
        linear-gradient(
            135deg,
            #7c32dc,
            #b04cff
        );

    color: #fff;

    font-size:
        clamp(
            12px,
            3.8vw,
            15px
        );

    font-weight: 900;

    cursor: pointer;

    white-space: nowrap;
}

button.secondary {
    background:
        rgba(255,255,255,.10);

    border:
        1px solid
        rgba(255,255,255,.10);
}

button:active {
    transform:
        scale(.97);
}

.info {
    width: 100%;

    margin-top: 10px;

    padding:
        0 4px;

    color: #88858f;

    font-size:
        clamp(
            10px,
            3vw,
            12px
        );

    line-height: 1.55;
}

.footer {
    width: 100%;

    margin-top: 12px;

    color: #68656e;

    font-size: 9px;

    font-weight: 800;

    letter-spacing: 2px;
}

/*
 * HP kecil
 */
@media (max-width: 380px) {

    body {
        padding:
            7px 4px 14px;
    }

    .brand {
        font-size: 10px;
    }

    .subtitle {
        margin-bottom: 8px;
    }

    .status {
        min-height: 43px;

        padding:
            8px;
    }

    .board-wrap {
        padding: 4px;
    }

    .square {
        font-size:
            clamp(
                27px,
                9.5vw,
                45px
            );
    }

    .controls {
        gap: 6px;
    }

    button {
        min-height: 42px;
        padding:
            7px 5px;
    }

    .info {
        font-size: 9px;
    }

}

/*
 * Tablet / layar besar
 */
@media (min-width: 600px) {

    body {
        padding:
            16px 10px 25px;
    }

    .board-wrap {
        padding: 7px;
    }

    .square {
        font-size: 58px;
    }

}


</style>

</head>

<body>

<div class="container">

    <div class="brand">
        <span>●</span>
        <span>VINSS BOTZ</span>
    </div>

    <div class="title">
        Chess ♟️
    </div>

    <div class="subtitle">
        ${safeBot} • Kamu ♔ vs AI ♚
    </div>

    <div
        id="status"
        class="status"
    >
        🎯 Giliran kamu — pilih bidak putih.
    </div>

    <div class="board-wrap">

        <div
            id="board"
            class="board"
        ></div>

    </div>

    <div
        id="captured"
        class="captured"
    ></div>

    <div class="controls">

        <button
            onclick="newGame()"
        >
            🔄 Game Baru
        </button>

        <button
            class="secondary"
            onclick="undoMove()"
        >
            ↩️ Undo
        </button>

    </div>

    <div class="info">

        Klik bidak putih terlebih dahulu,
        kemudian klik kotak tujuan.<br>

        Pion yang sampai ujung otomatis
        dipromosikan menjadi Queen.

    </div>

    <div class="footer">
        POWERED BY VINSS BOTZ ⚡ CHESS AI
    </div>

</div>

<script>

/* ============================================================
 * GAME DATA
 * ============================================================
 */

const PIECES =
    ${JSON.stringify(PIECES)};

const START_BOARD =
    ${JSON.stringify(START_BOARD)};

let board =
    START_BOARD.map(
        row => [...row]
    );

let turn = "w";

let selected = null;

let possible = [];

let history = [];

let lastMove = null;

let captured = [];

let gameOver = false;

/* ============================================================
 * HELPERS
 * ============================================================
 */

function cloneBoard(board) {
    return board.map(
        row => [...row]
    );
}

function inside(r, c) {
    return (
        r >= 0 &&
        r < 8 &&
        c >= 0 &&
        c < 8
    );
}

function colorOf(piece) {
    return piece
        ? piece[0]
        : null;
}

function typeOf(piece) {
    return piece
        ? piece[1]
        : null;
}

function opponent(color) {
    return color === "w"
        ? "b"
        : "w";
}

/* ============================================================
 * KING
 * ============================================================
 */

function findKing(
    board,
    color
) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {

            if (
                board[r][c] ===
                color + "k"
            ) {
                return {
                    r,
                    c
                };
            }

        }
    }

    return null;
}

/* ============================================================
 * ATTACK
 * ============================================================
 */

function attacked(
    board,
    r,
    c,
    byColor
) {

    /* Pawn */

    const pawnRow =
        byColor === "w"
            ? r + 1
            : r - 1;

    for (
        const dc of [-1, 1]
    ) {

        const pc =
            c + dc;

        if (
            inside(
                pawnRow,
                pc
            ) &&
            board[pawnRow][pc] ===
                byColor + "p"
        ) {
            return true;
        }

    }

    /* Knight */

    const knights = [
        [-2,-1],
        [-2,1],
        [-1,-2],
        [-1,2],
        [1,-2],
        [1,2],
        [2,-1],
        [2,1]
    ];

    for (
        const [dr, dc]
        of knights
    ) {

        const nr =
            r + dr;

        const nc =
            c + dc;

        if (
            inside(nr, nc) &&
            board[nr][nc] ===
                byColor + "n"
        ) {
            return true;
        }

    }

    /* King */

    for (
        let dr = -1;
        dr <= 1;
        dr++
    ) {

        for (
            let dc = -1;
            dc <= 1;
            dc++
        ) {

            if (
                dr === 0 &&
                dc === 0
            ) continue;

            const nr =
                r + dr;

            const nc =
                c + dc;

            if (
                inside(nr, nc) &&
                board[nr][nc] ===
                    byColor + "k"
            ) {
                return true;
            }

        }

    }

    /* Rook / Queen */

    const straight = [
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
    ];

    for (
        const [dr,dc]
        of straight
    ) {

        let nr =
            r + dr;

        let nc =
            c + dc;

        while (
            inside(nr,nc)
        ) {

            const p =
                board[nr][nc];

            if (p) {

                if (
                    colorOf(p) === byColor &&
                    (
                        typeOf(p) === "r" ||
                        typeOf(p) === "q"
                    )
                ) {
                    return true;
                }

                break;
            }

            nr += dr;
            nc += dc;
        }

    }

    /* Bishop / Queen */

    const diagonal = [
        [-1,-1],
        [-1,1],
        [1,-1],
        [1,1]
    ];

    for (
        const [dr,dc]
        of diagonal
    ) {

        let nr =
            r + dr;

        let nc =
            c + dc;

        while (
            inside(nr,nc)
        ) {

            const p =
                board[nr][nc];

            if (p) {

                if (
                    colorOf(p) === byColor &&
                    (
                        typeOf(p) === "b" ||
                        typeOf(p) === "q"
                    )
                ) {
                    return true;
                }

                break;
            }

            nr += dr;
            nc += dc;
        }

    }

    return false;
}

/* ============================================================
 * CHECK
 * ============================================================
 */

function inCheck(
    board,
    color
) {

    const king =
        findKing(
            board,
            color
        );

    if (!king) {
        return true;
    }

    return attacked(
        board,
        king.r,
        king.c,
        opponent(color)
    );
}

/* ============================================================
 * PSEUDO MOVES
 * ============================================================
 */

function pseudo(
    board,
    r,
    c
) {

    const piece =
        board[r][c];

    if (!piece) {
        return [];
    }

    const color =
        colorOf(piece);

    const type =
        typeOf(piece);

    const result = [];

    function add(
        nr,
        nc,
        promotion = null
    ) {

        if (
            !inside(
                nr,
                nc
            )
        ) {
            return;
        }

        const target =
            board[nr][nc];

        if (
            target &&
            colorOf(target) === color
        ) {
            return;
        }

        if (
            target &&
            typeOf(target) === "k"
        ) {
            return;
        }

        result.push({
            from: {
                r,
                c
            },

            to: {
                r: nr,
                c: nc
            },

            promotion
        });
    }

    /* Pawn */

    if (type === "p") {

        const dir =
            color === "w"
                ? -1
                : 1;

        const start =
            color === "w"
                ? 6
                : 1;

        const promotion =
            color === "w"
                ? 0
                : 7;

        const nr =
            r + dir;

        if (
            inside(nr,c) &&
            !board[nr][c]
        ) {

            add(
                nr,
                c,
                nr === promotion
                    ? "q"
                    : null
            );

            if (
                r === start &&
                !board[
                    r + dir * 2
                ][c]
            ) {

                add(
                    r + dir * 2,
                    c
                );

            }
        }

        for (
            const dc of [-1,1]
        ) {

            const nc =
                c + dc;

            if (
                !inside(nr,nc)
            ) continue;

            const target =
                board[nr][nc];

            if (
                target &&
                colorOf(target) !== color &&
                typeOf(target) !== "k"
            ) {

                add(
                    nr,
                    nc,
                    nr === promotion
                        ? "q"
                        : null
                );

            }

        }

        return result;
    }

    /* Knight */

    if (type === "n") {

        const jumps = [
            [-2,-1],
            [-2,1],
            [-1,-2],
            [-1,2],
            [1,-2],
            [1,2],
            [2,-1],
            [2,1]
        ];

        for (
            const [dr,dc]
            of jumps
        ) {

            add(
                r + dr,
                c + dc
            );

        }

        return result;
    }

    /* King */

    if (type === "k") {

        for (
            let dr = -1;
            dr <= 1;
            dr++
        ) {

            for (
                let dc = -1;
                dc <= 1;
                dc++
            ) {

                if (
                    !dr &&
                    !dc
                ) continue;

                add(
                    r + dr,
                    c + dc
                );

            }

        }

        return result;
    }

    /* Sliding pieces */

    const dirs = [];

    if (
        type === "r" ||
        type === "q"
    ) {

        dirs.push(
            [-1,0],
            [1,0],
            [0,-1],
            [0,1]
        );

    }

    if (
        type === "b" ||
        type === "q"
    ) {

        dirs.push(
            [-1,-1],
            [-1,1],
            [1,-1],
            [1,1]
        );

    }

    for (
        const [dr,dc]
        of dirs
    ) {

        let nr =
            r + dr;

        let nc =
            c + dc;

        while (
            inside(nr,nc)
        ) {

            if (
                !board[nr][nc]
            ) {

                add(
                    nr,
                    nc
                );

            } else {

                if (
                    colorOf(
                        board[nr][nc]
                    ) !== color &&
                    typeOf(
                        board[nr][nc]
                    ) !== "k"
                ) {

                    add(
                        nr,
                        nc
                    );

                }

                break;
            }

            nr += dr;
            nc += dc;
        }

    }

    return result;
}

/* ============================================================
 * APPLY
 * ============================================================
 */

function apply(
    board,
    move
) {

    const next =
        cloneBoard(board);

    const piece =
        next[
            move.from.r
        ][
            move.from.c
        ];

    next[
        move.from.r
    ][
        move.from.c
    ] = null;

    let finalPiece =
        piece;

    if (
        move.promotion
    ) {

        finalPiece =
            colorOf(piece) +
            move.promotion;

    }

    next[
        move.to.r
    ][
        move.to.c
    ] =
        finalPiece;

    return next;
}

/* ============================================================
 * LEGAL
 * ============================================================
 */

function legal(
    board,
    color
) {

    const result = [];

    for (
        let r = 0;
        r < 8;
        r++
    ) {

        for (
            let c = 0;
            c < 8;
            c++
        ) {

            const piece =
                board[r][c];

            if (
                !piece ||
                colorOf(piece) !== color
            ) {
                continue;
            }

            const moves =
                pseudo(
                    board,
                    r,
                    c
                );

            for (
                const move
                of moves
            ) {

                const next =
                    apply(
                        board,
                        move
                    );

                if (
                    !inCheck(
                        next,
                        color
                    )
                ) {

                    result.push(
                        move
                    );

                }

            }
        }
    }

    return result;
}

/* ============================================================
 * RENDER
 * ============================================================
 */

function render() {

    const root =
        document.getElementById(
            "board"
        );

    root.innerHTML = "";

    for (
        let r = 0;
        r < 8;
        r++
    ) {

        for (
            let c = 0;
            c < 8;
            c++
        ) {

            const square =
                document.createElement(
                    "div"
                );

            square.className =
                "square " +
                (
                    (r + c) % 2 === 0
                        ? "light"
                        : "dark"
                );

            /* Selected */

            if (
                selected &&
                selected.r === r &&
                selected.c === c
            ) {

                square.classList.add(
                    "selected"
                );

            }

            /* Possible */

            if (
                possible.some(
                    move =>
                        move.to.r === r &&
                        move.to.c === c
                )
            ) {

                square.classList.add(
                    "possible"
                );

            }

            /* Last move */

            if (
                lastMove &&
                (
                    (
                        lastMove.from.r === r &&
                        lastMove.from.c === c
                    ) ||
                    (
                        lastMove.to.r === r &&
                        lastMove.to.c === c
                    )
                )
            ) {

                square.classList.add(
                    "last"
                );

            }

            /* King check */

            const currentPiece =
                board[r][c];

            if (
                currentPiece &&
                typeOf(currentPiece) === "k" &&
                inCheck(
                    board,
                    colorOf(currentPiece)
                )
            ) {

                square.classList.add(
                    "check"
                );

            }

            /* Piece */

            if (currentPiece) {

                square.textContent =
                    PIECES[
                        colorOf(
                            currentPiece
                        )
                    ][
                        typeOf(
                            currentPiece
                        )
                    ];

            }

            /* Coordinate */

            const coord =
                document.createElement(
                    "span"
                );

            coord.className =
                "coord";

            coord.textContent =
                String.fromCharCode(
                    97 + c
                ) +
                (8 - r);

            square.appendChild(
                coord
            );

            square.onclick =
                () =>
                    clickSquare(
                        r,
                        c
                    );

            root.appendChild(
                square
            );
        }
    }

    document.getElementById(
        "captured"
    ).textContent =
        captured.length
            ? "♟️ " +
              captured
                .map(
                    p =>
                        PIECES[
                            p[0]
                        ][
                            p[1]
                        ]
                )
                .join(" ")
            : "";

    checkGame();
}

/* ============================================================
 * STATUS
 * ============================================================
 */

function setStatus(text) {

    document.getElementById(
        "status"
    ).textContent = text;

}

/* ============================================================
 * CLICK
 * ============================================================
 */

function clickSquare(
    r,
    c
) {

    if (
        gameOver ||
        turn !== "w"
    ) {
        return;
    }

    const piece =
        board[r][c];

    /*
     * Sudah memilih bidak.
     */
    if (selected) {

        const move =
            possible.find(
                m =>
                    m.to.r === r &&
                    m.to.c === c
            );

        /*
         * Tujuan valid.
         */
        if (move) {

            playerMove(
                move
            );

            return;
        }

        /*
         * Klik bidak putih lain.
         */
        if (
            piece &&
            colorOf(piece) === "w"
        ) {

            selected = {
                r,
                c
            };

            possible =
                legal(
                    board,
                    "w"
                ).filter(
                    m =>
                        m.from.r === r &&
                        m.from.c === c
                );

            render();

            return;
        }

        selected = null;
        possible = [];

        render();

        return;
    }

    /*
     * Belum memilih.
     */
    if (
        piece &&
        colorOf(piece) === "w"
    ) {

        selected = {
            r,
            c
        };

        possible =
            legal(
                board,
                "w"
            ).filter(
                m =>
                    m.from.r === r &&
                    m.from.c === c
            );

        render();

    }
}

/* ============================================================
 * PLAYER MOVE
 * ============================================================
 */

function playerMove(
    move
) {

    /*
     * Simpan history.
     */
    history.push({
        board:
            cloneBoard(board),

        captured:
            [...captured],

        lastMove,

        turn
    });

    const target =
        board[
            move.to.r
        ][
            move.to.c
        ];

    if (target) {
        captured.push(
            target
        );
    }

    board =
        apply(
            board,
            move
        );

    lastMove = move;

    selected = null;
    possible = [];

    turn = "b";

    render();

    if (gameOver) {
        return;
    }

    setStatus(
        "🤖 AI sedang berpikir..."
    );

    /*
     * Delay agar tidak terasa instant.
     */
    setTimeout(
        aiMove,
        450
    );
}

/* ============================================================
 * AI MOVE
 * ============================================================
 */

function aiMove() {

    if (gameOver) {
        return;
    }

    const moves =
        legal(
            board,
            "b"
        );

    if (!moves.length) {

        checkGame();

        return;
    }

    let best = null;

    let bestScore =
        -Infinity;

    /*
     * AI sederhana:
     * pilih berdasarkan material +
     * random kecil.
     */
    for (
        const move
        of moves
    ) {

        const next =
            apply(
                board,
                move
            );

        let score =
            0;

        const values = {
            p: 100,
            n: 320,
            b: 330,
            r: 500,
            q: 900,
            k: 20000
        };

        for (
            let r = 0;
            r < 8;
            r++
        ) {

            for (
                let c = 0;
                c < 8;
                c++
            ) {

                const piece =
                    next[r][c];

                if (!piece) {
                    continue;
                }

                const value =
                    values[
                        typeOf(piece)
                    ] || 0;

                if (
                    colorOf(piece) === "b"
                ) {

                    score += value;

                } else {

                    score -= value;

                }

            }
        }

        /*
         * Bonus capture.
         */
        if (
            board[
                move.to.r
            ][
                move.to.c
            ]
        ) {

            score += 50;

        }

        /*
         * Random kecil supaya AI
         * tidak selalu memilih move
         * yang sama ketika nilainya sama.
         */
        score +=
            Math.random() * 12;

        if (
            score > bestScore
        ) {

            bestScore = score;

            best = move;

        }

    }

    if (!best) {
        return;
    }

    const target =
        board[
            best.to.r
        ][
            best.to.c
        ];

    if (target) {
        captured.push(
            target
        );
    }

    board =
        apply(
            board,
            best
        );

    lastMove = best;

    turn = "w";

    render();

    if (!gameOver) {

        setStatus(
            "🎯 Giliran kamu — pilih bidak putih."
        );

    }
}

/* ============================================================
 * CHECK GAME
 * ============================================================
 */

function checkGame() {

    const moves =
        legal(
            board,
            turn
        );

    const check =
        inCheck(
            board,
            turn
        );

    /*
     * Tidak ada langkah.
     */
    if (
        moves.length === 0
    ) {

        gameOver = true;

        /*
         * Checkmate.
         */
        if (check) {

            if (
                turn === "w"
            ) {

                setStatus(
                    "♚ CHECKMATE — AI MENANG!"
                );

            } else {

                setStatus(
                    "♔ CHECKMATE — KAMU MENANG!"
                );

            }

        } else {

            /*
             * Stalemate.
             */
            setStatus(
                "🤝 STALEMATE — GAME SERI!"
            );

        }

        return;
    }

    /*
     * Masih ada langkah,
     * tetapi sedang check.
     */
    if (check) {

        if (
            turn === "w"
        ) {

            setStatus(
                "⚠️ CHECK! Rajamu sedang diserang!"
            );

        } else {

            setStatus(
                "🔥 AI sedang CHECK!"
            );

        }

    }
}

/* ============================================================
 * UNDO
 * ============================================================
 */

function undoMove() {

    if (
        !history.length
    ) {

        setStatus(
            "❌ Belum ada langkah untuk di-undo."
        );

        return;
    }

    const previous =
        history.pop();

    board =
        cloneBoard(
            previous.board
        );

    captured =
        [
            ...previous.captured
        ];

    lastMove =
        previous.lastMove;

    turn = "w";

    selected = null;

    possible = [];

    gameOver = false;

    render();

    setStatus(
        "🎯 Giliran kamu — pilih bidak putih."
    );
}

/* ============================================================
 * NEW GAME
 * ============================================================
 */

function newGame() {

    board =
        START_BOARD.map(
            row => [...row]
        );

    turn = "w";

    selected = null;

    possible = [];

    history = [];

    lastMove = null;

    captured = [];

    gameOver = false;

    render();

    setStatus(
        "🎯 Giliran kamu — pilih bidak putih."
    );
}

/* ============================================================
 * START
 * ============================================================
 */

render();

</script>

</body>

</html>
`;
}

/* ============================================================
 * BUILD HTML PAYLOAD
 *
 * Struktur ini mengikuti format Tic-Tac-Toe kamu:
 *
 * response_id
 *   └── sections
 *        └── view_model
 *             └── primitive
 *                  ├── __typename
 *                  ├── payload
 *                  └── trusted_sources
 *
 * Kemudian HTML di-base64-kan.
 * ============================================================
 */

function buildChessPayload(
    namaBot = "VINSS BOTZ"
) {

    const html =
        buildChessHtml(
            namaBot
        );

    const payload = {
        response_id:
            Math.random()
                .toString(36)
                .slice(2) +
            Date.now()
                .toString(36),

        sections: [
            {
                view_model: {

                    primitive: {

                        __typename:
                            "GenAIaeacdsnwHtmlPrimitive",

                        payload:
                            html,

                        trusted_sources: [
                            "vinss.bot",
                            "vinss.dev"
                        ]
                    },

                    __typename:
                        "GenAISingleLayoutViewModel"
                }
            }
        ]
    };

    return Buffer
        .from(
            JSON.stringify(
                payload,
                null,
                2
            )
        )
        .toString("base64");
}

/* ============================================================
 * BUILD WHATSAPP RICH RESPONSE
 *
 * PENTING:
 * Jangan ubah struktur ini sembarangan.
 *
 * Tic-Tac-Toe kamu yang berhasil menggunakan:
 *
 * messageContextInfo
 *   └── botMetadata
 *
 * botForwardedMessage
 *   └── message
 *        └── richResponseMessage
 *             └── unifiedResponse
 *                  └── data
 *
 * Struktur tersebut terlihat pada file Tic-Tac-Toe
 * yang kamu upload. 
 * ============================================================
 */

function buildChessMessage(
    namaBot = "VINSS BOTZ"
) {

    const dataB64 =
        buildChessPayload(
            namaBot
        );

    /*
     * Signature metadata yang sama dengan
     * rich response Tic-Tac-Toe kamu.
     */

    const SIG = Buffer.from(
        "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==",
        "base64"
    );

    const CERT1 =
        "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMI2uXvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";

    const CERT2 =
        "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNst4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

    return {

        messageContextInfo: {

            deviceListMetadata: {},

            deviceListMetadataVersion: 2,

            botMetadata: {

                messageDisclaimerText: "",

                botResponseId:
                    "c3f51a90-7b12-44e1-a2c0-389daf667f12",

                verificationMetadata: {

                    proofs: [

                        {

                            version: 1,

                            useCase:
                                "WA_BOT_MSG",

                            signature:
                                SIG,

                            certificateChain: [
                                CERT1,
                                CERT2
                            ]
                        }

                    ]
                }
            }
        },

        botForwardedMessage: {

            message: {

                richResponseMessage: {

                    messageType:
                        "AI_RICH_RESPONSE_TYPE_STANDARD",

                    submessages: [

                        {

                            messageType:
                                "AI_RICH_RESPONSE_TEXT",

                            messageText:
                                "Chess / Catur ♟️"

                        }

                    ],

                    unifiedResponse: {

                        data:
                            Buffer.from(
                                dataB64,
                                "base64"
                            )

                    },

                    contextInfo: {

                        stanzaId:
                            Math.random()
                                .toString(36)
                                .substring(
                                    2,
                                    18
                                )
                                .toUpperCase(),

                        participant:
                            "0@s.whatsapp.net",

                        quotedMessage: {

                            extendedTextMessage: {

                                previewType:
                                    "NONE",

                                inviteLinkGroupTypeV2:
                                    "DEFAULT"

                            }

                        },

                        forwardingScore: 1,

                        isForwarded: true,

                        forwardedAiBotMessageInfo: {

                            botJid:
                                "867051314767696@bot"

                        },

                        forwardOrigin:
                            "META_AI"

                    }

                }

            }

        }

    };
}

/* ============================================================
 * EXPORT
 * ============================================================
 */

export {
    buildChessPayload,
    buildChessMessage
};