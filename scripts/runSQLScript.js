const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const runSQLScript = async () => {
  const migrationsPath = path.join(__dirname, '../scripts');
  const migrationFiles = fs.readdirSync(migrationsPath);

  for (const file of migrationFiles) {
    if (!file.endsWith('.sql')) continue;

    const filePath = path.join(migrationsPath, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      await pool.query(sql);
      console.log(`Script SQL ${file} executado com sucesso!`);
    } catch (err) {
      console.error(`Erro ao executar o script SQL ${file}:`, err.message);
    }
  }

  await pool.end();
  console.log('✅ Todos os scripts SQL foram executados!');
};

runSQLScript().catch(console.error);
