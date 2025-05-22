const model = require('../models/usuariosModel');

exports.listar = async (req, res) => {
  try {
    const usuarios = await model.listar();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

exports.criar = async (req, res) => {
  try {
    const usuario = await model.criar(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

exports.detalhar = async (req, res) => {
  try {
    const usuario = await model.detalhar(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao detalhar usuário' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const usuario = await model.atualizar(req.params.id, req.body);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

exports.deletar = async (req, res) => {
  try {
    await model.deletar(req.params.id);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};
