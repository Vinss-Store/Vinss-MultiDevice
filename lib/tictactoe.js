/**
 * Tic-Tac-Toe vs AI — HTML Canvas Game
 * Dikirim via relayMessage → richResponseMessage (webview WhatsApp)
 * AI menggunakan algoritma Minimax (tidak bisa kalah)
 * By VINSS BOTZ
 */

/**
 * Membangun HTML payload game TicTacToe
 * @param {string} namaBot
 * @returns {string} base64 JSON payload
 */
function buildTicTacToePayload(namaBot = 'VINSS BOTZ') {
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"></head>
<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; box-sizing: border-box; margin: 0; padding: 0; }
body { margin: 0; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #fff; overflow: hidden; }
.wrapper { width: 100%; max-width: 480px; margin: auto; padding: 12px; }
.card {
  background: linear-gradient(160deg, rgba(13,17,30,0.98), rgba(8,10,20,0.98));
  border: 2px solid #a855f7;
  border-radius: 20px;
  padding: 14px;
  box-shadow: 0 14px 44px rgba(0,0,0,0.8), inset 0 0 50px rgba(168,85,247,0.07);
}
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.title-row { display: flex; align-items: center; gap: 6px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; animation: pulse 1.4s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
.bot-label { font-size: 10px; letter-spacing: 1.5px; color: #a855f7; font-weight: 800; text-transform: uppercase; }
.game-title { font-size: 17px; font-weight: 900; color: #fff; margin-top: 2px; }

.scoreboard { display: flex; gap: 8px; margin-bottom: 10px; }
.score-pill {
  flex: 1; padding: 7px 6px; border-radius: 12px; text-align: center;
  border: 1px solid rgba(255,255,255,0.1);
}
.score-pill.you { background: rgba(59,130,246,0.15); border-color: #3b82f6; }
.score-pill.draw { background: rgba(255,255,255,0.05); }
.score-pill.ai { background: rgba(239,68,68,0.15); border-color: #ef4444; }
.score-pill .lbl { font-size: 8px; letter-spacing: 1px; color: #64748b; font-weight: 700; text-transform: uppercase; }
.score-pill .val { font-size: 18px; font-weight: 900; }
.score-pill.you .val { color: #60a5fa; }
.score-pill.draw .val { color: #94a3b8; }
.score-pill.ai .val { color: #f87171; }

.status-bar {
  text-align: center; margin-bottom: 10px;
  padding: 8px 12px; border-radius: 10px;
  background: rgba(255,255,255,0.05);
  font-size: 13px; font-weight: 700;
  transition: all 0.3s;
  min-height: 36px;
  display: flex; align-items: center; justify-content: center;
}

#game-container { width: 100%; aspect-ratio: 1; border-radius: 14px; overflow: hidden; border: 2px solid #1e293b; position: relative; }
canvas { width: 100%; height: 100%; display: block; touch-action: none; }

.actions { display: flex; gap: 10px; margin-top: 10px; }
.btn {
  flex: 1; padding: 13px; font-size: 14px; font-weight: 800;
  border: none; border-radius: 12px; cursor: pointer; color: #fff;
  letter-spacing: 0.5px;
}
.btn-restart {
  background: linear-gradient(135deg, #a855f7, #7c3aed);
  box-shadow: 0 4px 16px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
}
.btn-hint {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 4px 16px rgba(245,158,11,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
}
.btn:active { transform: scale(0.95); filter: brightness(0.9); }

.credit-bar {
  margin-top: 10px; text-align: center; font-size: 9px; font-weight: 800;
  letter-spacing: 1.5px; color: #475569; text-transform: uppercase;
  border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 8px;
}
.credit-bar span { color: #a855f7; }
</style>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <div>
        <div class="title-row"><span class="dot"></span><span class="bot-label">${namaBot}</span></div>
        <div class="game-title">Tic-Tac-Toe 🎮</div>
      </div>
      <div style="text-align:right; font-size:10px; color:#64748b; line-height:1.6;">
        <div>Kamu <b style="color:#60a5fa">✕</b></div>
        <div>AI <b style="color:#f87171">◯</b></div>
      </div>
    </div>

    <div class="scoreboard">
      <div class="score-pill you"><div class="lbl">Kamu ✕</div><div class="val" id="scoreYou">0</div></div>
      <div class="score-pill draw"><div class="lbl">Draw</div><div class="val" id="scoreDraw">0</div></div>
      <div class="score-pill ai"><div class="lbl">AI ◯</div><div class="val" id="scoreAI">0</div></div>
    </div>

    <div class="status-bar" id="statusBar">🎯 Giliran kamu! Tap kotak untuk bermain.</div>

    <div id="game-container"><canvas id="c"></canvas></div>

    <div class="actions">
      <button class="btn btn-restart" id="btnRestart">🔄 Main Lagi</button>
      <button class="btn btn-hint" id="btnHint">💡 Hint</button>
    </div>

    <div class="credit-bar">Powered by <span>${namaBot}</span> ⚡ AI Minimax</div>
  </div>
</div>

<script>
(function() {
  var cvs = document.getElementById('c');
  var ctx = cvs.getContext('2d');
  var statusBar = document.getElementById('statusBar');
  var scoreYouEl = document.getElementById('scoreYou');
  var scoreDrawEl = document.getElementById('scoreDraw');
  var scoreAIEl = document.getElementById('scoreAI');

  var SIZE = 300;
  cvs.width = SIZE; cvs.height = SIZE;

  // ============= STATE =============
  var board = ['','','','','','','','',''];
  var HUMAN = 'X', AI_P = 'O';
  var gameOver = false;
  var aiThinking = false;
  var winLine = null; // [i1,i2,i3]
  var scores = { X: 0, draw: 0, O: 0 };
  var hintCell = -1;
  var animFrame = 0;
  var AI_LEVEL = "normal"; 
  
  // ============= WIN CHECK =============
  var WINS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  function checkWinner(b) {
    for (var w of WINS) {
      if (b[w[0]] && b[w[0]] === b[w[1]] && b[w[1]] === b[w[2]]) return { winner: b[w[0]], line: w };
    }
    if (b.every(function(c){ return c !== ''; })) return { winner: 'draw', line: null };
    return null;
  }

// ============= MINIMAX AI =============
function minimax(b, depth, isMax) {
  var res = checkWinner(b);

  if (res) {
    if (res.winner === AI_P) return 10 - depth;
    if (res.winner === HUMAN) return depth - 10;
    return 0;
  }

  var scores2 = [];

  for (var i = 0; i < 9; i++) {
    if (b[i] !== '') continue;

    b[i] = isMax ? AI_P : HUMAN;
    scores2.push(minimax(b, depth + 1, !isMax));
    b[i] = '';
  }

  return isMax
    ? Math.max.apply(null, scores2)
    : Math.min.apply(null, scores2);
}

// ============= BEST MOVE =============
function bestMove() {
  var bestScore = -Infinity;
  var move = -1;

  for (var i = 0; i < 9; i++) {
    if (board[i] !== '') continue;

    board[i] = AI_P;

    var score = minimax(board, 0, false);

    board[i] = '';

    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }

  return move;
}

// ============= RANDOM MISTAKE =============
function randomMistake() {
  var empty = [];

  for (var i = 0; i < 9; i++) {
    if (board[i] === '') {
      empty.push(i);
    }
  }

  if (empty.length === 0) return -1;

  return empty[Math.floor(Math.random() * empty.length)];
}

// ============= AI MOVE =============
function getAIMove() {
  var empty = [];

  for (var i = 0; i < 9; i++) {
    if (board[i] === '') {
      empty.push(i);
    }
  }

  if (empty.length === 0) return -1;

  if (AI_LEVEL === 'easy') {
    if (Math.random() < 0.7) {
      return randomMistake();
    }

    return bestMove();
  }

  if (AI_LEVEL === 'normal') {
    if (Math.random() < 0.4) {
      return randomMistake();
    }

    return bestMove();
  }

  if (AI_LEVEL === 'hard') {
    if (Math.random() < 0.15) {
      return randomMistake();
    }

    return bestMove();
  }

  // impossible
  return bestMove();
}

  // ============= CELL COORDS =============
  var PAD = 20;
  var CELL = (SIZE - PAD * 2) / 3;

  function cellCenter(idx) {
    var row = Math.floor(idx / 3), col = idx % 3;
    return { x: PAD + col * CELL + CELL / 2, y: PAD + row * CELL + CELL / 2 };
  }

  function cellFromXY(x, y) {
    if (x < PAD || x > SIZE - PAD || y < PAD || y > SIZE - PAD) return -1;
    var col = Math.floor((x - PAD) / CELL);
    var row = Math.floor((y - PAD) / CELL);
    return row * 3 + col;
  }

  // ============= DRAWING =============
  function drawBoard() {
    // Background
    var bg = ctx.createRadialGradient(SIZE/2, SIZE/2, 0, SIZE/2, SIZE/2, SIZE*0.7);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#070a12');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Grid glow effect
    ctx.strokeStyle = 'rgba(168,85,247,0.35)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    for (var i = 1; i < 3; i++) {
      // Vertical lines
      var x = PAD + i * CELL;
      ctx.beginPath();
      ctx.moveTo(x, PAD + 8);
      ctx.lineTo(x, SIZE - PAD - 8);
      ctx.stroke();
      // Horizontal lines
      var y = PAD + i * CELL;
      ctx.beginPath();
      ctx.moveTo(PAD + 8, y);
      ctx.lineTo(SIZE - PAD - 8, y);
      ctx.stroke();
    }

    // Hint highlight
    if (hintCell >= 0 && !gameOver) {
      var hc = cellCenter(hintCell);
      ctx.fillStyle = 'rgba(245,158,11,0.15)';
      ctx.beginPath();
      ctx.roundRect(hc.x - CELL/2 + 4, hc.y - CELL/2 + 4, CELL - 8, CELL - 8, 10);
      ctx.fill();
    }

    // Draw pieces
    for (var i = 0; i < 9; i++) {
      if (!board[i]) continue;
      var c = cellCenter(i);
      var isWinCell = winLine && winLine.includes(i);

      if (board[i] === HUMAN) {
        // Draw X
        var r = CELL * 0.28;
        ctx.strokeStyle = isWinCell ? '#93c5fd' : '#3b82f6';
        ctx.lineWidth = isWinCell ? 5 : 4;
        ctx.lineCap = 'round';
        var glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r * 1.5);
        if (isWinCell) {
          ctx.shadowColor = '#60a5fa'; ctx.shadowBlur = 16;
        }
        ctx.beginPath(); ctx.moveTo(c.x - r, c.y - r); ctx.lineTo(c.x + r, c.y + r); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(c.x + r, c.y - r); ctx.lineTo(c.x - r, c.y + r); ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Draw O
        var r = CELL * 0.28;
        ctx.strokeStyle = isWinCell ? '#fca5a5' : '#ef4444';
        ctx.lineWidth = isWinCell ? 5 : 4;
        if (isWinCell) { ctx.shadowColor = '#f87171'; ctx.shadowBlur = 16; }
        ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI * 2); ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Win line
    if (winLine) {
      var p1 = cellCenter(winLine[0]), p3 = cellCenter(winLine[2]);
      var winner = board[winLine[0]];
      var g = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
      if (winner === HUMAN) { g.addColorStop(0, '#3b82f6'); g.addColorStop(1, '#60a5fa'); }
      else { g.addColorStop(0, '#ef4444'); g.addColorStop(1, '#f87171'); }
      ctx.strokeStyle = g;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.shadowColor = winner === HUMAN ? '#60a5fa' : '#f87171';
      ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p3.x, p3.y); ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // AI thinking indicator
    if (aiThinking) {
      animFrame = (animFrame + 1) % 60;
      var dots = '.'.repeat(Math.floor(animFrame / 20) + 1);
      ctx.fillStyle = 'rgba(168,85,247,0.7)';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AI sedang berpikir' + dots, SIZE/2, SIZE - 8);
    }
  }

  function loop() {
    drawBoard();
    requestAnimationFrame(loop);
  }

  // ============= GAME LOGIC =============
  function setStatus(txt) { statusBar.innerHTML = txt; }

  function endGame(result) {
    gameOver = true;
    hintCell = -1;
    if (result.winner === HUMAN) {
      scores.X++;
      scoreYouEl.textContent = scores.X;
      setStatus('🎉 <b style="color:#60a5fa">Kamu Menang!</b> Hebat banget!');
    } else if (result.winner === AI_P) {
      scores.O++;
      scoreAIEl.textContent = scores.O;
      setStatus('🤖 <b style="color:#f87171">AI Menang!</b> Coba lagi ya!');
    } else {
      scores.draw++;
      scoreDrawEl.textContent = scores.draw;
      setStatus('🤝 <b style="color:#94a3b8">Seri!</b> Permainan seimbang.');
    }
  }

  function doAI() {
    if (gameOver) return;
    aiThinking = true;
    setStatus('🤖 <b style="color:#a855f7">AI sedang berpikir...</b>');
    setTimeout(function() {
      var move = getAIMove();
      if (move >= 0) {
        board[move] = AI_P;
        var res = checkWinner(board);
        if (res) { winLine = res.line; endGame(res); }
        else setStatus('🎯 Giliran kamu! Tap kotak untuk bermain.');
      }
      aiThinking = false;
    }, 400 + Math.random() * 300);
  }

  function humanPlay(idx) {
  if (
    idx < 0 ||
    idx > 8 ||
    gameOver ||
    aiThinking ||
    board[idx] !== ''
  ) return;

  hintCell = -1;

  board[idx] = HUMAN;

  var res = checkWinner(board);

  if (res) {
    winLine = res.line;
    endGame(res);
    return;
  }

  setStatus('🤖 AI sedang berpikir...');
  doAI();
}

  function restart() {
    board = ['','','','','','','','',''];
    gameOver = false; winLine = null; hintCell = -1; aiThinking = false;
    setStatus('🎯 Giliran kamu! Tap kotak untuk bermain.');
  }

  function showHint() {
  if (gameOver || aiThinking) return;
  hintCell = bestMove();
  setTimeout(function () {
    hintCell = -1;
  }, 2000);
}

  // ============= EVENTS =============
  cvs.addEventListener('pointerdown', function(e) {
    e.preventDefault();
    var rect = cvs.getBoundingClientRect();
    var scaleX = SIZE / rect.width, scaleY = SIZE / rect.height;
    var x = (e.clientX - rect.left) * scaleX;
    var y = (e.clientY - rect.top) * scaleY;
    humanPlay(cellFromXY(x, y));
  });

  document.getElementById('btnRestart').addEventListener('pointerdown', function(e) {
    e.preventDefault(); restart();
  });
  document.getElementById('btnHint').addEventListener('pointerdown', function(e) {
    e.preventDefault(); showHint();
  });

  loop();
})();
</script>
</body>
</html>`

  const payload = {
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

  return Buffer.from(JSON.stringify(payload, null, 2)).toString('base64')
}

/**
 * Build full relayMessage payload untuk TicTacToe
 * @param {string} namaBot
 * @returns {object}
 */
function buildTicTacToeMessage(namaBot = 'VINSS BOTZ') {
  const dataB64 = buildTicTacToePayload(namaBot)

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
          proofs: [
            {
              version: 1,
              useCase: 'WA_BOT_MSG',
              signature: SIG,
              certificateChain: [CERT1, CERT2]
            }
          ]
        }
      }
    },
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 'AI_RICH_RESPONSE_TYPE_STANDARD',
          submessages: [
            {
              messageType: 'AI_RICH_RESPONSE_TEXT',
              messageText: 'Tic-Tac-Toe 🎮'
            }
          ],
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

export { buildTicTacToePayload, buildTicTacToeMessage }
