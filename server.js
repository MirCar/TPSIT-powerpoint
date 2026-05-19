const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const { initDatabase } = require('./db/setup');

const app = express();
const PORT = process.env.PORT || 3000;

const db = new Database(':memory:');
db.pragma('journal_mode = WAL');
initDatabase(db);

app.locals.db = db;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/reset-db', (req, res) => {
  initDatabase(db);
  res.json({ success: true, message: 'Database ripristinato allo stato iniziale' });
});

app.use('/api/sqli', require('./routes/demo-sqli'));
app.use('/api/xss', require('./routes/demo-xss'));
app.use('/api/csrf', require('./routes/demo-csrf'));
app.use('/api/bruteforce', require('./routes/demo-bruteforce'));
app.use('/api/exfil', require('./routes/demo-exfiltration'));

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
  console.log('Premi Ctrl+C per fermare il server');
});
