require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DB_USER) {
  throw new Error('Variáveis de ambiente não configuradas. Copie .env.example para .env');
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
