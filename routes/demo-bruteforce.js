const express = require('express');
const router = express.Router();

const rateLimiter = {
  attempts: new Map(),
  lockedUntil: new Map()
};

router.post('/login', (req, res) => {
  const db = req.app.locals.db;
  const { username, password } = req.body;
  const mode = req.query.mode || req.body.mode || 'vulnerable';

  if (mode === 'vulnerable') {
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
    db.prepare('INSERT INTO login_attempts (username, ip_address, success) VALUES (?, ?, ?)').run(username, '127.0.0.1', user ? 1 : 0);

    res.json({
      success: !!user,
      user: user ? { id: user.id, username: user.username, role: user.role } : null,
      mode: 'vulnerable',
      explanation: 'Nessun limite ai tentativi di login. Un attaccante puo\' provare migliaia di password al secondo senza alcuna restrizione.'
    });
  } else {
    const key = `${username}:127.0.0.1`;
    const now = Date.now();
    const lockedUntil = rateLimiter.lockedUntil.get(key) || 0;

    if (now < lockedUntil) {
      const remainingSeconds = Math.ceil((lockedUntil - now) / 1000);
      return res.status(429).json({
        success: false,
        locked: true,
        remainingSeconds,
        mode: 'protected',
        explanation: `Account bloccato per ${remainingSeconds} secondi dopo troppi tentativi falliti. Questo rende un attacco brute force impraticabile.`
      });
    }

    const attempts = rateLimiter.attempts.get(key) || 0;
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
    db.prepare('INSERT INTO login_attempts (username, ip_address, success) VALUES (?, ?, ?)').run(username, '127.0.0.1', user ? 1 : 0);

    if (!user) {
      const newAttempts = attempts + 1;
      rateLimiter.attempts.set(key, newAttempts);

      if (newAttempts >= 5) {
        rateLimiter.lockedUntil.set(key, now + 30000);
        rateLimiter.attempts.set(key, 0);
        return res.status(429).json({
          success: false,
          locked: true,
          remainingSeconds: 30,
          attemptNumber: newAttempts,
          mode: 'protected',
          explanation: 'Account bloccato per 30 secondi dopo 5 tentativi falliti. Rate limiting + account lockout rendono il brute force inefficace.'
        });
      }

      return res.json({
        success: false,
        attemptsRemaining: 5 - newAttempts,
        attemptNumber: newAttempts,
        mode: 'protected',
        explanation: `Tentativo ${newAttempts}/5 fallito. Dopo 5 tentativi l'account verra\' bloccato temporaneamente.`
      });
    }

    rateLimiter.attempts.delete(key);
    res.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role },
      mode: 'protected',
      explanation: 'Login riuscito con credenziali corrette. Il rate limiting non blocca gli accessi legittimi.'
    });
  }
});

router.get('/attempts', (req, res) => {
  const db = req.app.locals.db;
  const attempts = db.prepare('SELECT * FROM login_attempts ORDER BY attempted_at DESC LIMIT 50').all();
  res.json({ attempts });
});

router.post('/reset-limiter', (req, res) => {
  rateLimiter.attempts.clear();
  rateLimiter.lockedUntil.clear();
  res.json({ success: true });
});

module.exports = router;
