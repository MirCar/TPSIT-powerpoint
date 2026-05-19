const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const db = req.app.locals.db;
  const { username, password } = req.body;
  const mode = req.query.mode || req.body.mode || 'vulnerable';

  if (mode === 'vulnerable') {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    try {
      const users = db.prepare(query).all();
      res.json({
        success: users.length > 0,
        user: users.length > 0 ? { id: users[0].id, username: users[0].username, role: users[0].role, email: users[0].email } : null,
        queryExecuted: query,
        mode: 'vulnerable',
        explanation: 'La query e\' costruita concatenando direttamente l\'input utente nella stringa SQL. Un attaccante puo\' manipolare la logica della query.'
      });
    } catch (err) {
      res.json({ success: false, error: err.message, queryExecuted: query, mode: 'vulnerable' });
    }
  } else {
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    try {
      const user = db.prepare(query).get(username, password);
      res.json({
        success: !!user,
        user: user ? { id: user.id, username: user.username, role: user.role, email: user.email } : null,
        queryExecuted: query,
        parameters: [username, password],
        mode: 'protected',
        explanation: 'La query usa prepared statements con parametri (?). L\'input utente viene trattato come dato, non come codice SQL.'
      });
    } catch (err) {
      res.json({ success: false, error: err.message, queryExecuted: query, mode: 'protected' });
    }
  }
});

router.get('/search', (req, res) => {
  const db = req.app.locals.db;
  const q = req.query.q || '';
  const mode = req.query.mode || 'vulnerable';

  if (mode === 'vulnerable') {
    const query = `SELECT * FROM products WHERE name LIKE '%${q}%' OR description LIKE '%${q}%'`;
    try {
      const results = db.prepare(query).all();
      res.json({
        results,
        queryExecuted: query,
        mode: 'vulnerable',
        explanation: 'L\'input di ricerca viene inserito direttamente nella query. Con UNION SELECT si possono estrarre dati da altre tabelle.'
      });
    } catch (err) {
      res.json({ results: [], error: err.message, queryExecuted: query, mode: 'vulnerable' });
    }
  } else {
    const query = 'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?';
    const param = `%${q}%`;
    try {
      const results = db.prepare(query).all(param, param);
      res.json({
        results,
        queryExecuted: query,
        parameters: [param, param],
        mode: 'protected',
        explanation: 'I parametri sono separati dalla query. UNION SELECT viene trattato come testo di ricerca, non come codice SQL.'
      });
    } catch (err) {
      res.json({ results: [], error: err.message, queryExecuted: query, mode: 'protected' });
    }
  }
});

router.get('/blind', (req, res) => {
  const db = req.app.locals.db;
  const id = req.query.id || '1';
  const mode = req.query.mode || 'vulnerable';

  if (mode === 'vulnerable') {
    const query = `SELECT * FROM users WHERE id = ${id}`;
    try {
      const user = db.prepare(query).get();
      res.json({
        exists: !!user,
        queryExecuted: query,
        mode: 'vulnerable',
        explanation: 'L\'ID viene inserito direttamente nella query. Aggiungendo condizioni booleane (AND 1=1 / AND 1=2) si possono inferire informazioni.'
      });
    } catch (err) {
      res.json({ exists: false, error: err.message, queryExecuted: query, mode: 'vulnerable' });
    }
  } else {
    const query = 'SELECT * FROM users WHERE id = ?';
    const parsedId = parseInt(id, 10);
    try {
      const user = db.prepare(query).get(parsedId || 0);
      res.json({
        exists: !!user,
        queryExecuted: query,
        parameters: [parsedId || 0],
        mode: 'protected',
        explanation: 'L\'ID viene validato come intero e passato come parametro. Le condizioni booleane iniettate non hanno effetto.'
      });
    } catch (err) {
      res.json({ exists: false, error: err.message, queryExecuted: query, mode: 'protected' });
    }
  }
});

module.exports = router;
