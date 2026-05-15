const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runSql() {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.config.json'), 'utf8'));
  delete config.supportApiUrl;
  delete config.supportApiKey;
  const pool = mysql.createPool(config);
  const sql = fs.readFileSync(path.join(__dirname, 'root.session.sql'), 'utf8');
  const statements = sql.split(';').map(s => s.trim()).filter(s => s);
  for (const statement of statements) {
    if (statement) {
      await pool.execute(statement);
    }
  }
  // Update passwords
  await pool.execute("UPDATE usuarios SET password_hash = 'cambia_esta_clave' WHERE username IN ('admin', 'operador')");
  await pool.end();
  console.log('Database structure synced without deleting data');
}

runSql().catch(console.error);
