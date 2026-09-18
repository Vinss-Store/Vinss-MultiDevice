/**
 * Calculator WebView — HTML + Meta AI Rich Response
 * Dikirim via relayMessage → richResponseMessage (webview WhatsApp)
 * Full UI calculator dengan glassmorphism modern
 * By VINSS BOTZ
 */

/**
 * Build HTML payload calculator
 * @param {string} namaBot
 * @returns {string} base64 JSON payload
 */
function buildCalculatorPayload(namaBot = 'VINSS BOTZ') {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
</head>
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

.display {
  background: rgba(0,0,0,0.5);
  border: 2px solid #1e293b;
  border-radius: 16px;
  padding: 16px 18px;
  margin-bottom: 10px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: right;
  overflow: hidden;
  position: relative;
}
.history {
  color: #64748b;
  font-size: 13px;
  min-height: 18px;
  margin-bottom: 4px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.current {
  font-size: 38px;
  font-weight: 900;
  line-height: 1.15;
  word-break: break-all;
  background: linear-gradient(135deg, #fff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: font-size 0.2s;
}
.current.small { font-size: 24px; }

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.btn {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  padding: 16px 0;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.08s ease, background 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn:active { transform: scale(0.92); background: rgba(255,255,255,0.18); }

.btn.op { background: rgba(99,102,241,0.22); color: #a5b4fc; border-color: rgba(99,102,241,0.35); }
.btn.op:active { background: rgba(99,102,241,0.4); }

.btn.fn { background: rgba(244,63,94,0.18); color: #fb7185; border-color: rgba(244,63,94,0.3); }
.btn.fn:active { background: rgba(244,63,94,0.35); }

.btn.equal {
  background: linear-gradient(135deg, #a855f7, #7c3aed);
  color: #fff;
  grid-column: span 2;
  box-shadow: 0 4px 16px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.2);
}
.btn.equal:active { transform: scale(0.94); }

.credit-bar {
  margin-top: 10px; text-align: center; font-size: 9px; font-weight: 800;
  letter-spacing: 1.5px; color: #475569; text-transform: uppercase;
  border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 8px;
}
.credit-bar span { color: #a855f7; }

@media (max-height: 640px) {
  .btn { padding: 12px 0; font-size: 18px; }
  .current { font-size: 30px; }
  .display { min-height: 90px; padding: 12px 14px; }
  .card { padding: 12px; }
}
</style>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <div>
        <div class="title-row"><span class="dot"></span><span class="bot-label">${namaBot}</span></div>
        <div class="game-title">Calculator 🧮</div>
      </div>
      <div style="text-align:right; font-size:10px; color:#64748b; line-height:1.6;">
        <div>Mode <b style="color:#a855f7">Standard</b></div>
        <div>Support <b style="color:#60a5fa">√ % ( )</b></div>
      </div>
    </div>

    <div class="display">
      <div class="history" id="history"></div>
      <div class="current" id="display">0</div>
    </div>

    <div class="buttons">
      <div class="btn fn" data-k="C">AC</div>
      <div class="btn fn" data-k="DEL">⌫</div>
      <div class="btn op" data-k="(">(</div>
      <div class="btn op" data-k=")">)</div>

      <div class="btn" data-k="7">7</div>
      <div class="btn" data-k="8">8</div>
      <div class="btn" data-k="9">9</div>
      <div class="btn op" data-k="÷">÷</div>

      <div class="btn" data-k="4">4</div>
      <div class="btn" data-k="5">5</div>
      <div class="btn" data-k="6">6</div>
      <div class="btn op" data-k="×">×</div>

      <div class="btn" data-k="1">1</div>
      <div class="btn" data-k="2">2</div>
      <div class="btn" data-k="3">3</div>
      <div class="btn op" data-k="-">−</div>

      <div class="btn op" data-k="√">√</div>
      <div class="btn" data-k="0">0</div>
      <div class="btn" data-k=".">.</div>
      <div class="btn op" data-k="+">+</div>

      <div class="btn fn" data-k="%">%</div>
      <div class="btn equal" data-k="=">=</div>
    </div>

    <div class="credit-bar">Powered by <span>${namaBot}</span> ⚡ Calculator v1.0</div>
  </div>
</div>

<script>
(function() {
  var displayEl = document.getElementById('display');
  var historyEl = document.getElementById('history');
  var expr = '';
  var history = '';
  var justEvaluated = false;

  function updateDisplay() {
    var text = expr || '0';
    displayEl.textContent = text;
    if (text.length > 12) displayEl.classList.add('small');
    else displayEl.classList.remove('small');
  }

  function press(val) {
    if (val === 'C') {
      expr = ''; history = ''; historyEl.textContent = '';
      justEvaluated = false;
      updateDisplay();
      return;
    }

    if (val === 'DEL') {
      expr = expr.slice(0, -1);
      updateDisplay();
      return;
    }

    if (val === '=') {
      if (!expr) return;
      try {
        var safeExpr = expr
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/−/g, '-')
          .replace(/√/g, 'Math.sqrt')
          .replace(/%/g, '/100');

        // validasi karakter aman
        var cleaned = safeExpr.replace(/Math\.sqrt/g, '');
        if (!/^[0-9+\\-*/%().\\s]+$/.test(cleaned)) {
          historyEl.textContent = expr + ' =';
          displayEl.textContent = 'Error';
          expr = '';
          return;
        }

        var result = Function('"use strict"; return (' + safeExpr + ')')();

        if (result === Infinity || Number.isNaN(result)) {
          historyEl.textContent = expr + ' =';
          displayEl.textContent = 'Error';
          expr = '';
          return;
        }

        if (typeof result === 'number' && !Number.isInteger(result)) {
          result = parseFloat(result.toFixed(10));
        }

        history = expr + ' =';
        historyEl.textContent = history;
        expr = String(result);
        justEvaluated = true;
        updateDisplay();
      } catch (e) {
        historyEl.textContent = expr + ' =';
        displayEl.textContent = 'Error';
        expr = '';
      }
      return;
    }

    // kalau baru selesai evaluasi dan user input angka → reset
    if (justEvaluated) {
      if (/[0-9.]/.test(val)) {
        expr = '';
        historyEl.textContent = '';
      }
      justEvaluated = false;
    }

    if (val === '√') {
      expr += '√(';
      updateDisplay();
      return;
    }

    expr += val;
    updateDisplay();
  }

  // pointer events
  var btns = document.querySelectorAll('.btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('pointerdown', function(e) {
      e.preventDefault();
      press(this.getAttribute('data-k'));
    });
  }

  // keyboard support (desktop)
  document.addEventListener('keydown', function(e) {
    var k = e.key;
    if (/[0-9.+]/.test(k)) press(k);
    else if (k === '-') press('-');
    else if (k === '*') press('×');
    else if (k === '/') press('÷');
    else if (k === '(' || k === ')' || k === '%') press(k);
    else if (k === 'Enter' || k === '=') press('=');
    else if (k === 'Backspace') press('DEL');
    else if (k === 'Escape') press('C');
  });

  updateDisplay();
})();
</script>
</body>
</html>`;

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
  };

  return Buffer.from(JSON.stringify(payload, null, 2)).toString('base64');
}

/**
 * Build full relayMessage payload untuk Calculator
 * @param {string} namaBot
 * @returns {object}
 */
function buildCalculatorMessage(namaBot = 'VINSS BOTZ') {
  const dataB64 = buildCalculatorPayload(namaBot);

  const SIG = Buffer.from(
    'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==',
    'base64'
  );
  const CERT1 = 'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg';
  const CERT2 = 'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==';

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
              messageText: 'Calculator 🧮'
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
  };
}

export { buildCalculatorPayload, buildCalculatorMessage };