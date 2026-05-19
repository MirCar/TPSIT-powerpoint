const SQLiDemo = {
  initLogin(container) {
    const modeContainer = document.createElement('div');
    container.appendChild(modeContainer);
    ModeToggle.create(modeContainer);

    container.insertAdjacentHTML('beforeend', `
      <div class="demo-area">
        <h3>Demo: Authentication Bypass</h3>
        <div class="demo-split">
          <div>
            <div class="form-group">
              <label>Username</label>
              <input type="text" class="input-field mono" id="sqli-login-user" placeholder="admin' --" value="admin' --">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="text" class="input-field mono" id="sqli-login-pass" placeholder="qualsiasi cosa" value="qualsiasi">
            </div>
            <div class="demo-controls">
              <button class="btn btn-danger" id="sqli-login-btn">Esegui Login</button>
              <button class="btn btn-outline" id="sqli-login-reset">Reset</button>
            </div>
            <div id="sqli-login-result"></div>
          </div>
          <div>
            <div class="query-inspector">
              <div class="label">Query Inspector - SQL Generato</div>
              <div class="query-text" id="sqli-login-query">In attesa dell'invio...</div>
            </div>
            <div id="sqli-login-code"></div>
          </div>
        </div>
      </div>
    `);

    CodeViewer.render(container.querySelector('#sqli-login-code'), {
      vulnerable: `// VULNERABILE: concatenazione stringhe\nconst query = \`SELECT * FROM users\n  WHERE username = '\${username}'\n  AND password = '\${password}'\`;\nconst user = db.prepare(query).get();`,
      protected: `// PROTETTO: prepared statement\nconst query = 'SELECT * FROM users\\n  WHERE username = ? AND password = ?';\nconst user = db.prepare(query)\n  .get(username, password);`,
      language: 'javascript'
    });

    container.querySelector('#sqli-login-btn').addEventListener('click', () => this._execLogin(container));
    container.querySelector('#sqli-login-reset').addEventListener('click', () => {
      container.querySelector('#sqli-login-result').innerHTML = '';
      container.querySelector('#sqli-login-query').textContent = 'In attesa dell\'invio...';
    });
    document.addEventListener('mode-changed', () => {
      container.querySelector('#sqli-login-result').innerHTML = '';
      container.querySelector('#sqli-login-query').textContent = 'In attesa dell\'invio...';
    });
  },

  async _execLogin(container) {
    const username = container.querySelector('#sqli-login-user').value;
    const password = container.querySelector('#sqli-login-pass').value;
    const mode = ModeToggle.getMode();

    try {
      const resp = await fetch(`/api/sqli/login?mode=${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await resp.json();

      const queryEl = container.querySelector('#sqli-login-query');
      if (mode === 'vulnerable') {
        const highlighted = data.queryExecuted
          .replace(username, `<span class="injected">${this._escapeHtml(username)}</span>`)
          .replace(password, `<span class="injected">${this._escapeHtml(password)}</span>`);
        queryEl.innerHTML = highlighted;
      } else {
        queryEl.innerHTML = `${data.queryExecuted}\n<span class="param">Parametri: [${data.parameters.map(p => `"${this._escapeHtml(p)}"`).join(', ')}]</span>`;
      }

      const resultEl = container.querySelector('#sqli-login-result');
      if (data.success) {
        resultEl.innerHTML = `
          <div class="demo-explanation ${mode === 'vulnerable' ? 'danger' : 'success'}">
            <strong>${mode === 'vulnerable' ? 'ACCESSO OTTENUTO!' : 'Login riuscito (legittimo)'}</strong><br>
            Utente: ${data.user.username} (${data.user.role})<br><br>
            ${data.explanation}
          </div>`;
      } else {
        resultEl.innerHTML = `
          <div class="demo-explanation ${mode === 'protected' ? 'success' : ''}">
            <strong>${mode === 'protected' ? 'ATTACCO BLOCCATO' : 'Login fallito'}</strong><br>
            ${data.explanation || data.error || ''}
          </div>`;
      }
    } catch (err) {
      container.querySelector('#sqli-login-result').innerHTML = `<div class="demo-explanation danger">Errore: ${err.message}</div>`;
    }
  },

  initSearch(container) {
    const modeContainer = document.createElement('div');
    container.appendChild(modeContainer);
    ModeToggle.create(modeContainer);

    container.insertAdjacentHTML('beforeend', `
      <div class="demo-area">
        <h3>Demo: UNION-based Data Extraction</h3>
        <div class="demo-split">
          <div>
            <div class="form-group">
              <label>Ricerca Prodotto</label>
              <input type="text" class="input-field mono" id="sqli-search-input" placeholder="' UNION SELECT id,username,password,role,email,role FROM users --" value="' UNION SELECT id,username,password,role,email,role FROM users --">
            </div>
            <div class="demo-controls">
              <button class="btn btn-danger" id="sqli-search-btn">Cerca</button>
              <button class="btn btn-outline" id="sqli-search-normal">Cerca "Laptop" (normale)</button>
            </div>
            <div class="query-inspector">
              <div class="label">Query Inspector</div>
              <div class="query-text" id="sqli-search-query">In attesa...</div>
            </div>
          </div>
          <div>
            <div class="label" style="font-size:12px;font-weight:700;color:#94A3B8;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Risultati</div>
            <div class="result-box" id="sqli-search-result">In attesa della ricerca...</div>
          </div>
        </div>
        <div id="sqli-search-code" class="mt-2"></div>
      </div>
    `);

    CodeViewer.render(container.querySelector('#sqli-search-code'), {
      vulnerable: `// VULNERABILE\nconst query = \`SELECT * FROM products\n  WHERE name LIKE '%\${input}%'\`;\n// L'attaccante inietta UNION SELECT\n// per estrarre dati da altre tabelle`,
      protected: `// PROTETTO\nconst query = 'SELECT * FROM products\\n  WHERE name LIKE ?';\nconst param = \`%\${input}%\`;\ndb.prepare(query).all(param);\n// UNION viene trattato come testo`,
      language: 'javascript'
    });

    container.querySelector('#sqli-search-btn').addEventListener('click', () => {
      this._execSearch(container, container.querySelector('#sqli-search-input').value);
    });
    container.querySelector('#sqli-search-normal').addEventListener('click', () => {
      container.querySelector('#sqli-search-input').value = 'Laptop';
      this._execSearch(container, 'Laptop');
    });
  },

  async _execSearch(container, query) {
    const mode = ModeToggle.getMode();
    try {
      const resp = await fetch(`/api/sqli/search?q=${encodeURIComponent(query)}&mode=${mode}`);
      const data = await resp.json();

      const queryEl = container.querySelector('#sqli-search-query');
      queryEl.innerHTML = mode === 'vulnerable'
        ? data.queryExecuted.replace(query, `<span class="injected">${this._escapeHtml(query)}</span>`)
        : `${data.queryExecuted}\n<span class="param">Parametri: ${JSON.stringify(data.parameters)}</span>`;

      const resultEl = container.querySelector('#sqli-search-result');
      if (data.results && data.results.length > 0) {
        const rows = data.results.map(r => {
          const isUser = typeof r.price === 'string';
          if (isUser) {
            return `<span class="highlight-red">[DATI UTENTE ESTRATTI] id:${r.id} user:${r.name} pass:${r.description} role:${r.price} email:${r.category}</span>`;
          }
          return `[Prodotto] ${r.name} - ${r.description} - ${r.price} EUR`;
        });
        resultEl.innerHTML = rows.join('\n');
      } else {
        resultEl.innerHTML = '<span class="highlight-green">Nessun risultato trovato (l\'injection e\' stata bloccata)</span>';
      }
    } catch (err) {
      container.querySelector('#sqli-search-result').innerHTML = `Errore: ${err.message}`;
    }
  },

  initBlind(container) {
    const modeContainer = document.createElement('div');
    container.appendChild(modeContainer);
    ModeToggle.create(modeContainer);

    container.insertAdjacentHTML('beforeend', `
      <div class="demo-area">
        <h3>Demo: Blind SQL Injection</h3>
        <p>L'attaccante non vede i dati direttamente, ma inferisce informazioni dalla risposta booleana (esiste/non esiste).</p>
        <div class="demo-split">
          <div>
            <div class="form-group">
              <label>Verifica Utente per ID</label>
              <input type="text" class="input-field mono" id="sqli-blind-input" value="1">
            </div>
            <div class="demo-controls">
              <button class="btn btn-primary" id="sqli-blind-true">Invia: 1 AND 1=1 (vero)</button>
              <button class="btn btn-danger" id="sqli-blind-false">Invia: 1 AND 1=2 (falso)</button>
              <button class="btn btn-outline" id="sqli-blind-auto">Simulazione Automatica</button>
            </div>
            <div class="query-inspector">
              <div class="label">Query Inspector</div>
              <div class="query-text" id="sqli-blind-query">In attesa...</div>
            </div>
          </div>
          <div>
            <div id="sqli-blind-result" class="result-box">In attesa...</div>
          </div>
        </div>
      </div>
    `);

    container.querySelector('#sqli-blind-true').addEventListener('click', () => this._execBlind(container, '1 AND 1=1'));
    container.querySelector('#sqli-blind-false').addEventListener('click', () => this._execBlind(container, '1 AND 1=2'));
    container.querySelector('#sqli-blind-auto').addEventListener('click', () => this._blindAutoDemo(container));
  },

  async _execBlind(container, id) {
    const mode = ModeToggle.getMode();
    try {
      const resp = await fetch(`/api/sqli/blind?id=${encodeURIComponent(id)}&mode=${mode}`);
      const data = await resp.json();

      container.querySelector('#sqli-blind-query').innerHTML = mode === 'vulnerable'
        ? data.queryExecuted.replace(id, `<span class="injected">${id}</span>`)
        : `${data.queryExecuted}\n<span class="param">Parametro: [${data.parameters}]</span>`;

      const resultEl = container.querySelector('#sqli-blind-result');
      resultEl.innerHTML += `\n${id} => ${data.exists ? '<span class="highlight-green">TRUE (esiste)</span>' : '<span class="highlight-red">FALSE (non esiste)</span>'}`;
    } catch (err) {
      container.querySelector('#sqli-blind-result').innerHTML += `\nErrore: ${err.message}`;
    }
  },

  async _blindAutoDemo(container) {
    const resultEl = container.querySelector('#sqli-blind-result');
    resultEl.innerHTML = '<span class="highlight-yellow">--- Simulazione Blind SQLi: estrazione username admin ---</span>\n';
    resultEl.innerHTML += 'Obiettivo: estrarre il primo carattere dello username dell\'admin\n\n';

    const chars = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const payload = `1 AND (SELECT SUBSTR(username,1,1) FROM users WHERE role='admin')='${c}'`;
      const mode = ModeToggle.getMode();
      try {
        const resp = await fetch(`/api/sqli/blind?id=${encodeURIComponent(payload)}&mode=${mode}`);
        const data = await resp.json();
        const found = data.exists;

        if (mode === 'protected' && i === 0) {
          resultEl.innerHTML += '<span class="highlight-green">La parametrizzazione blocca tutte le injection. L\'attaccante non puo\' estrarre informazioni.</span>';
          return;
        }

        resultEl.innerHTML += `Tentativo '${c}': ${found ? '<span class="highlight-green">TROVATO!</span>' : '<span class="highlight-red">no</span>'}\n`;
        resultEl.scrollTop = resultEl.scrollHeight;

        if (found) {
          resultEl.innerHTML += `\n<span class="highlight-yellow">Primo carattere dello username admin: '${c}'</span>`;
          resultEl.innerHTML += `\nRipetendo per ogni posizione si ottiene l'intero username.`;
          resultEl.innerHTML += `\nStima tempo per tabella completa: ~${chars.length * 4 * 20} richieste`;
          return;
        }
        await new Promise(r => setTimeout(r, 100));
      } catch (err) {
        resultEl.innerHTML += `Errore: ${err.message}\n`;
        return;
      }
    }
  },

  _escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
};

window.SQLiDemo = SQLiDemo;
