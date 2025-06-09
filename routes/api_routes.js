const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/UsuariosController');
const salasController = require('../controllers/SalasController');
const reservasController = require('../controllers/ReservasController');
const { validateId, validateUsuario, validateSala, validateReserva } = require('../middleware/validation');

// Rotas API para Usuários
router.get('/usuarios', usuariosController.listar);
router.post('/usuarios', validateUsuario, usuariosController.criar);
router.get('/usuarios/:id', validateId, usuariosController.detalhar);
router.put('/usuarios/:id', validateId, validateUsuario, usuariosController.atualizar);
router.delete('/usuarios/:id', validateId, usuariosController.deletar);

// Rotas API para Salas
router.get('/salas', salasController.listar);
router.post('/salas', validateSala, salasController.criar);
router.get('/salas/:id', validateId, salasController.detalhar);
router.put('/salas/:id', validateId, validateSala, salasController.atualizar);
router.delete('/salas/:id', validateId, salasController.deletar);

// Rotas API para Reservas
router.get('/reservas', reservasController.listar);
router.post('/reservas', validateReserva, reservasController.criar);
router.get('/reservas/:id', validateId, reservasController.detalhar);
router.put('/reservas/:id', validateId, validateReserva, reservasController.atualizar);
router.delete('/reservas/:id', validateId, reservasController.deletar);

// Rota especial para verificar disponibilidade de reserva
router.get('/reservas/check-availability', async (req, res) => {
  try {
    const { sala_id, data, horario_inicio, horario_fim, reserva_id } = req.query;
    
    if (!sala_id || !data || !horario_inicio || !horario_fim) {
      return res.status(400).json({ 
        available: false, 
        error: 'Parâmetros obrigatórios: sala_id, data, horario_inicio, horario_fim' 
      });
    }
    
    const reservasModel = require('../models/ReservasModel');
    const reservas = await reservasModel.listar();
    
    // Filtrar reservas da mesma sala e data
    const conflitos = reservas.filter(reserva => {
      // Excluir a própria reserva se estiver editando
      if (reserva_id && reserva.id == reserva_id) {
        return false;
      }
      
      return reserva.sala_id == sala_id && 
             reserva.data === data &&
             (
               (horario_inicio >= reserva.horario_inicio && horario_inicio < reserva.horario_fim) ||
               (horario_fim > reserva.horario_inicio && horario_fim <= reserva.horario_fim) ||
               (horario_inicio <= reserva.horario_inicio && horario_fim >= reserva.horario_fim)
             );
    });
    
    res.json({ available: conflitos.length === 0 });
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    res.status(500).json({ available: false, error: 'Erro interno do servidor' });
  }
});

module.exports = router;
