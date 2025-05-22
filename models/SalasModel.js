const pool = require('../config/database');

exports.listar = async () => {
  const { rows } = await pool.query('SELECT * FROM salas');
  return rows;
};

exports.criar = async (dados) => {
  const { nome, tipo, capacidade } = dados;
  const { rows } = await pool.query(
    'INSERT INTO salas (nome, tipo, capacidade) VALUES ($1, $2, $3) RETURNING *',
    [nome, tipo, capacidade]
  );
  return rows[0];
};

exports.detalhar = async (id) => {
  const { rows } = await pool.query('SELECT * FROM salas WHERE id = $1', [id]);
  return rows[0];
};

exports.atualizar = async (id, dados) => {
  const { nome, tipo, capacidade } = dados;
  const { rows } = await pool.query(
    'UPDATE salas SET nome = $1, tipo = $2, capacidade = $3 WHERE id = $4 RETURNING *',
    [nome, tipo, capacidade, id]
  );
  return rows[0];
};

exports.deletar = async (id) => {
  await pool.query('DELETE FROM salas WHERE id = $1', [id]);
  return true;
};
