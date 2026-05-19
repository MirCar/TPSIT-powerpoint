const XSSDemo = {
  initReflected(container) {
    const modeContainer = document.createElement('div');
    container.appendChild(modeContainer);
    ModeToggle.create(modeContainer);

    container.insertAdjacentHTML('beforeend', `
      <div class="demo-area">
        <h3>Demo: Reflected XSS</h3>
        <div class="demo-split">
          <div>
            <div class="form-group">
              <label>Barra di Ricerca del Blog</label>
              <input type="text" class="input-field mono" id="xss-search-input" value="<img src=x onerror=alert('XSS')>">
            </div>
            <div class="demo-controls">
              <button class="btn btn-danger" id="xss-search-btn">Cerca</button>
              <button class="btn btn-outline" id="xss-search-safe">Cerca "articolo" (normale)</button>
            </div>
            <div class="query-inspector">
              <div class="label">Risposta HTML dal Server</div>
              <div class="query-text" id="xss-search-response">In attesa...</div>
            </div>
          </div>
          <div>
            <div class="label" style="font-size:12px;font-weight:700;color:#94A3B8;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Anteprima Browser (sandbox)</div>
            <iframe id="xss-search-preview" class="xss-sandbox" sandbox="allow-scripts" style="width:100%;min-height:200px;border:2px solid var(--bg-alt);border-radius:8px;"></iframe>
          </div>
        </div>
        <div id="xss-reflected-code" class="mt-2"></div>
      </div>
    `);

    CodeViewer.render(container.querySelector('#xss-reflected-code'), {
      vulnerable: `// VULNERABILE: input riflesso senza escaping\nres.send(\`Risultati per: <strong>\${query}</strong>\`);\n// Il browser interpreta i tag HTML/script`,
      protected: `// PROTETTO: HTML entity encoding\nfunction escapeHtml(str) {\n  return str.replace(/</g, '&lt;')\n            .replace(/>/g, '&gt;');\n}\nres.send(\`Risultati per: <strong>\${escapeHtml(query)}</strong>\`);`,
      language: 'javascript'
    });

    container.querySelector('#xss-search-btn').addEventListener('click', () => this._execReflected(container));
    container.querySelector('#xss-search-safe').addEventListener('click', () => {
      container.querySelector('#xss-search-input').value = 'articolo';
      this._execReflected(container);
    });
  },

  async _execReflected(container) {
    const query = container.querySelector('#xss-search-input').value;
    const mode = ModeToggle.getMode();

    try {
      const resp = await fetch(`/api/xss/search?q=${encodeURIComponent(query)}&mode=${mode}`);
      const data = await resp.json();

      container.querySelector('#xss-search-response').textContent = data.resultsHtml;

      const iframe = container.querySelector('#xss-search-preview');
      const doc = `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:16px;background:#fff;color:#2C3E50;}</style></head><body>${data.resultsHtml}</body></html>`;
      iframe.srcdoc = doc;
    } catch (err) {
      container.querySelector('#xss-search-response').textContent = `Errore: ${err.message}`;
    }
  },

  initStored(container) {
    const modeContainer = document.createElement('div');
    container.appendChild(modeContainer);
    ModeToggle.create(modeContainer);

    container.insertAdjacentHTML('beforeend', `
      <div class="demo-area">
        <h3>Demo: Stored XSS</h3>
        <div class="demo-split">
          <div>
            <div class="form-group">
              <label>Autore</label>
              <input type="text" class="input-field" id="xss-comment-author" value="Attaccante">
            </div>
            <div class="form-group">
              <label>Commento</label>
              <textarea class="input-field mono" id="xss-comment-content" rows="3" style="resize:vertical;font-family:var(--font-mono);font-size:14px;"><script>document.body.style.background='#FEE2E2';document.title='HACKERATO!'</script>Commento innocuo</textarea>
            </div>
            <div class="demo-controls">
              <button class="btn btn-danger" id="xss-comment-btn">Pubblica Commento</button>
              <button class="btn btn-primary" id="xss-comment-load">Ricarica Commenti</button>
              <button class="btn btn-outline" id="xss-comment-clear">Pulisci</button>
            </div>
          </div>
          <div>
            <div class="label" style="font-size:12px;font-weight:700;color:#94A3B8;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Commenti (sandbox)</div>
            <iframe id="xss-comment-preview" class="xss-sandbox" sandbox="allow-scripts" style="width:100%;min-height:250px;border:2px solid var(--bg-alt);border-radius:8px;"></iframe>
          </div>
        </div>
        <div id="xss-stored-explanation"></div>
        <div id="xss-stored-code" class="mt-2"></div>
      </div>
    `);

    CodeViewer.render(container.querySelector('#xss-stored-code'), {
      vulnerable: `// VULNERABILE: innerHTML con dati non sanitizzati\ncommentDiv.innerHTML = comment.content;\n// Se il commento contiene <script>, viene eseguito`,
      protected: `// PROTETTO: textContent (non interpreta HTML)\ncommentDiv.textContent = comment.content;\n// Oppure: sanitizzazione lato server con escapeHtml()\n// + Content-Security-Policy header`,
      language: 'javascript'
    });

    container.querySelector('#xss-comment-btn').addEventListener('click', () => this._postComment(container));
    container.querySelector('#xss-comment-load').addEventListener('click', () => this._loadComments(container));
    container.querySelector('#xss-comment-clear').addEventListener('click', async () => {
      await fetch('/api/reset-db');
      this._loadComments(container);
    });
  },

  async _postComment(container) {
    const author = container.querySelector('#xss-comment-author').value;
    const content = container.querySelector('#xss-comment-content').value;
    const mode = ModeToggle.getMode();

    try {
      const resp = await fetch(`/api/xss/comment?mode=${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content })
      });
      const data = await resp.json();

      const explEl = container.querySelector('#xss-stored-explanation');
      explEl.innerHTML = `<div class="demo-explanation ${mode === 'vulnerable' ? 'danger' : 'success'}">${data.explanation}</div>`;

      this._loadComments(container);
    } catch (err) {
      container.querySelector('#xss-stored-explanation').innerHTML = `<div class="demo-explanation danger">Errore: ${err.message}</div>`;
    }
  },

  async _loadComments(container) {
    const mode = ModeToggle.getMode();
    try {
      const resp = await fetch(`/api/xss/comments?mode=${mode}`);
      const data = await resp.json();

      const iframe = container.querySelector('#xss-comment-preview');
      let commentsHtml = data.comments.map(c => `
        <div style="padding:12px;border-bottom:1px solid #E5E7EB;">
          <strong style="color:#003A70;">${c.author}</strong>
          <span style="color:#9CA3AF;font-size:12px;margin-left:8px;">${c.created_at}</span>
          <div style="margin-top:4px;">${c.content}</div>
        </div>
      `).join('');

      if (data.comments.length === 0) commentsHtml = '<p style="padding:16px;color:#9CA3AF;">Nessun commento ancora.</p>';

      const doc = `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:0;margin:0;background:#fff;color:#2C3E50;font-size:15px;}</style></head><body>${commentsHtml}</body></html>`;
      iframe.srcdoc = doc;
    } catch (err) {
      console.error('Errore caricamento commenti:', err);
    }
  }
};

window.XSSDemo = XSSDemo;
