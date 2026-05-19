const BruteForceDemo = {
  passwords: [
    '123456', 'password', '12345678', 'qwerty', 'abc123',
    'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
    'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
    'michael', 'shadow', '123123', '654321', 'superman',
    'qazwsx', 'password1', 'giulia2024', 'admin123', 'welcome'
  ],
  running: false,

  init(container) {
    const modeContainer = document.createElement('div');
    container.appendChild(modeContainer);
    ModeToggle.create(modeContainer);

    container.insertAdjacentHTML('beforeend', `
      <div class="demo-area">
        <h3>Demo: Brute Force Attack</h3>
        <div class="demo-split">
          <div class="demo-panel">
            <div class="demo-panel-header victim">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Login - Portale Aziendale
            </div>
            <div class="demo-panel-body">
              <div class="form-group">
                <label>Username target</label>
                <input type="text" class="input-field" id="bf-username" value="giulia" readonly style="background:var(--bg-alt);">
              </div>
              <div class="demo-controls">
                <button class="btn btn-danger" id="bf-start">Avvia Brute Force</button>
                <button class="btn btn-outline" id="bf-stop" disabled>Stop</button>
                <button class="btn btn-outline" id="bf-reset">Reset</button>
              </div>
              <div class="attack-stats" id="bf-stats">
                <div class="stat-card">
                  <div class="stat-value" id="bf-attempts">0</div>
                  <div class="stat-label">Tentativi</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value" id="bf-time">0.0s</div>
                  <div class="stat-label">Tempo</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value" id="bf-speed">0/s</div>
                  <div class="stat-label">Velocita'</div>
                </div>
                <div class="stat-card" id="bf-status-card">
                  <div class="stat-value" id="bf-status">--</div>
                  <div class="stat-label">Stato</div>
                </div>
              </div>
            </div>
          </div>
          <div class="demo-panel">
            <div class="demo-panel-header attacker">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              Console Attacco
            </div>
            <div class="demo-panel-body" style="max-height:350px;overflow-y:auto;padding:12px;" id="bf-console">
              <div style="color:#6B7280;font-family:var(--font-mono);font-size:13px;">In attesa di avvio...</div>
            </div>
          </div>
        </div>
        <div id="bf-result"></div>
        <div id="bf-code" class="mt-2"></div>
      </div>
    `);

    CodeViewer.render(container.querySelector('#bf-code'), {
      vulnerable: `// VULNERABILE: nessun limite ai tentativi\napp.post('/login', (req, res) => {\n  const user = db.prepare(\n    'SELECT * FROM users WHERE username=? AND password=?'\n  ).get(username, password);\n  res.json({ success: !!user });\n  // Nessun rate limiting, nessun lockout\n});`,
      protected: `// PROTETTO: rate limiting + account lockout\nif (failedAttempts >= 5) {\n  lockAccount(username, 30); // 30 secondi\n  return res.status(429).json({\n    error: 'Account bloccato',\n    retryAfter: 30\n  });\n}\n// + delay artificiale 500ms per tentativo\n// + logging di tutti i tentativi`,
      language: 'javascript'
    });

    container.querySelector('#bf-start').addEventListener('click', () => this._startAttack(container));
    container.querySelector('#bf-stop').addEventListener('click', () => { this.running = false; });
    container.querySelector('#bf-reset').addEventListener('click', async () => {
      this.running = false;
      await fetch('/api/bruteforce/reset-limiter', { method: 'POST' });
      await fetch('/api/reset-db');
      container.querySelector('#bf-console').innerHTML = '<div style="color:#6B7280;font-family:var(--font-mono);font-size:13px;">In attesa di avvio...</div>';
      container.querySelector('#bf-attempts').textContent = '0';
      container.querySelector('#bf-time').textContent = '0.0s';
      container.querySelector('#bf-speed').textContent = '0/s';
      container.querySelector('#bf-status').textContent = '--';
      container.querySelector('#bf-status-card').className = 'stat-card';
      container.querySelector('#bf-result').innerHTML = '';
    });
  },

  async _startAttack(container) {
    if (this.running) return;
    this.running = true;
    const username = container.querySelector('#bf-username').value;
    const mode = ModeToggle.getMode();
    const consoleEl = container.querySelector('#bf-console');
    const resultEl = container.querySelector('#bf-result');

    container.querySelector('#bf-start').disabled = true;
    container.querySelector('#bf-stop').disabled = false;

    consoleEl.innerHTML = '';
    resultEl.innerHTML = '';

    const startTime = Date.now();
    let attempts = 0;

    for (const password of this.passwords) {
      if (!this.running) break;

      attempts++;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const speed = (attempts / Math.max(elapsed, 0.1)).toFixed(0);

      container.querySelector('#bf-attempts').textContent = attempts;
      container.querySelector('#bf-time').textContent = `${elapsed}s`;
      container.querySelector('#bf-speed').textContent = `${speed}/s`;

      try {
        const resp = await fetch(`/api/bruteforce/login?mode=${mode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await resp.json();

        if (data.locked) {
          const entry = document.createElement('div');
          entry.className = 'password-attempt locked';
          entry.innerHTML = `<span>Tentativo #${attempts}: ${password}</span><span>BLOCCATO (${data.remainingSeconds}s)</span>`;
          consoleEl.appendChild(entry);
          consoleEl.scrollTop = consoleEl.scrollHeight;

          container.querySelector('#bf-status').textContent = 'LOCKED';
          container.querySelector('#bf-status-card').className = 'stat-card danger';

          resultEl.innerHTML = `<div class="demo-explanation success" style="margin-top:16px;">
            <strong>ATTACCO FERMATO - Account bloccato dopo ${data.attemptNumber || 5} tentativi</strong><br>
            ${data.explanation}<br><br>
            Con rate limiting: tempo stimato per 25 password = ~${25 * 30 / 5} secondi (vs ${(attempts * 0.05).toFixed(1)}s senza protezione)
          </div>`;
          break;
        }

        const entry = document.createElement('div');
        if (data.success) {
          entry.className = 'password-attempt found';
          entry.innerHTML = `<span>Tentativo #${attempts}: ${password}</span><span>PASSWORD TROVATA!</span>`;
          consoleEl.appendChild(entry);
          consoleEl.scrollTop = consoleEl.scrollHeight;

          container.querySelector('#bf-status').textContent = 'TROVATA';
          container.querySelector('#bf-status-card').className = 'stat-card danger';

          resultEl.innerHTML = `<div class="demo-explanation danger" style="margin-top:16px;">
            <strong>PASSWORD TROVATA: "${password}"</strong><br>
            ${attempts} tentativi in ${elapsed} secondi.<br><br>
            ${data.explanation}
          </div>`;
          break;
        } else {
          entry.className = 'password-attempt failed';
          entry.innerHTML = `<span>Tentativo #${attempts}: ${password}</span><span>${mode === 'protected' ? `(${data.attemptsRemaining} rimasti)` : 'fallito'}</span>`;
          consoleEl.appendChild(entry);
          consoleEl.scrollTop = consoleEl.scrollHeight;
        }

        await new Promise(r => setTimeout(r, mode === 'protected' ? 200 : 50));

      } catch (err) {
        console.error(err);
        break;
      }
    }

    this.running = false;
    container.querySelector('#bf-start').disabled = false;
    container.querySelector('#bf-stop').disabled = true;
  }
};

window.BruteForceDemo = BruteForceDemo;
