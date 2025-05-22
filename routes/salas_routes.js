const express = require('express');
const router = express.Router();

const controller = require('../controllers/SalasController');

// Exemplo de rotas para salas
router.get('/', (req, res) => {
    controller.listar(req, res);
});

router.post('/', (req, res) => {
  controller.criar(req, res);
});

router.get('/:id', (req, res) => {
  controller.detalhar(req, res);
});

router.put('/:id', (req, res) => {
  controller.atualizar(req, res);
});

router.delete('/:id', (req, res) => {
  controller.deletar(req, res);
});

module.exports = router;
