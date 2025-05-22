const model = require('../models/ReservasModel');

exports.listar = async (req, res) => {
  try {
    const reservas = await model.listar();
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar reservas' });
  }
};

exports.criar = async (req, res) => {
  try {
    const reserva = await model.criar(req.body);
    res.status(201).json(reserva);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar reserva' });
    console.log(err);
  }
};

exports.detalhar = async (req, res) => {
  try {
    const reserva = await model.detalhar(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }
    res.json(reserva);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao detalhar reserva' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const reserva = await model.atualizar(req.params.id, req.body);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }
    res.json(reserva);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar reserva' });
  }
};

exports.deletar = async (req, res) => {
  try {
    await model.deletar(req.params.id);
    res.json({ message: 'Reserva deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar reserva' });
  }
};
