const CSRFDemo = {
  init(container) {
    const modeContainer = document.createElement('div');
    container.appendChild(modeContainer);
    ModeToggle.create(modeContainer);

    container.insertAdjacentHTML('beforeend', `
      <div class="demo-area">
        <h3>Demo: Cross-Site Request Forgery</h3>
        <div class="demo-split">
          <div class="demo-panel">
            <div class="demo-panel-header bank">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 00-8 0v2"/></svg>
              BancaSicura - Il tuo conto
            </div>
            <div class="demo-panel-body">
              <p style="font-size:14px;color:#6B7280;">Benvenuto, sei loggato come <strong>vittima</strong></p>
              <div class="bank-balance" id="csrf-balance-victim">Caricamento...</div>
              <p style="font-size:13px;color:#6B7280;">Conto corrente principale</p>
              <div id="csrf-transfer-log" class="transfer-log"></div>
            </div>
          </div>
          <div class="demo-panel">
            <div class="demo-panel-header malicious">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Pagina Malevola dell'Attaccante
            </div>
            <div class="demo-panel-body">
              <p style="font-size:14px;">Hai vinto un premio! Clicca qui per riscuoterlo!</p>
              <div class="card-warning" style="margin:12px 0;padding:12px;font-family:var(--font-mono);font-size:12px;">
                &lt;!-- Form nascosto nella pagina --&gt;<br>
                &lt;form action="/api/csrf/transfer" method="POST"&gt;<br>
                &nbsp;&nbsp;&lt;input type="hidden" name="from" value="1"&gt;<br>
                &nbsp;&nbsp;&lt;input type="hidden" name="to" value="2"&gt;<br>
                &nbsp;&nbsp;&lt;input type="hidden" name="amount" value="1000"&gt;<br>
                &lt;/form&gt;<br>
                &lt;script&gt;document.forms[0].submit();&lt;/script&gt;
              </div>
              <div class="demo-controls">
                <button class="btn btn-danger" id="csrf-attack-btn">Visita Pagina Malevola</button>
                <button class="btn btn-outline" id="csrf-reset-btn">Reset Conti</button>
              </div>
              <div id="csrf-result"></div>
            </div>
          </div>
        </div>
        <div id="csrf-code" class="mt-2"></div>
      </div>
    `);

    CodeViewer.render(container.querySelector('#csrf-code'), {
      vulnerable: `// VULNERABILE: nessun token CSRF\napp.post('/transfer', (req, res) => {\n  const { from, to, amount } = req.body;\n  // Esegue il trasferimento senza verifiche\n  db.run('UPDATE accounts SET balance = ...');\n});`,
      protected: `// PROTETTO: verifica token CSRF\napp.post('/transfer', (req, res) => {\n  const { _csrf } = req.body;\n  if (_csrf !== storedToken) {\n    return res.status(403).json({\n      error: 'Token CSRF non valido'\n    });\n  }\n  // Token valido, procedi\n});`,
      language: 'javascript'
    });

    this._loadBalances(container);
    container.querySelector('#csrf-attack-btn').addEventListener('click', () => this._execAttack(container));
    container.querySelector('#csrf-reset-btn').addEventListener('click', async () => {
      await fetch('/api/reset-db');
      this._loadBalances(container);
      container.querySelector('#csrf-result').innerHTML = '';
    });
  },

  async _loadBalances(container) {
    try {
      const resp = await fetch('/api/csrf/balance');
      const data = await resp.json();
      const victim = data.accounts.find(a => a.owner === 'vittima');
      const attacker = data.accounts.find(a => a.owner === 'attaccante');

      const balanceEl = container.querySelector('#csrf-balance-victim');
      balanceEl.textContent = `EUR ${victim.balance.toFixed(2)}`;
      balanceEl.className = 'bank-balance' + (victim.balance < 5000 ? ' decreased' : '');

      container.querySelector('#csrf-transfer-log').innerHTML = attacker
        ? `<p>Conto attaccante: EUR ${attacker.balance.toFixed(2)}</p>` : '';
    } catch (err) {
      console.error(err);
    }
  },

  async _execAttack(container) {
    const mode = ModeToggle.getMode();
    const resultEl = container.querySelector('#csrf-result');

    resultEl.innerHTML = '<div class="demo-explanation" style="border-left-color:var(--amber)">Simulazione: il form nascosto si auto-invia...</div>';
    await new Promise(r => setTimeout(r, 1000));

    try {
      const resp = await fetch(`/api/csrf/transfer?mode=${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 1, to: 2, amount: 1000 })
      });
      const data = await resp.json();

      if (data.success) {
        resultEl.innerHTML = `<div class="demo-explanation danger">
          <strong>TRASFERIMENTO ESEGUITO SENZA CONSENSO!</strong><br>
          1000 EUR trasferiti dal conto della vittima all'attaccante.<br><br>
          ${data.explanation}
        </div>`;
      } else {
        resultEl.innerHTML = `<div class="demo-explanation success">
          <strong>ATTACCO BLOCCATO - ${data.error}</strong><br><br>
          ${data.explanation}
        </div>`;
      }

      this._loadBalances(container);
    } catch (err) {
      resultEl.innerHTML = `<div class="demo-explanation danger">Errore: ${err.message}</div>`;
    }
  }
};

window.CSRFDemo = CSRFDemo;
