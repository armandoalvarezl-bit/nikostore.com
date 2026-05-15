const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(__dirname, '..', 'db.config.json');

async function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`No se encontrÃ³ ${CONFIG_PATH}`);
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

async function run() {
  const config = await loadConfig();
  const connection = await mysql.createConnection({
    host: config.host,
    port: Number(config.port),
    user: config.user,
    password: config.password,
    database: config.database
  });

  const username = 'admin';
  const password = 'admin123';
  const name = 'Administrador';
  const role = 'admin';
  const active = 'SI';

  const [existing] = await connection.execute(
    'SELECT id FROM usuarios WHERE username = ? LIMIT 1',
    [username]
  );

  if (existing.length > 0) {
    await connection.execute(
      'UPDATE usuarios SET password_hash = ?, rol = ?, activo = ? WHERE username = ?',
      [password, role, active, username]
    );
    console.log(`Usuario '${username}' actualizado. Contrasena establecida en '${password}'.`);
  } else {
    await connection.execute(
      `INSERT INTO usuarios (empresa_id, nombre, username, password_hash, rol, activo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [null, name, username, password, role, active]
    );
    console.log(`Usuario '${username}' creado con contrasena '${password}'.`);
  }

  await connection.end();
}

run().catch((error) => {
  console.error('Error al crear usuario:', error.message);
  process.exit(1);
});

