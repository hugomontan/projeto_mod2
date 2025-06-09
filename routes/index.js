const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/DashboardController');
const usuariosRoutes = require('./usuarios_routes');
const salasRoutes = require('./salas_routes');
const reservasRoutes = require('./reservas_routes');
const apiRoutes = require('./api_routes');

// Rota principal (Dashboard)
router.get('/', dashboardController.index);

// Rotas para Views (HTML)
router.use('/usuarios', usuariosRoutes);
router.use('/salas', salasRoutes);
router.use('/reservas', reservasRoutes);

// Rotas para API (JSON)
router.use('/api', apiRoutes);

module.exports = router;
