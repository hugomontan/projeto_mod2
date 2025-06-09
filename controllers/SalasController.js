const model = require('../models/SalasModel');
const reservasModel = require('../models/ReservasModel');
const { handleDatabaseErrors } = require('../middleware/validation');

// Métodos para API (JSON)
exports.listar = async (req, res) => {
  try {
    const salas = await model.listar();
    res.json(salas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar salas' });
  }
};

// Métodos para Views (HTML)
exports.index = async (req, res) => {
  try {
    const salas = await model.listar();
    res.render('salas/index', {
      salas,
      currentPage: 'salas',
      title: 'Salas'
    });
  } catch (err) {
    console.error('Erro ao carregar salas:', err);
    res.render('salas/index', {
      salas: [],
      currentPage: 'salas',
      title: 'Salas',
      message: 'Erro ao carregar salas',
      messageType: 'error'
    });
  }
};

exports.show = async (req, res) => {
  try {
    const sala = await model.detalhar(req.params.id);
    if (!sala) {
      return res.render('salas/index', {
        salas: [],
        currentPage: 'salas',
        title: 'Salas',
        message: 'Sala não encontrada',
        messageType: 'error'
      });
    }

    // Buscar reservas da sala
    const todasReservas = await reservasModel.listar();
    const reservas = todasReservas.filter(r => r.sala_id == req.params.id);

    res.render('salas/show', {
      sala,
      reservas,
      currentPage: 'salas',
      title: `Sala: ${sala.nome}`
    });
  } catch (err) {
    console.error('Erro ao carregar sala:', err);
    res.redirect('/salas');
  }
};

exports.new = (req, res) => {
  res.render('salas/form', {
    sala: null,
    currentPage: 'salas',
    title: 'Nova Sala'
  });
};

exports.edit = async (req, res) => {
  try {
    const sala = await model.detalhar(req.params.id);
    if (!sala) {
      return res.redirect('/salas');
    }

    res.render('salas/form', {
      sala,
      currentPage: 'salas',
      title: 'Editar Sala'
    });
  } catch (err) {
    console.error('Erro ao carregar sala para edição:', err);
    res.redirect('/salas');
  }
};

exports.criar = async (req, res) => {
  try {
    const sala = await model.criar(req.body);
    res.status(201).json(sala);
  } catch (err) {
    handleDatabaseErrors(err, req, res);
  }
};

exports.detalhar = async (req, res) => {
  try {
    const sala = await model.detalhar(req.params.id);
    if (!sala) {
      return res.status(404).json({
        error: 'Sala não encontrada',
        details: `Sala com ID ${req.params.id} não existe`
      });
    }
    res.json(sala);
  } catch (err) {
    handleDatabaseErrors(err, req, res);
  }
};

exports.atualizar = async (req, res) => {
  try {
    const sala = await model.atualizar(req.params.id, req.body);
    if (!sala) {
      return res.status(404).json({
        error: 'Sala não encontrada',
        details: `Sala com ID ${req.params.id} não existe`
      });
    }
    res.json(sala);
  } catch (err) {
    handleDatabaseErrors(err, req, res);
  }
};

exports.deletar = async (req, res) => {
  try {
    // Verificar se a sala existe antes de deletar
    const sala = await model.detalhar(req.params.id);
    if (!sala) {
      return res.status(404).json({
        error: 'Sala não encontrada',
        details: `Sala com ID ${req.params.id} não existe`
      });
    }

    await model.deletar(req.params.id);
    res.json({
      message: 'Sala deletada com sucesso',
      deletedRoom: { id: req.params.id, nome: sala.nome }
    });
  } catch (err) {
    handleDatabaseErrors(err, req, res);
  }
};
