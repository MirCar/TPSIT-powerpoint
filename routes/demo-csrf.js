const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const csrfTokens = new Map();

router.get('/balance', (req, res) => {
  const db = req.app.locals.db;
  const accounts = db.prepare('SELECT * FROM accounts').all();
  res.json({ accounts });
});

router.get('/token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = req.query.session || 'default';
  csrfTokens.set(sessionId, token);
  res.json({ token, sessionId });
});

router.post('/transfer', (req, res) => {
  const db = req.app.locals.db;
  const { from, to, amount, _csrf } = req.body;
  const mode = req.query.mode || req.body.mode || 'vulnerable';
  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ success: false, error: 'Importo non valido' });
  }

  if (mode === 'vulnerable') {
    const fromAccount = db.prepare('SELECT * FROM accounts WHERE id = ?').get(from);
    if (!fromAccount || fromAccount.balance < parsedAmount) {
      return res.json({ success: false, error: 'Saldo insufficiente' });
    }
    db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(parsedAmount, from);
    db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(parsedAmount, to);
    db.prepare('INSERT INTO transfers (from_account, to_account, amount) VALUES (?, ?, ?)').run(from, to, parsedAmount);

    const accounts = db.prepare('SELECT * FROM accounts').all();
    res.json({
      success: true,
      accounts,
      mode: 'vulnerable',
      explanation: 'Il trasferimento viene eseguito senza verificare un token CSRF. Qualsiasi sito web puo\' inviare questa richiesta a nome della vittima se ha una sessione attiva.'
    });
  } else {
    const sessionId = req.body.sessionId || 'default';
    const storedToken = csrfTokens.get(sessionId);

    if (!_csrf || _csrf !== storedToken) {
      return res.status(403).json({
        success: false,
        error: 'Token CSRF non valido o mancante',
        mode: 'protected',
        explanation: 'La richiesta e\' stata bloccata perche\' il token CSRF non corrisponde. Un sito malevolo non puo\' conoscere il token, quindi non puo\' forgiare richieste valide.'
      });
    }

    csrfTokens.delete(sessionId);

    const fromAccount = db.prepare('SELECT * FROM accounts WHERE id = ?').get(from);
    if (!fromAccount || fromAccount.balance < parsedAmount) {
      return res.json({ success: false, error: 'Saldo insufficiente' });
    }
    db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(parsedAmount, from);
    db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(parsedAmount, to);
    db.prepare('INSERT INTO transfers (from_account, to_account, amount) VALUES (?, ?, ?)').run(from, to, parsedAmount);

    const accounts = db.prepare('SELECT * FROM accounts').all();
    res.json({
      success: true,
      accounts,
      mode: 'protected',
      explanation: 'Il trasferimento e\' stato eseguito perche\' il token CSRF era valido. Solo il sito legittimo conosce il token e puo\' includerlo nella richiesta.'
    });
  }
});

module.exports = router;
