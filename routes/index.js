const express = require('express');
const router = express.Router();

const usuariosRoutes = require('./usuarios_routes');
const salasRoutes = require('./salas_routes');
const reservasRoutes = require('./reservas_routes');

// Exemplo de rota GET
router.get('/', (req, res) => {
  res.redirect('/usuarios');
});

router.use('/usuarios', usuariosRoutes);
router.use('/salas', salasRoutes);
router.use('/reservas', reservasRoutes);

module.exports = router;
