const express = require('express');
const router = express.Router();

const controller = require('../controllers/SalasController');

// Rotas para Views (HTML)
router.get('/', controller.index);
router.get('/nova', controller.new);
router.get('/:id', controller.show);
router.get('/:id/editar', controller.edit);

module.exports = router;
