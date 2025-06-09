const model = require('../models/usuariosModel');
const reservasModel = require('../models/ReservasModel');
const { handleDatabaseErrors } = require('../middleware/validation');

// Métodos para API (JSON)
exports.listar = async (req, res) => {
  try {
    const usuarios = await model.listar();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

// Métodos para Views (HTML)
exports.index = async (req, res) => {
  try {
    const usuarios = await model.listar();
    res.render('usuarios/index', {
      usuarios,
      currentPage: 'usuarios',
      title: 'Usuários'
    });
  } catch (err) {
    console.error('Erro ao carregar usuários:', err);
    res.render('usuarios/index', {
      usuarios: [],
      currentPage: 'usuarios',
      title: 'Usuários',
      message: 'Erro ao carregar usuários',
      messageType: 'error'
    });
  }
};

exports.show = async (req, res) => {
  try {
    const usuario = await model.detalhar(req.params.id);
    if (!usuario) {
      return res.render('usuarios/index', {
        usuarios: [],
        currentPage: 'usuarios',
        title: 'Usuários',
        message: 'Usuário não encontrado',
        messageType: 'error'
      });
    }

    // Buscar reservas do usuário
    const todasReservas = await reservasModel.listar();
    const reservas = todasReservas.filter(r => r.usuario_id == req.params.id);

    res.render('usuarios/show', {
      usuario,
      reservas,
      currentPage: 'usuarios',
      title: `Usuário: ${usuario.nome}`
    });
  } catch (err) {
    console.error('Erro ao carregar usuário:', err);
    res.redirect('/usuarios');
  }
};

exports.new = (req, res) => {
  res.render('usuarios/form', {
    usuario: null,
    currentPage: 'usuarios',
    title: 'Novo Usuário'
  });
};

exports.edit = async (req, res) => {
  try {
    const usuario = await model.detalhar(req.params.id);
    if (!usuario) {
      return res.redirect('/usuarios');
    }

    res.render('usuarios/form', {
      usuario,
      currentPage: 'usuarios',
      title: 'Editar Usuário'
    });
  } catch (err) {
    console.error('Erro ao carregar usuário para edição:', err);
    res.redirect('/usuarios');
  }
};

exports.criar = async (req, res) => {
  try {
    const usuario = await model.criar(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    handleDatabaseErrors(err, req, res);
  }
};

exports.detalhar = async (req, res) => {
  try {
    const usuario = await model.detalhar(req.params.id);
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        details: `Usuário com ID ${req.params.id} não existe`
      });
    }
    res.json(usuario);
  } catch (err) {
    handleDatabaseErrors(err, req, res);
  }
};

exports.atualizar = async (req, res) => {
  try {
    const usuario = await model.atualizar(req.params.id, req.body);
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        details: `Usuário com ID ${req.params.id} não existe`
      });
    }
    res.json(usuario);
  } catch (err) {
    handleDatabaseErrors(err, req, res);
  }
};

exports.deletar = async (req, res) => {
  try {
    // Verificar se o usuário existe antes de deletar
    const usuario = await model.detalhar(req.params.id);
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        details: `Usuário com ID ${req.params.id} não existe`
      });
    }

    await model.deletar(req.params.id);
    res.json({
      message: 'Usuário deletado com sucesso',
      deletedUser: { id: req.params.id, nome: usuario.nome }
    });
  } catch (err) {
    handleDatabaseErrors(err, req, res);
  }
};
