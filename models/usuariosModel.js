const pool = require('../config/database');

exports.listar = async () => {
  const { rows } = await pool.query('SELECT * FROM usuarios');
  return rows;
};

exports.criar = async (dados) => {
  const { nome, email } = dados;
  const { rows } = await pool.query(
    'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *',
    [nome, email]
  );
  return rows[0];
};

exports.detalhar = async (id) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return rows[0];
};

exports.atualizar = async (id, dados) => {
  const { nome, email } = dados;
  const { rows } = await pool.query(
    'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING *',
    [nome, email, id]
  );
  return rows[0];
};

exports.deletar = async (id) => {
  await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  return true;
};
