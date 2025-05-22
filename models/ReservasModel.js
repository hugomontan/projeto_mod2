const pool = require('../config/database');

exports.listar = async () => {
  const { rows } = await pool.query('SELECT * FROM reservas');
  return rows;
};

exports.criar = async (dados) => {
  const { usuario_id, sala_id, data, horario_inicio, horario_fim } = dados;
  const { rows } = await pool.query(
    'INSERT INTO reservas (usuario_id, sala_id, data, horario_inicio, horario_fim) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [usuario_id, sala_id, data, horario_inicio, horario_fim]
  );
  return rows[0];
};

exports.detalhar = async (id) => {
  const { rows } = await pool.query('SELECT * FROM reservas WHERE id = $1', [id]);
  return rows[0];
};

exports.atualizar = async (id, dados) => {
  const { usuario_id, sala_id, data, horario_inicio, horario_fim } = dados;
  const { rows } = await pool.query(
    'UPDATE reservas SET usuario_id = $1, sala_id = $2, data = $3, horario_inicio = $4, horario_fim = $5 WHERE id = $6 RETURNING *',
    [usuario_id, sala_id, data, horario_inicio, horario_fim, id]
  );
  return rows[0];
};

exports.deletar = async (id) => {
  await pool.query('DELETE FROM reservas WHERE id = $1', [id]);
  return true;
};
