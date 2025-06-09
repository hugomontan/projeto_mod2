const usuariosModel = require('../models/usuariosModel');
const salasModel = require('../models/SalasModel');
const reservasModel = require('../models/ReservasModel');

exports.index = async (req, res) => {
  try {
    // Buscar estatísticas
    const usuarios = await usuariosModel.listar();
    const salas = await salasModel.listar();
    const reservas = await reservasModel.listar();
    
    // Calcular reservas de hoje
    const hoje = new Date().toISOString().split('T')[0];
    const reservasHoje = reservas.filter(r => r.data === hoje);
    
    // Buscar reservas recentes (últimas 5)
    const reservasRecentes = reservas
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 5);
    
    // Enriquecer reservas recentes com nomes
    const reservasEnriquecidas = reservasRecentes.map(reserva => {
      const usuario = usuarios.find(u => u.id == reserva.usuario_id);
      const sala = salas.find(s => s.id == reserva.sala_id);
      
      return {
        ...reserva,
        usuario_nome: usuario ? usuario.nome : null,
        sala_nome: sala ? sala.nome : null
      };
    });
    
    const stats = {
      usuarios: usuarios.length,
      salas: salas.length,
      reservas: reservas.length,
      reservasHoje: reservasHoje.length
    };
    
    res.render('index', {
      stats,
      reservasRecentes: reservasEnriquecidas,
      currentPage: 'home',
      title: 'Dashboard'
    });
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
    res.render('index', {
      stats: { usuarios: 0, salas: 0, reservas: 0, reservasHoje: 0 },
      reservasRecentes: [],
      currentPage: 'home',
      title: 'Dashboard',
      message: 'Erro ao carregar dados do dashboard',
      messageType: 'error'
    });
  }
};
