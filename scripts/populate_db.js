const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function populateDatabase() {
  try {
    // Limpar tabelas existentes
    await pool.query('DELETE FROM reservas');
    await pool.query('DELETE FROM usuarios');
    await pool.query('DELETE FROM salas');
    
    // Resetar sequências
    await pool.query('ALTER SEQUENCE usuarios_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE salas_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE reservas_id_seq RESTART WITH 1');
    
    // Inserir usuários de exemplo
    const usuarios = [
      { nome: 'João Silva', email: 'joao.silva@email.com' },
      { nome: 'Maria Santos', email: 'maria.santos@email.com' },
      { nome: 'Pedro Oliveira', email: 'pedro.oliveira@email.com' },
      { nome: 'Ana Costa', email: 'ana.costa@email.com' },
      { nome: 'Carlos Ferreira', email: 'carlos.ferreira@email.com' }
    ];

    for (const usuario of usuarios) {
      await pool.query(
        'INSERT INTO usuarios (nome, email) VALUES ($1, $2)',
        [usuario.nome, usuario.email]
      );
    }

    // Inserir salas de exemplo
    const salas = [
      { nome: 'Sala de Estudos A1', tipo: 'Sala de Estudo', capacidade: 20 },
      { nome: 'Sala de Estudos B2', tipo: 'Sala de Estudo', capacidade: 15 },
      { nome: 'Ateliê de Arte 1', tipo: 'Ateliê', capacidade: 25 },
      { nome: 'Ateliê de Arte 2', tipo: 'Ateliê', capacidade: 30 },
      { nome: 'Laboratório de Informática', tipo: 'Laboratório', capacidade: 40 },
      { nome: 'Auditório Principal', tipo: 'Auditório', capacidade: 100 }
    ];

    for (const sala of salas) {
      await pool.query(
        'INSERT INTO salas (nome, tipo, capacidade) VALUES ($1, $2, $3)',
        [sala.nome, sala.tipo, sala.capacidade]
      );
    }

    // Inserir reservas de exemplo
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const depoisDeAmanha = new Date(hoje);
    depoisDeAmanha.setDate(hoje.getDate() + 2);

    const reservas = [
      {
        usuario_id: 1,
        sala_id: 1,
        data: hoje.toISOString().split('T')[0],
        horario_inicio: '09:00',
        horario_fim: '11:00'
      },
      {
        usuario_id: 2,
        sala_id: 3,
        data: hoje.toISOString().split('T')[0],
        horario_inicio: '14:00',
        horario_fim: '16:00'
      },
      {
        usuario_id: 3,
        sala_id: 2,
        data: amanha.toISOString().split('T')[0],
        horario_inicio: '10:00',
        horario_fim: '12:00'
      },
      {
        usuario_id: 4,
        sala_id: 4,
        data: amanha.toISOString().split('T')[0],
        horario_inicio: '15:00',
        horario_fim: '17:00'
      },
      {
        usuario_id: 5,
        sala_id: 5,
        data: depoisDeAmanha.toISOString().split('T')[0],
        horario_inicio: '08:00',
        horario_fim: '10:00'
      }
    ];

    for (const reserva of reservas) {
      await pool.query(
        'INSERT INTO reservas (usuario_id, sala_id, data, horario_inicio, horario_fim) VALUES ($1, $2, $3, $4, $5)',
        [reserva.usuario_id, reserva.sala_id, reserva.data, reserva.horario_inicio, reserva.horario_fim]
      );
    }

    console.log('\nBanco de dados populado com sucesso!');
    console.log('Dados inseridos:');
    console.log(`- ${usuarios.length} usuários`);
    console.log(`- ${salas.length} salas`);
    console.log(`- ${reservas.length} reservas`);
    
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error.message);
  } finally {
    await pool.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  populateDatabase();
}

module.exports = populateDatabase;
