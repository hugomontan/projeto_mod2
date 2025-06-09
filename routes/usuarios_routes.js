const express = require('express');
const router = express.Router();

const controller = require('../controllers/UsuariosController');

// Rotas para Views (HTML)
router.get('/', controller.index);
router.get('/novo', controller.new);
router.get('/:id', controller.show);
router.get('/:id/editar', controller.edit);

module.exports = router;
