const SLIDES = [
  // ====================== SLIDE 1: TITOLO ======================
  {
    id: 'intro-title',
    type: 'title',
    html: `
      <div class="slide-title">
        <div class="badge badge-teal mb-2">TPSIT - Tecnologie e Progettazione di Sistemi Informatici</div>
        <h2>Cybersecurity: Attacchi e Difese</h2>
        <p class="subtitle">Analisi interattiva delle principali vulnerabilita' web con dimostrazioni pratiche in ambiente simulato</p>
        <div class="mt-3" style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
          <span class="badge badge-danger">SQL Injection</span>
          <span class="badge badge-amber">XSS</span>
          <span class="badge badge-primary">CSRF</span>
          <span class="badge badge-teal">Brute Force</span>
          <span class="badge badge-danger">Data Exfiltration</span>
        </div>
      </div>`
  },

  // ====================== SLIDE 2: COS'E' LA CYBERSECURITY ======================
  {
    id: 'intro-cybersec',
    type: 'content',
    html: `
      <div class="slide-content">
        <h2>Cos'e' la Cybersecurity</h2>
        <p>La <strong>cybersecurity</strong> (o sicurezza informatica) e' l'insieme delle tecnologie, processi e pratiche progettate per proteggere reti, dispositivi, programmi e dati da attacchi, danni o accessi non autorizzati.</p>

        <div class="card card-accent">
          <p>In un mondo sempre piu' connesso, la sicurezza informatica non e' un optional ma una necessita'. Ogni dispositivo connesso a Internet e' potenzialmente un bersaglio.</p>
        </div>

        <h3>Perche' e' importante?</h3>
        <ul>
          <li><strong>Protezione dei dati personali</strong>: informazioni sensibili come credenziali, dati finanziari e sanitari</li>
          <li><strong>Continuita' operativa</strong>: un attacco puo' paralizzare un'intera organizzazione</li>
          <li><strong>Conformita' normativa</strong>: GDPR, NIS2, e altre normative impongono standard di sicurezza</li>
          <li><strong>Impatto economico</strong>: il costo medio di un data breach nel 2024 supera i 4 milioni di dollari</li>
        </ul>

        <div class="key-points">
          <h4>Punti Chiave per l'Esposizione</h4>
          <ul>
            <li>La cybersecurity riguarda tutti, non solo le grandi aziende</li>
            <li>L'anello debole e' spesso il fattore umano (social engineering)</li>
            <li>La sicurezza e' un processo continuo, non un prodotto</li>
          </ul>
        </div>

        <div class="card card-warning mt-2">
          <h4>Casi Reali Significativi</h4>
          <ul>
            <li><strong>WannaCry (2017)</strong>: ransomware che ha colpito oltre 200.000 computer in 150 paesi, paralizzando ospedali (NHS in UK), fabbriche e istituzioni. Sfruttava una vulnerabilita' di Windows (EternalBlue) per propagarsi nella rete.</li>
            <li><strong>Attacco alla Regione Lazio (2021)</strong>: un ransomware ha bloccato il sistema di prenotazione vaccini COVID. L'attacco e' partito dal computer di un dipendente in smart working.</li>
            <li><strong>SolarWinds (2020)</strong>: attaccanti hanno compromesso il software di aggiornamento di SolarWinds, infiltrandosi in migliaia di organizzazioni tra cui agenzie governative USA.</li>
          </ul>
          <p>In Italia, l'<strong>ACN</strong> (Agenzia per la Cybersicurezza Nazionale) e' l'autorita' preposta alla protezione degli interessi nazionali nel campo della cybersecurity.</p>
        </div>
      </div>`
  },

  // ====================== SLIDE 3: TRIADE CIA ======================
  {
    id: 'intro-cia',
    type: 'content',
    html: `
      <div class="slide-content">
        <h2>La Triade CIA</h2>
        <p>Il modello fondamentale della sicurezza informatica si basa su tre pilastri:</p>

        <div class="cia-triad">
          <div class="cia-item conf">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#003A70" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <h4>Confidentiality</h4>
            <p>I dati devono essere accessibili solo a chi e' autorizzato. Crittografia, controllo accessi, autenticazione.</p>
          </div>
          <div class="cia-item integ">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#065F46" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <h4>Integrity</h4>
            <p>I dati non devono essere modificati in modo non autorizzato. Hash, firma digitale, checksum.</p>
          </div>
          <div class="cia-item avail">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#92400E" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <h4>Availability</h4>
            <p>I sistemi e i dati devono essere disponibili quando servono. Ridondanza, backup, protezione DDoS.</p>
          </div>
        </div>

        <div class="card card-accent mt-2">
          <p>Ogni attacco informatico viola almeno uno di questi principi. Ad esempio:</p>
          <ul>
            <li><strong>SQL Injection</strong> -> viola la Confidentiality (accesso a dati non autorizzati)</li>
            <li><strong>Man-in-the-Middle</strong> -> viola l'Integrity (modifica dei dati in transito)</li>
            <li><strong>DDoS</strong> -> viola l'Availability (il servizio diventa irraggiungibile)</li>
          </ul>
        </div>

        <h3 class="mt-2">Collegamento con gli attacchi che vedremo</h3>
        <p>Ogni attacco che analizzeremo viola almeno uno di questi principi. La triade CIA e' il framework fondamentale per categorizzare qualsiasi minaccia informatica e valutarne l'impatto. Ad esempio, un attacco SQL Injection puo' violare contemporaneamente tutti e tre i principi: puo' leggere dati riservati (Confidentiality), modificarli (Integrity) o cancellare intere tabelle rendendo il servizio inutilizzabile (Availability).</p>
      </div>`
  },

  // ====================== SLIDE 4: OWASP TOP 10 INTRO ======================
  {
    id: 'owasp-intro',
    type: 'section-intro',
    html: `
      <div class="slide-section-intro">
        <div class="section-number">Parte 1</div>
        <h2>OWASP Top 10</h2>
        <p class="section-desc">Le 10 vulnerabilita' web piu' critiche secondo l'Open Web Application Security Project</p>
      </div>`
  },

  // ====================== SLIDE 5: OWASP TOP 10 LISTA ======================
  {
    id: 'owasp-list',
    type: 'content',
    html: `
      <div class="slide-content">
        <h2>OWASP Top 10 (2021)</h2>
        <p><strong>OWASP</strong> (Open Web Application Security Project) e' un'organizzazione no-profit che produce documentazione, strumenti e standard per la sicurezza delle applicazioni web. La <strong>Top 10</strong> e' la lista delle vulnerabilita' piu' critiche, aggiornata periodicamente.</p>

        <ol class="owasp-list">
          <li><strong>Broken Access Control</strong> - Mancato controllo dei permessi, utenti che accedono a risorse non autorizzate</li>
          <li><strong>Cryptographic Failures</strong> - Crittografia debole o assente per proteggere dati sensibili</li>
          <li><strong>Injection</strong> - SQL, NoSQL, OS, LDAP injection: input malevolo interpretato come codice</li>
          <li><strong>Insecure Design</strong> - Difetti architetturali che non possono essere risolti con una buona implementazione</li>
          <li><strong>Security Misconfiguration</strong> - Configurazioni di default, servizi non necessari, error handling verboso</li>
          <li><strong>Vulnerable Components</strong> - Uso di librerie, framework o componenti con vulnerabilita' note</li>
          <li><strong>Auth Failures</strong> - Debolezze nell'identificazione e autenticazione degli utenti</li>
          <li><strong>Data Integrity Failures</strong> - Software e dati senza verifica di integrita' (es. aggiornamenti non firmati)</li>
          <li><strong>Logging & Monitoring Failures</strong> - Mancanza di log e monitoraggio che impedisce di rilevare attacchi</li>
          <li><strong>SSRF</strong> - Server-Side Request Forgery: il server viene ingannato per fare richieste a risorse interne</li>
        </ol>

        <div class="key-points">
          <h4>Punti Chiave</h4>
          <ul>
            <li>Noi approfondiremo la A03 (Injection), collegata anche a A01, A07 e A09</li>
            <li>La Top 10 non e' una lista esaustiva ma un punto di partenza</li>
            <li>Molte vulnerabilita' sono prevenibili con buone pratiche di sviluppo</li>
          </ul>
        </div>

        <div class="card card-accent mt-2">
          <h4>Evoluzione della Top 10</h4>
          <p>La Top 10 viene aggiornata circa ogni 3-4 anni sulla base dei dati raccolti da centinaia di organizzazioni. L'<strong>Injection (A03)</strong> era la vulnerabilita' numero 1 dalla prima edizione fino al 2017, quando e' stata superata dal Broken Access Control. Questo non significa che l'injection sia meno pericolosa, ma che le altre categorie hanno visto un aumento di incidenza. La numerazione riflette la combinazione di frequenza e gravita', non un ordine di importanza assoluto.</p>
          <p>Nella nostra analisi approfondiremo la A03 (Injection), che e' strettamente collegata anche alla A01 (Broken Access Control), alla A07 (Authentication Failures) e alla A09 (Logging Failures).</p>
        </div>
      </div>`
  },

  // ====================== SLIDE 6: ARCHITETTURA WEB ======================
  {
    id: 'web-architecture',
    type: 'content',
    html: `
      <div class="slide-content">
        <h2>Architettura Web e Superfici di Attacco</h2>
        <p>Per comprendere le vulnerabilita', dobbiamo capire come funziona un'applicazione web:</p>

        <div class="step-flow">
          <div class="step active">Client<br><small>(Browser)</small></div>
          <div class="arrow">--></div>
          <div class="step">Richiesta HTTP<br><small>(GET/POST)</small></div>
          <div class="arrow">--></div>
          <div class="step active">Server Web<br><small>(Node.js/Express)</small></div>
          <div class="arrow">--></div>
          <div class="step active">Database<br><small>(SQLite/MySQL)</small></div>
        </div>

        <div class="grid-2 mt-2">
          <div class="card card-accent">
            <h4>Richiesta HTTP</h4>
            <pre><code>POST /api/login HTTP/1.1
Host: esempio.it
Content-Type: application/json

{"username": "admin", "password": "123"}</code></pre>
            <p class="text-muted">Il client invia dati al server tramite URL (GET) o body (POST). I cookie vengono inviati automaticamente.</p>
          </div>
          <div class="card card-warning">
            <h4>Dove si inseriscono le vulnerabilita'</h4>
            <ul>
              <li><strong>Input utente non validato</strong>: l'origine di quasi tutte le injection</li>
              <li><strong>Output non sanitizzato</strong>: causa di XSS</li>
              <li><strong>Sessioni non protette</strong>: causa di CSRF</li>
              <li><strong>Autenticazione debole</strong>: causa di brute force</li>
            </ul>
          </div>
        </div>

        <div class="card card-danger mt-2">
          <h4>La regola d'oro della sicurezza web</h4>
          <p><strong>Mai fidarsi dell'input dell'utente.</strong> Tutto cio' che arriva dal client (form, URL, cookie, header) puo' essere manipolato e deve essere validato e sanitizzato lato server.</p>
        </div>

        <div class="card card-accent mt-2">
          <h4>Trust Boundary (Confine di Fiducia)</h4>
          <p>Il <strong>trust boundary</strong> e' il confine tra cio' che controlliamo (il server) e cio' che non controlliamo (il client). Il browser dell'utente, le richieste HTTP, i parametri URL, i cookie e i campi dei form sono tutti fuori dal nostro controllo: un attaccante puo' modificarli liberamente usando strumenti come Burp Suite o le DevTools del browser. Per questo motivo, <strong>ogni dato che attraversa il trust boundary deve essere validato e sanitizzato lato server</strong>, indipendentemente da qualsiasi validazione lato client (che puo' essere facilmente aggirata).</p>
        </div>
      </div>`
  },

  // ====================== SLIDE 7: SQL INJECTION INTRO ======================
  {
    id: 'sqli-intro',
    type: 'section-intro',
    html: `
      <div class="slide-section-intro">
        <div class="section-number">Parte 2</div>
        <h2>SQL Injection</h2>
        <p class="section-desc">La vulnerabilita' piu' diffusa e pericolosa nelle applicazioni web: quando l'input dell'utente diventa codice SQL</p>
      </div>`
  },

  // ====================== SLIDE 8: SQL INJECTION TEORIA ======================
  {
    id: 'sqli-theory',
    type: 'content',
    html: `
      <div class="slide-content">
        <h2>SQL Injection - Come Funziona</h2>

        <p><strong>SQL</strong> (Structured Query Language) e' il linguaggio usato per interrogare i database relazionali. Un'applicazione web tipica costruisce query SQL per autenticare utenti, cercare dati, ecc.</p>

        <h3>Il Problema: Concatenazione di Stringhe</h3>
        <div class="grid-2">
          <div class="card card-danger">
            <h4>Codice Vulnerabile</h4>
            <pre><code>// L'input utente viene inserito
// direttamente nella query SQL
const query = "SELECT * FROM users " +
  "WHERE username = '" + input + "'" +
  " AND password = '" + pass + "'";</code></pre>
            <p>Se l'utente inserisce <code>admin' --</code> come username:</p>
            <pre><code>SELECT * FROM users
WHERE username = 'admin' --'
AND password = '...'</code></pre>
            <p class="text-red">Il <code>--</code> commenta il resto della query, bypassando il controllo password!</p>
          </div>
          <div class="card card-success">
            <h4>Codice Sicuro</h4>
            <pre><code>// I parametri sono separati dalla query
// Il database li tratta come DATI,
// non come CODICE
const query = "SELECT * FROM users " +
  "WHERE username = ? AND password = ?";
db.prepare(query).get(input, pass);</code></pre>
            <p class="text-green">I prepared statements garantiscono che l'input venga trattato come valore letterale, mai come codice SQL.</p>
          </div>
        </div>

        <h3 class="mt-3">Tipi di SQL Injection</h3>
        <table class="comparison-table">
          <thead><tr><th>Tipo</th><th>Descrizione</th><th>Esempio</th></tr></thead>
          <tbody>
            <tr><td><strong>Classic (In-Band)</strong></td><td>I risultati dell'injection sono visibili direttamente nella risposta</td><td><code>' OR 1=1 --</code></td></tr>
            <tr><td><strong>UNION-based</strong></td><td>Usa UNION per combinare risultati da altre tabelle</td><td><code>' UNION SELECT null,username,password,role,null,null FROM users --</code></td></tr>
            <tr><td><strong>Blind (Boolean)</strong></td><td>Non vedi i dati ma inferisci dalla risposta true/false</td><td><code>1 AND 1=1</code> vs <code>1 AND 1=2</code></td></tr>
            <tr><td><strong>Time-based</strong></td><td>Inferisci dal tempo di risposta del server</td><td><code>1 AND SLEEP(5)</code></td></tr>
            <tr><td><strong>Second-order</strong></td><td>Il payload viene salvato e attivato in un secondo momento</td><td>Registrazione con nome malevolo</td></tr>
          </tbody>
        </table>

        <div class="key-points">
          <h4>Punti Chiave</h4>
          <ul>
            <li>L'SQL Injection esiste perche' il confine tra dati e codice non e' chiaro</li>
            <li>La difesa principale sono i Prepared Statements (query parametrizzate)</li>
            <li>Un'SQLi puo' portare a: lettura dati, modifica/cancellazione, esecuzione comandi</li>
          </ul>
        </div>

        <div class="card card-accent mt-2">
          <h4>Il concetto generale di Code Injection</h4>
          <p>L'SQL Injection e' un caso specifico di un problema piu' ampio chiamato <strong>code injection</strong>: si verifica quando l'input dell'utente viene interpretato come codice eseguibile anziche' come dato. Lo stesso principio si applica a:</p>
          <ul>
            <li><strong>OS Command Injection</strong>: input inserito in comandi di sistema (es. <code>; rm -rf /</code>)</li>
            <li><strong>LDAP Injection</strong>: input inserito in query LDAP per directory service</li>
            <li><strong>XPath Injection</strong>: input inserito in query XPath per documenti XML</li>
            <li><strong>Template Injection (SSTI)</strong>: input inserito in template engine lato server</li>
          </ul>
          <p>In tutti i casi, la causa radice e' la stessa: <strong>mancata separazione tra dati e codice</strong>. La soluzione universale e' usare API parametrizzate che mantengono questa separazione.</p>
        </div>
      </div>`
  },

  // ====================== SLIDE 9: DEMO SQLi LOGIN ======================
  {
    id: 'sqli-demo-login',
    type: 'demo',
    demoInit: 'sqli-login',
    html: `
      <div class="slide-demo">
        <h2>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--red)" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          Demo: SQL Injection - Authentication Bypass
          <span class="badge badge-danger">INTERATTIVA</span>
        </h2>
        <div class="demo-step-indicator">
          <div class="demo-step">1. Input</div><span class="demo-step-arrow">-></span>
          <div class="demo-step">2. Query SQL</div><span class="demo-step-arrow">-></span>
          <div class="demo-step">3. Database</div><span class="demo-step-arrow">-></span>
          <div class="demo-step">4. Risposta</div><span class="demo-step-arrow">-></span>
          <div class="demo-step">5. Risultato</div>
        </div>
        <div id="demo-sqli-login"></div>
      </div>`
  },

  // ====================== SLIDE 10: DEMO SQLi UNION ======================
  {
    id: 'sqli-demo-union',
    type: 'demo',
    demoInit: 'sqli-search',
    html: `
      <div class="slide-demo">
        <h2>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--red)" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          Demo: UNION-based Data Extraction
          <span class="badge badge-danger">INTERATTIVA</span>
        </h2>
        <div id="demo-sqli-search"></div>
      </div>`
  },

  // ====================== SLIDE 11: DEMO SQLi BLIND ======================
  {
    id: 'sqli-demo-blind',
    type: 'demo',
    demoInit: 'sqli-blind',
    html: `
      <div class="slide-demo">
        <h2>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--red)" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          Demo: Blind SQL Injection
          <span class="badge badge-danger">INTERATTIVA</span>
        </h2>
        <div id="demo-sqli-blind"></div>
      </div>`
  },

  // ====================== SLIDE 12: XSS INTRO ======================
  {
    id: 'xss-intro',
    type: 'section-intro',
    html: `
      <div class="slide-section-intro">
        <div class="section-number">Parte 3</div>
        <h2>Cross-Site Scripting (XSS)</h2>
        <p class="section-desc">Quando il browser della vittima esegue codice JavaScript iniettato dall'attaccante</p>
      </div>`
  },

  // ====================== SLIDE 13: XSS TEORIA ======================
  {
    id: 'xss-theory',
    type: 'content',
    html: `
      <div class="slide-content">
        <h2>XSS - Cross-Site Scripting</h2>

        <p>Il <strong>Cross-Site Scripting (XSS)</strong> e' una vulnerabilita' che permette a un attaccante di iniettare codice JavaScript malevolo in pagine web visualizzate da altri utenti. Il codice viene eseguito nel browser della vittima con gli stessi permessi del sito legittimo.</p>

        <h3>Tre Tipi di XSS</h3>
        <div class="grid-3">
          <div class="card card-danger">
            <h4>Reflected XSS</h4>
            <p>Il payload malevolo e' nella URL o nella richiesta e viene "riflesso" nella risposta del server.</p>
            <pre><code>search?q=&lt;script&gt;
alert('XSS')
&lt;/script&gt;</code></pre>
            <p class="text-muted">Il server include il parametro nella pagina senza sanitizzarlo.</p>
          </div>
          <div class="card card-danger">
            <h4>Stored XSS</h4>
            <p>Il payload viene salvato nel database (es. commento) e eseguito ogni volta che la pagina viene caricata.</p>
            <pre><code>// Commento salvato:
&lt;script&gt;
document.cookie
&lt;/script&gt;</code></pre>
            <p class="text-muted">Piu' pericoloso: colpisce tutti gli utenti che visitano la pagina.</p>
          </div>
          <div class="card card-accent">
            <h4>DOM-based XSS</h4>
            <p>Il payload viene elaborato interamente dal JavaScript lato client, senza passare dal server.</p>
            <pre><code>// JS vulnerabile:
el.innerHTML =
  location.hash</code></pre>
            <p class="text-muted">Il server non vede mai il payload: tutto avviene nel browser.</p>
          </div>
        </div>

        <h3 class="mt-3">Impatto di un XSS</h3>
        <ul>
          <li><strong>Furto di cookie/sessione</strong>: l'attaccante ruba il session token e impersona la vittima</li>
          <li><strong>Keylogging</strong>: registra tutto cio' che l'utente digita nella pagina</li>
          <li><strong>Phishing</strong>: modifica la pagina per mostrare un form di login falso</li>
          <li><strong>Distribuzione malware</strong>: reindirizza a siti malevoli o scarica file</li>
          <li><strong>Defacement</strong>: modifica il contenuto visibile della pagina</li>
        </ul>

        <div class="key-points">
          <h4>Punti Chiave</h4>
          <ul>
            <li>XSS viola la Same-Origin Policy del browser: il codice iniettato ha accesso completo al DOM del sito</li>
            <li>Difese: HTML entity encoding dell'output, Content Security Policy (CSP), uso di textContent invece di innerHTML</li>
            <li>Lo Stored XSS e' il piu' pericoloso perche' colpisce tutti gli utenti passivamente</li>
          </ul>
        </div>

        <div class="card card-accent mt-2">
          <h4>Same-Origin Policy e perche' l'XSS la aggira</h4>
          <p>La <strong>Same-Origin Policy (SOP)</strong> e' un meccanismo di sicurezza fondamentale del browser: impedisce a JavaScript caricato da un dominio (es. attacker.evil) di accedere ai dati di un altro dominio (es. bancasicura.it). Due pagine hanno la stessa "origin" solo se condividono protocollo, dominio e porta.</p>
          <p>L'XSS aggira la SOP perche' il codice malevolo viene iniettato <strong>dentro la pagina del sito legittimo</strong>. Dal punto di vista del browser, lo script sta eseguendo con l'origin di bancasicura.it e ha quindi pieno accesso a cookie, sessione, DOM e dati di quel dominio. Ecco perche' l'XSS e' cosi' pericoloso: trasforma il sito fidato in un vettore di attacco.</p>
        </div>
      </div>`
  },

  // ====================== SLIDE 14: DEMO XSS REFLECTED ======================
  {
    id: 'xss-demo-reflected',
    type: 'demo',
    demoInit: 'xss-reflected',
    html: `
      <div class="slide-demo">
        <h2>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--amber)" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          Demo: Reflected XSS
          <span class="badge badge-amber">INTERATTIVA</span>
        </h2>
        <div id="demo-xss-reflected"></div>
      </div>`
  },

  // ====================== SLIDE 15: DEMO XSS STORED ======================
  {
    id: 'xss-demo-stored',
    type: 'demo',
    demoInit: 'xss-stored',
    html: `
      <div class="slide-demo">
        <h2>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--amber)" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          Demo: Stored XSS
          <span class="badge badge-amber">INTERATTIVA</span>
        </h2>
        <div id="demo-xss-stored"></div>
      </div>`
  },

  // ====================== SLIDE 16: CSRF INTRO ======================
  {
    id: 'csrf-intro',
    type: 'section-intro',
    html: `
      <div class="slide-section-intro">
        <div class="section-number">Parte 4</div>
        <h2>CSRF - Cross-Site Request Forgery</h2>
        <p class="section-desc">Quando un sito malevolo forza il browser della vittima a compiere azioni non volute su un sito dove e' autenticata</p>
      </div>`
  },

  // ====================== SLIDE 17: CSRF TEORIA ======================
  {
    id: 'csrf-theory',
    type: 'content',
    html: `
      <div class="slide-content">
        <h2>CSRF - Come Funziona</h2>

        <p>Il <strong>Cross-Site Request Forgery</strong> sfrutta il fatto che il browser invia automaticamente i cookie (incluso il session cookie) con ogni richiesta verso un dominio. Se la vittima e' loggata su un sito, un attaccante puo' far eseguire azioni a suo nome.</p>

        <h3>Schema dell'Attacco</h3>
        <div class="step-flow">
          <div class="step success">1. Vittima loggata su BancaSicura.it</div>
          <div class="arrow">-></div>
          <div class="step danger">2. Visita sito-malevolo.com</div>
          <div class="arrow">-></div>
          <div class="step danger">3. Form nascosto si auto-invia a BancaSicura.it</div>
          <div class="arrow">-></div>
          <div class="step danger">4. Browser allega cookie di sessione</div>
          <div class="arrow">-></div>
          <div class="step danger">5. Trasferimento eseguito!</div>
        </div>

        <div class="grid-2 mt-3">
          <div class="card card-danger">
            <h4>Perche' Funziona</h4>
            <ul>
              <li>Il browser invia i cookie <strong>automaticamente</strong></li>
              <li>Il server non puo' distinguere una richiesta legittima da una forgiata</li>
              <li>La vittima non deve cliccare nulla: il form si auto-invia con JavaScript</li>
              <li>Funziona anche con richieste POST</li>
            </ul>
          </div>
          <div class="card card-success">
            <h4>Come Difendersi</h4>
            <ul>
              <li><strong>Token CSRF</strong>: un token unico e imprevedibile incluso in ogni form, verificato dal server</li>
              <li><strong>SameSite cookie</strong>: attributo che impedisce l'invio del cookie da siti terzi</li>
              <li><strong>Verifica header Origin/Referer</strong>: controlla da dove arriva la richiesta</li>
              <li><strong>Re-autenticazione</strong> per operazioni sensibili</li>
            </ul>
          </div>
        </div>

        <div class="card card-accent mt-2">
          <h4>CSRF vs XSS: la differenza</h4>
          <p><strong>XSS</strong> sfrutta la fiducia che l'utente ha nel sito (inietta codice nel sito). <strong>CSRF</strong> sfrutta la fiducia che il sito ha nell'utente (forgia richieste a nome dell'utente).</p>
        </div>

        <div class="card card-accent mt-2">
          <h4>Perche' il CSRF e' possibile: HTTP e' stateless</h4>
          <p>Il protocollo <strong>HTTP e' stateless</strong>: ogni richiesta e' indipendente dalle precedenti. Per mantenere una sessione utente (sapere che sei loggato), il server emette un <strong>cookie di sessione</strong> che il browser conserva e allega automaticamente a ogni richiesta verso quel dominio. Questo meccanismo e' comodo ma crea il problema del CSRF: qualsiasi sito web puo' far partire una richiesta verso bancasicura.it e il browser alleghera' automaticamente il cookie di sessione della vittima, autenticando di fatto la richiesta malevola.</p>
          <p>Il token CSRF risolve il problema perche' e' un valore segreto che solo la pagina legittima conosce e che il sito malevolo non puo' leggere (grazie alla Same-Origin Policy).</p>
        </div>
      </div>`
  },

  // ====================== SLIDE 18: DEMO CSRF ======================
  {
    id: 'csrf-demo',
    type: 'demo',
    demoInit: 'csrf',
    html: `
      <div class="slide-demo">
        <h2>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--primary-light)" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          Demo: CSRF - Trasferimento Bancario Non Autorizzato
          <span class="badge badge-primary">INTERATTIVA</span>
        </h2>
        <div id="demo-csrf"></div>
      </div>`
  },

  // ====================== SLIDE 19: BRUTE FORCE INTRO ======================
  {
    id: 'bf-intro',
    type: 'section-intro',
    html: `
      <div class="slide-section-intro">
        <div class="section-number">Parte 5</div>
        <h2>Brute Force Attack</h2>
        <p class="section-desc">Quando l'attaccante prova sistematicamente tutte le combinazioni possibili fino a trovare quella giusta</p>
      </div>`
  },

  // ====================== SLIDE 20: BRUTE FORCE TEORIA ======================
  {
    id: 'bf-theory',
    type: 'content',
    html: `
      <div class="slide-content">
        <h2>Brute Force - Teoria</h2>

        <p>Un <strong>attacco brute force</strong> consiste nel provare sistematicamente tutte le combinazioni possibili di credenziali fino a trovare quella corretta. Una variante piu' efficiente e' il <strong>dictionary attack</strong> che usa liste di password comuni.</p>

        <h3>Tempo di Cracking per Complessita' Password</h3>
        <table class="comparison-table">
          <thead><tr><th>Password</th><th>Lunghezza</th><th>Complessita'</th><th>Tempo Stimato</th></tr></thead>
          <tbody>
            <tr><td><code>123456</code></td><td>6 char</td><td>Solo numeri</td><td style="color:var(--red);font-weight:700;">Istantaneo</td></tr>
            <tr><td><code>password</code></td><td>8 char</td><td>Solo lettere</td><td style="color:var(--red);font-weight:700;">Istantaneo (in dizionario)</td></tr>
            <tr><td><code>P@ssw0rd</code></td><td>8 char</td><td>Misto</td><td style="color:var(--amber);font-weight:700;">~2 ore</td></tr>
            <tr><td><code>Tr0ub4dor&3</code></td><td>11 char</td><td>Misto + simboli</td><td style="color:var(--green);">~3 anni</td></tr>
            <tr><td><code>correct-horse-battery</code></td><td>22 char</td><td>Passphrase</td><td style="color:var(--green);font-weight:700;">~milioni di anni</td></tr>
          </tbody>
        </table>

        <div class="grid-2 mt-2">
          <div class="card card-danger">
            <h4>Tecniche di Attacco</h4>
            <ul>
              <li><strong>Brute force puro</strong>: tutte le combinazioni (lento ma completo)</li>
              <li><strong>Dictionary attack</strong>: lista di password comuni (veloce ma limitato)</li>
              <li><strong>Credential stuffing</strong>: credenziali rubate da altri siti</li>
              <li><strong>Rainbow tables</strong>: tabelle pre-calcolate di hash</li>
            </ul>
          </div>
          <div class="card card-success">
            <h4>Difese</h4>
            <ul>
              <li><strong>Rate limiting</strong>: limita il numero di tentativi per unita' di tempo</li>
              <li><strong>Account lockout</strong>: blocca l'account dopo N tentativi falliti</li>
              <li><strong>CAPTCHA</strong>: verifica che il richiedente sia umano</li>
              <li><strong>2FA</strong>: anche con la password corretta, serve un secondo fattore</li>
              <li><strong>Password hashing</strong>: bcrypt/argon2 con salt rendono il cracking lento</li>
            </ul>
          </div>
        </div>

        <div class="card card-accent mt-2">
          <h4>Entropia e sicurezza delle password</h4>
          <p>L'<strong>entropia</strong> misura l'imprevedibilita' di una password in bit. Formula: E = log2(C^L) dove C e' il numero di caratteri possibili e L la lunghezza. Una password di 8 caratteri con lettere e numeri ha circa 48 bit di entropia; una passphrase di 4 parole casuali ne ha circa 50+ bit.</p>
          <p>Le <strong>passphrase</strong> (frasi composte da parole casuali, es. "cavallo-batteria-corretto-graffetta") sono spesso piu' sicure di password corte e complesse perche' hanno entropia maggiore pur essendo piu' facili da ricordare. Il <strong>password hashing</strong> con algoritmi come bcrypt o argon2 aggiunge un ulteriore livello di protezione: anche se il database viene rubato, l'attaccante deve fare brute force sull'hash, e ogni tentativo richiede tempo computazionale significativo grazie al fattore di costo (work factor).</p>
        </div>
      </div>`
  },

  // ====================== SLIDE 21: DEMO BRUTE FORCE ======================
  {
    id: 'bf-demo',
    type: 'demo',
    demoInit: 'bruteforce',
    html: `
      <div class="slide-demo">
        <h2>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--teal)" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          Demo: Brute Force Attack
          <span class="badge badge-teal">INTERATTIVA</span>
        </h2>
        <div id="demo-bruteforce"></div>
      </div>`
  },

  // ====================== SLIDE 22: KILL CHAIN INTRO ======================
  {
    id: 'exfil-intro',
    type: 'section-intro',
    html: `
      <div class="slide-section-intro">
        <div class="section-number">Gran Finale</div>
        <h2>Multi-Stage Attack Chain</h2>
        <p class="section-desc">Simulazione completa di un attacco reale: dalla ricognizione all'exfiltrazione dei dati</p>
      </div>`
  },

  // ====================== SLIDE 23: KILL CHAIN TEORIA ======================
  {
    id: 'exfil-theory',
    type: 'content',
    html: `
      <div class="slide-content">
        <h2>Cyber Kill Chain</h2>

        <p>La <strong>Cyber Kill Chain</strong> (Lockheed Martin) descrive le fasi di un attacco informatico. Un attacco reale non usa una singola vulnerabilita', ma concatena piu' tecniche in una sequenza orchestrata.</p>

        <div class="step-flow">
          <div class="step">Reconnaissance</div>
          <div class="arrow">-></div>
          <div class="step">Weaponization</div>
          <div class="arrow">-></div>
          <div class="step">Delivery</div>
          <div class="arrow">-></div>
          <div class="step danger">Exploitation</div>
          <div class="arrow">-></div>
          <div class="step danger">Installation</div>
          <div class="arrow">-></div>
          <div class="step danger">C2</div>
          <div class="arrow">-></div>
          <div class="step danger">Actions</div>
        </div>

        <div class="card card-danger mt-3">
          <h4>Cosa simuleremo ora</h4>
          <p>Un attacco completo in 5 fasi che concatena le vulnerabilita' viste in precedenza:</p>
          <ol>
            <li><strong>Ricognizione</strong> - Scansione porte e scoperta endpoint (nmap, dirb)</li>
            <li><strong>SQL Injection</strong> - Estrazione delle credenziali admin dal database</li>
            <li><strong>Accesso privilegiato</strong> - Login al pannello admin con le credenziali rubate</li>
            <li><strong>Database dump</strong> - Scaricamento dei dati sensibili (carte di credito, API key)</li>
            <li><strong>Exfiltrazione</strong> - Invio dei dati rubati al server dell'attaccante</li>
          </ol>
        </div>

        <div class="card card-success">
          <h4>Nota Importante</h4>
          <p>Tutto cio' che vedrete e' simulato in un ambiente locale sicuro. Nessun dato reale viene usato, nessuna connessione esterna viene stabilita. L'obiettivo e' <strong>educativo</strong>: capire come funziona un attacco per imparare a difendersi.</p>
        </div>

        <div class="card card-accent mt-2">
          <h4>Defense in Depth (Difesa a Strati)</h4>
          <p>La <strong>Defense in Depth</strong> e' una strategia di sicurezza che implementa molteplici livelli di protezione sovrapposti. L'idea e' che se un livello viene violato, gli altri continuano a proteggere il sistema. Nella simulazione che vedremo, ad esempio: i prepared statements avrebbero bloccato il primo passo (SQL Injection); anche se l'attaccante avesse ottenuto le credenziali, il 2FA avrebbe bloccato il login; anche se fosse entrato nell'admin, la crittografia dei dati a riposo avrebbe reso i dati illeggibili; e infine un IDS avrebbe rilevato il traffico anomalo in uscita. Non esiste una singola soluzione magica, ma la combinazione di difese rende un attacco progressivamente piu' difficile e costoso.</p>
        </div>
      </div>`
  },

  // ====================== SLIDE 24: DEMO EXFILTRATION ======================
  {
    id: 'exfil-demo',
    type: 'demo',
    demoInit: 'exfiltration',
    html: `
      <div class="slide-fullscreen">
        <h2 style="margin-bottom:12px;display:flex;align-items:center;gap:12px;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--red)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Simulazione: Multi-Stage Attack Chain
          <span class="badge badge-danger">LIVE</span>
        </h2>
        <div id="demo-exfiltration"></div>
      </div>`
  },

  // ====================== SLIDE 25: RIEPILOGO DIFESE ======================
  {
    id: 'defenses-recap',
    type: 'content',
    html: `
      <div class="slide-content">
        <h2>Riepilogo: Attacchi e Difese</h2>

        <table class="comparison-table">
          <thead><tr><th>Attacco</th><th>Vulnerabilita' Sfruttata</th><th>Difesa Principale</th><th>Difese Aggiuntive</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>SQL Injection</strong></td>
              <td>Concatenazione input nelle query SQL</td>
              <td>Prepared Statements</td>
              <td>Input validation, ORM, WAF</td>
            </tr>
            <tr>
              <td><strong>XSS (Reflected)</strong></td>
              <td>Output non sanitizzato nella risposta</td>
              <td>HTML Entity Encoding</td>
              <td>CSP, HttpOnly cookies</td>
            </tr>
            <tr>
              <td><strong>XSS (Stored)</strong></td>
              <td>Dati malevoli salvati nel DB</td>
              <td>Sanitizzazione input + output</td>
              <td>CSP, textContent vs innerHTML</td>
            </tr>
            <tr>
              <td><strong>CSRF</strong></td>
              <td>Cookie inviati automaticamente</td>
              <td>Token CSRF</td>
              <td>SameSite cookies, verifica Origin</td>
            </tr>
            <tr>
              <td><strong>Brute Force</strong></td>
              <td>Nessun limite ai tentativi</td>
              <td>Rate Limiting + Lockout</td>
              <td>2FA, CAPTCHA, password hashing</td>
            </tr>
            <tr>
              <td><strong>Data Exfiltration</strong></td>
              <td>Mancanza di monitoraggio</td>
              <td>IDS/IPS + Network Monitoring</td>
              <td>DLP, encryption at rest, least privilege</td>
            </tr>
          </tbody>
        </table>

        <h3 class="mt-3">Best Practices Generali</h3>
        <div class="grid-2">
          <div class="card card-success">
            <h4>Sviluppo Sicuro</h4>
            <ul>
              <li>Validare e sanitizzare OGNI input</li>
              <li>Usare SEMPRE prepared statements</li>
              <li>Applicare il principio del minimo privilegio</li>
              <li>Aggiornare dipendenze e framework</li>
              <li>Code review e penetration testing</li>
            </ul>
          </div>
          <div class="card card-accent">
            <h4>Defense in Depth</h4>
            <ul>
              <li>Mai affidarsi a un singolo livello di difesa</li>
              <li>Crittografia dei dati a riposo e in transito</li>
              <li>Logging e monitoraggio continuo</li>
              <li>Incident response plan</li>
              <li>Formazione e awareness del personale</li>
            </ul>
          </div>
        </div>

        <div class="card card-warning mt-2">
          <h4>Considerazioni Finali sulla Sicurezza</h4>
          <p>La sicurezza informatica non e' un prodotto che si compra e si installa, ma un <strong>processo continuo</strong> che richiede aggiornamento costante, monitoraggio attivo e formazione del personale. Le vulnerabilita' evolvono, nuovi vettori di attacco vengono scoperti, e le contromisure devono adattarsi di conseguenza. La Defense in Depth, applicata sistematicamente, e' la strategia piu' efficace per ridurre il rischio complessivo.</p>
          <p>Il principio guida e': <strong>assume breach</strong> (dai per scontato che l'attaccante entrera') e progetta il sistema in modo che anche una violazione parziale non porti a una compromissione totale.</p>
        </div>
      </div>`
  },

  // ====================== SLIDE 26: CONCLUSIONE ======================
  {
    id: 'conclusion',
    type: 'title',
    html: `
      <div class="slide-title">
        <h2>Conclusioni</h2>
        <p class="subtitle">La sicurezza informatica non e' solo una questione tecnica, ma una responsabilita' condivisa. Ogni sviluppatore, ogni utente, ogni organizzazione ha un ruolo nella protezione del mondo digitale.</p>

        <div class="card card-accent mt-3" style="max-width:700px;text-align:left;">
          <h4>Risorse per Approfondire</h4>
          <ul>
            <li><strong>OWASP.org</strong> - Documentazione completa sulle vulnerabilita' web</li>
            <li><strong>PortSwigger Web Security Academy</strong> - Laboratori pratici gratuiti</li>
            <li><strong>HackTheBox / TryHackMe</strong> - Piattaforme di pratica per ethical hacking</li>
            <li><strong>CyberChef</strong> - Tool online per analisi e decodifica</li>
          </ul>
        </div>

        <div class="mt-3">
          <span class="badge badge-primary">TPSIT</span>
          <span class="badge badge-teal">A.S. 2025/2026</span>
        </div>
      </div>`
  }
];

window.SLIDES = SLIDES;
