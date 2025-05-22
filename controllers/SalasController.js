const model = require('../models/SalasModel');

exports.listar = async (req, res) => {
  try {
    const salas = await model.listar();
    res.json(salas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar salas' });
  }
};

exports.criar = async (req, res) => {
  try {
    const sala = await model.criar(req.body);
    res.status(201).json(sala);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar sala' });
  }
};

exports.detalhar = async (req, res) => {
  try {
    const sala = await model.detalhar(req.params.id);
    if (!sala) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }
    res.json(sala);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao detalhar sala' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const sala = await model.atualizar(req.params.id, req.body);
    if (!sala) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }
    res.json(sala);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar sala' });
  }
};

exports.deletar = async (req, res) => {
  try {
    await model.deletar(req.params.id);
    res.json({ message: 'Sala deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar sala' });
  }
};
