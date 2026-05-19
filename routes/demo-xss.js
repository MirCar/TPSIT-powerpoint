const express = require('express');
const router = express.Router();

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

router.post('/comment', (req, res) => {
  const db = req.app.locals.db;
  const { author, content } = req.body;
  const mode = req.query.mode || req.body.mode || 'vulnerable';

  if (mode === 'vulnerable') {
    db.prepare('INSERT INTO comments (author, content) VALUES (?, ?)').run(author, content);
    res.json({
      success: true,
      mode: 'vulnerable',
      storedContent: content,
      explanation: 'Il commento viene salvato senza alcuna sanitizzazione. Quando verra\' visualizzato, il codice HTML/JS al suo interno verra\' eseguito dal browser.'
    });
  } else {
    const safeAuthor = escapeHtml(author);
    const safeContent = escapeHtml(content);
    db.prepare('INSERT INTO comments (author, content) VALUES (?, ?)').run(safeAuthor, safeContent);
    res.json({
      success: true,
      mode: 'protected',
      storedContent: safeContent,
      originalContent: content,
      explanation: 'Il commento viene sanitizzato con HTML entity encoding prima del salvataggio. I tag HTML vengono convertiti in entita\' innocue (&lt; &gt;).'
    });
  }
});

router.get('/comments', (req, res) => {
  const db = req.app.locals.db;
  const mode = req.query.mode || 'vulnerable';
  const comments = db.prepare('SELECT * FROM comments ORDER BY created_at DESC').all();

  if (mode === 'protected') {
    const safeComments = comments.map(c => ({
      ...c,
      author: escapeHtml(c.author),
      content: escapeHtml(c.content)
    }));
    res.json({
      comments: safeComments,
      mode: 'protected',
      explanation: 'I commenti vengono sanitizzati anche in fase di output (defense in depth). Anche se un dato malevolo fosse salvato nel DB, non verrebbe eseguito.'
    });
  } else {
    res.json({
      comments,
      mode: 'vulnerable',
      explanation: 'I commenti vengono restituiti esattamente come salvati. Se contengono tag <script>, il browser li eseguira\' come codice JavaScript.'
    });
  }
});

router.get('/search', (req, res) => {
  const q = req.query.q || '';
  const mode = req.query.mode || 'vulnerable';

  if (mode === 'vulnerable') {
    res.json({
      query: q,
      resultsHtml: `<p>Risultati per: <strong>${q}</strong></p><p>Nessun risultato trovato.</p>`,
      mode: 'vulnerable',
      explanation: 'Il termine di ricerca viene inserito direttamente nell\'HTML della risposta. Se contiene tag HTML o script, il browser li interpretera\'.'
    });
  } else {
    const safeQ = escapeHtml(q);
    res.json({
      query: safeQ,
      resultsHtml: `<p>Risultati per: <strong>${safeQ}</strong></p><p>Nessun risultato trovato.</p>`,
      mode: 'protected',
      explanation: 'Il termine di ricerca viene sanitizzato con escapeHtml(). I caratteri speciali HTML (<, >, &, ", \') vengono convertiti in entita\' sicure.'
    });
  }
});

module.exports = router;
