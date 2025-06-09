const model = require('../models/ReservasModel');
const usuariosModel = require('../models/usuariosModel');
const salasModel = require('../models/SalasModel');
const { handleDatabaseErrors } = require('../middleware/validation');

// Métodos para API (JSON)
exports.listar = async (req, res) => {
  try {
    const reservas = await model.listar();
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar reservas' });
  }
};

// Métodos para Views (HTML)
exports.index = async (req, res) => {
  try {
    const reservas = await model.listar();

    // Enriquecer dados com nomes de usuários e salas
    const usuarios = await usuariosModel.listar();
    const salas = await salasModel.listar();

    const reservasEnriquecidas = reservas.map(reserva => {
      const usuario = usuarios.find(u => u.id == reserva.usuario_id);
      const sala = salas.find(s => s.id == reserva.sala_id);

      return {
        ...reserva,
        usuario_nome: usuario ? usuario.nome : null,
        sala_nome: sala ? sala.nome : null
      };
    });

    res.render('reservas/index', {
      reservas: reservasEnriquecidas,
      currentPage: 'reservas',
      title: 'Reservas'
    });
  } catch (err) {
    console.error('Erro ao carregar reservas:', err);
    res.render('reservas/index', {
      reservas: [],
      currentPage: 'reservas',
      title: 'Reservas',
      message: 'Erro ao carregar reservas',
      messageType: 'error'
    });
  }
};

exports.show = async (req, res) => {
  try {
    const reserva = await model.detalhar(req.params.id);
    if (!reserva) {
      return res.render('reservas/index', {
        reservas: [],
        currentPage: 'reservas',
        title: 'Reservas',
        message: 'Reserva não encontrada',
        messageType: 'error'
      });
    }

    // Buscar dados do usuário e sala
    const usuario = await usuariosModel.detalhar(reserva.usuario_id);
    const sala = await salasModel.detalhar(reserva.sala_id);

    res.render('reservas/show', {
      reserva,
      usuario,
      sala,
      currentPage: 'reservas',
      title: `Reserva #${reserva.id}`
    });
  } catch (err) {
    console.error('Erro ao carregar reserva:', err);
    res.redirect('/reservas');
  }
};

exports.new = async (req, res) => {
  try {
    const usuarios = await usuariosModel.listar();
    const salas = await salasModel.listar();

    res.render('reservas/form', {
      reserva: null,
      usuarios,
      salas,
      currentPage: 'reservas',
      title: 'Nova Reserva'
    });
  } catch (err) {
    console.error('Erro ao carregar dados para nova reserva:', err);
    res.redirect('/reservas');
  }
};

exports.edit = async (req, res) => {
  try {
    const reserva = await model.detalhar(req.params.id);
    if (!reserva) {
      return res.redirect('/reservas');
    }

    const usuarios = await usuariosModel.listar();
    const salas = await salasModel.listar();

    res.render('reservas/form', {
      reserva,
      usuarios,
      salas,
      currentPage: 'reservas',
      title: 'Editar Reserva'
    });
  } catch (err) {
    console.error('Erro ao carregar reserva para edição:', err);
    res.redirect('/reservas');
  }
};

exports.criar = async (req, res) => {
  try {
    // Verificar se usuário e sala existem
    const usuario = await usuariosModel.detalhar(req.body.usuario_id);
    const sala = await salasModel.detalhar(req.body.sala_id);

    if (!usuario) {
      return res.status(400).json({
        error: 'Usuário não encontrado',
        details: `Usuário com ID ${req.body.usuario_id} não existe`
      });
    }

    if (!sala) {
      return res.status(400).json({
        error: 'Sala não encontrada',
        details: `Sala com ID ${req.body.sala_id} não existe`
      });
    }

    const reserva = await model.criar(req.body);
    res.status(201).json(reserva);
  } catch (err) {
    console.error('Erro ao criar reserva:', err);
    handleDatabaseErrors(err, req, res);
  }
};

exports.detalhar = async (req, res) => {
  try {
    const reserva = await model.detalhar(req.params.id);
    if (!reserva) {
      return res.status(404).json({
        error: 'Reserva não encontrada',
        details: `Reserva com ID ${req.params.id} não existe`
      });
    }
    res.json(reserva);
  } catch (err) {
    handleDatabaseErrors(err, req, res);
  }
};

exports.atualizar = async (req, res) => {
  try {
    // Verificar se a reserva existe
    const reservaExistente = await model.detalhar(req.params.id);
    if (!reservaExistente) {
      return res.status(404).json({
        error: 'Reserva não encontrada',
        details: `Reserva com ID ${req.params.id} não existe`
      });
    }

    // Verificar se usuário e sala existem (se foram fornecidos)
    if (req.body.usuario_id) {
      const usuario = await usuariosModel.detalhar(req.body.usuario_id);
      if (!usuario) {
        return res.status(400).json({
          error: 'Usuário não encontrado',
          details: `Usuário com ID ${req.body.usuario_id} não existe`
        });
      }
    }

    if (req.body.sala_id) {
      const sala = await salasModel.detalhar(req.body.sala_id);
      if (!sala) {
        return res.status(400).json({
          error: 'Sala não encontrada',
          details: `Sala com ID ${req.body.sala_id} não existe`
        });
      }
    }

    const reserva = await model.atualizar(req.params.id, req.body);
    res.json(reserva);
  } catch (err) {
    handleDatabaseErrors(err, req, res);
  }
};

exports.deletar = async (req, res) => {
  try {
    // Verificar se a reserva existe antes de deletar
    const reserva = await model.detalhar(req.params.id);
    if (!reserva) {
      return res.status(404).json({
        error: 'Reserva não encontrada',
        details: `Reserva com ID ${req.params.id} não existe`
      });
    }

    await model.deletar(req.params.id);
    res.json({
      message: 'Reserva deletada com sucesso',
      deletedReservation: {
        id: req.params.id,
        data: reserva.data,
        horario: `${reserva.horario_inicio} - ${reserva.horario_fim}`
      }
    });
  } catch (err) {
    handleDatabaseErrors(err, req, res);
  }
};
