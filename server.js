const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Conexão com o banco de dados
const db = require('./config/database');
db.connect()
  .then(() => console.log('Conectado ao banco de dados!'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
const routes = require('./routes/index');
app.use('/', routes);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});