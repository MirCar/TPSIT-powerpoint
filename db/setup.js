function initDatabase(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      email TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      stock INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner TEXT NOT NULL,
      balance REAL DEFAULT 1000.00
    );

    CREATE TABLE IF NOT EXISTS transfers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_account INTEGER REFERENCES accounts(id),
      to_account INTEGER REFERENCES accounts(id),
      amount REAL NOT NULL,
      timestamp TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      ip_address TEXT,
      success INTEGER DEFAULT 0,
      attempted_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS secrets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data_type TEXT NOT NULL,
      value TEXT NOT NULL,
      belongs_to TEXT
    );
  `);

  seedData(db);
}

function seedData(db) {
  db.exec(`DELETE FROM users; DELETE FROM products; DELETE FROM comments;
           DELETE FROM accounts; DELETE FROM transfers; DELETE FROM login_attempts;
           DELETE FROM secrets;`);

  const insertUser = db.prepare(
    'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)'
  );
  insertUser.run('admin', 'supersecret123', 'admin', 'admin@azienda.it');
  insertUser.run('mario', 'password1', 'user', 'mario@example.it');
  insertUser.run('giulia', 'giulia2024', 'user', 'giulia@example.it');
  insertUser.run('marco', 'qwerty', 'user', 'marco@example.it');

  const insertProduct = db.prepare(
    'INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?)'
  );
  insertProduct.run('Laptop Pro', 'Laptop ad alte prestazioni con processore i9', 1299.99, 'elettronica', 15);
  insertProduct.run('Mouse Wireless', 'Mouse ergonomico bluetooth', 29.99, 'accessori', 150);
  insertProduct.run('Hub USB', 'Hub USB 3.0 a 7 porte', 19.99, 'accessori', 80);
  insertProduct.run('Monitor 4K', 'Monitor 27 pollici 4K UHD', 499.99, 'elettronica', 25);
  insertProduct.run('Tastiera Meccanica', 'Tastiera meccanica RGB switch blue', 89.99, 'accessori', 60);

  const insertAccount = db.prepare(
    'INSERT INTO accounts (owner, balance) VALUES (?, ?)'
  );
  insertAccount.run('vittima', 5000.00);
  insertAccount.run('attaccante', 100.00);

  const insertSecret = db.prepare(
    'INSERT INTO secrets (data_type, value, belongs_to) VALUES (?, ?, ?)'
  );
  insertSecret.run('credit_card', '4532-XXXX-XXXX-7890', 'admin');
  insertSecret.run('api_key', 'sk-live-FAKE-KEY-1234567890abcdef', 'admin');
  insertSecret.run('password_hash', 'supersecret123 (PLAINTEXT - NON HASHATA!)', 'admin');
}

module.exports = { initDatabase };
