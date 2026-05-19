const express = require('express');
const router = express.Router();

let sessionToken = null;

router.post('/step1-sqli', (req, res) => {
  const db = req.app.locals.db;
  const payload = req.body.payload || "' OR 1=1 --";
  const query = `SELECT * FROM users WHERE username = '${payload}'`;

  try {
    const users = db.prepare('SELECT id, username, password, role, email FROM users').all();
    res.json({
      step: 1,
      stepName: 'SQL Injection - Estrazione Credenziali',
      success: true,
      queryInjected: query,
      data: users,
      adminFound: users.find(u => u.role === 'admin'),
      narration: 'L\'attaccante ha sfruttato una SQL Injection nella barra di ricerca per estrarre l\'intera tabella utenti, incluse le password in chiaro.'
    });
  } catch (err) {
    res.json({ step: 1, success: false, error: err.message });
  }
});

router.post('/step2-admin', (req, res) => {
  const db = req.app.locals.db;
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ? AND role = ?').get(username, password, 'admin');

  if (user) {
    sessionToken = 'eyJhZG1pbiI6dHJ1ZSwidXNlciI6ImFkbWluIn0=';
    res.json({
      step: 2,
      stepName: 'Accesso Privilegiato - Admin Panel',
      success: true,
      token: sessionToken,
      user: { id: user.id, username: user.username, role: user.role },
      narration: 'Con le credenziali rubate, l\'attaccante ha ottenuto accesso al pannello di amministrazione e un token di sessione.'
    });
  } else {
    res.json({ step: 2, success: false, error: 'Credenziali non valide' });
  }
});

router.get('/step3-dump', (req, res) => {
  const db = req.app.locals.db;
  const token = req.headers.authorization;

  if (!token || !token.includes(sessionToken)) {
    return res.status(401).json({ step: 3, success: false, error: 'Non autorizzato' });
  }

  const secrets = db.prepare('SELECT * FROM secrets').all();
  const users = db.prepare('SELECT id, username, email, role FROM users').all();

  res.json({
    step: 3,
    stepName: 'Database Dump - Dati Sensibili',
    success: true,
    secrets,
    users,
    tableCount: 7,
    recordCount: secrets.length + users.length,
    narration: 'Dall\'admin panel, l\'attaccante ha scaricato i dati sensibili: carte di credito, chiavi API e informazioni personali degli utenti.'
  });
});

router.post('/step4-exfil', (req, res) => {
  const { data } = req.body;

  res.json({
    step: 4,
    stepName: 'Exfiltrazione - Invio al Server C2',
    success: true,
    exfiltratedTo: 'attacker.evil:8443/receive',
    recordsStolen: data ? data.length : 0,
    dataSize: JSON.stringify(data || {}).length + ' bytes',
    narration: 'I dati rubati sono stati inviati al server Command & Control dell\'attaccante. L\'azienda non si e\' accorta di nulla perche\' non aveva sistemi di monitoraggio del traffico in uscita.',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
