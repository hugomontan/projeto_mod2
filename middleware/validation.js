// Middleware de validação para o sistema RoomReserve

// Função utilitária para sanitizar strings
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, ''); // Remove caracteres perigosos básicos
};

// Função utilitária para validar email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função utilitária para validar ID numérico
const isValidId = (id) => {
  return !isNaN(id) && parseInt(id) > 0;
};

// Função utilitária para validar data
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Função utilitária para validar horário
const isValidTime = (timeString) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

// Middleware para validar parâmetros de ID
exports.validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || !isValidId(id)) {
    return res.status(400).json({ 
      error: 'ID inválido',
      details: 'O ID deve ser um número inteiro positivo'
    });
  }
  
  req.params.id = parseInt(id);
  next();
};

// Validação para usuários
exports.validateUsuario = (req, res, next) => {
  const { nome, email } = req.body;
  const errors = [];

  // Validar nome
  if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
    errors.push('Nome é obrigatório');
  } else if (nome.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  } else if (nome.trim().length > 255) {
    errors.push('Nome deve ter no máximo 255 caracteres');
  }

  // Validar email
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email é obrigatório');
  } else if (!isValidEmail(email.trim())) {
    errors.push('Email deve ter um formato válido');
  } else if (email.trim().length > 255) {
    errors.push('Email deve ter no máximo 255 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Dados inválidos',
      details: errors
    });
  }

  // Sanitizar dados
  req.body.nome = sanitizeString(nome);
  req.body.email = sanitizeString(email).toLowerCase();
  
  next();
};

// Validação para salas
exports.validateSala = (req, res, next) => {
  const { nome, tipo, capacidade } = req.body;
  const errors = [];
  const tiposValidos = ['Ateliê', 'Sala de Estudo', 'Laboratório', 'Auditório'];

  // Validar nome
  if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
    errors.push('Nome é obrigatório');
  } else if (nome.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  } else if (nome.trim().length > 255) {
    errors.push('Nome deve ter no máximo 255 caracteres');
  }

  // Validar tipo
  if (!tipo || typeof tipo !== 'string' || tipo.trim().length === 0) {
    errors.push('Tipo é obrigatório');
  } else if (!tiposValidos.includes(tipo.trim())) {
    errors.push(`Tipo deve ser um dos seguintes: ${tiposValidos.join(', ')}`);
  }

  // Validar capacidade
  if (!capacidade) {
    errors.push('Capacidade é obrigatória');
  } else {
    const cap = parseInt(capacidade);
    if (isNaN(cap) || cap <= 0) {
      errors.push('Capacidade deve ser um número inteiro positivo');
    } else if (cap > 1000) {
      errors.push('Capacidade deve ser no máximo 1000');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Dados inválidos',
      details: errors
    });
  }

  // Sanitizar dados
  req.body.nome = sanitizeString(nome);
  req.body.tipo = sanitizeString(tipo);
  req.body.capacidade = parseInt(capacidade);
  
  next();
};

// Validação para reservas
exports.validateReserva = (req, res, next) => {
  const { sala_id, usuario_id, data, horario_inicio, horario_fim } = req.body;
  const errors = [];

  // Validar sala_id
  if (!sala_id) {
    errors.push('ID da sala é obrigatório');
  } else if (!isValidId(sala_id)) {
    errors.push('ID da sala deve ser um número inteiro positivo');
  }

  // Validar usuario_id
  if (!usuario_id) {
    errors.push('ID do usuário é obrigatório');
  } else if (!isValidId(usuario_id)) {
    errors.push('ID do usuário deve ser um número inteiro positivo');
  }

  // Validar data
  if (!data || typeof data !== 'string' || data.trim().length === 0) {
    errors.push('Data é obrigatória');
  } else if (!isValidDate(data)) {
    errors.push('Data deve ter um formato válido (YYYY-MM-DD)');
  } else {
    const dataReserva = new Date(data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataReserva < hoje) {
      errors.push('Data da reserva não pode ser no passado');
    }
  }

  // Validar horário de início
  if (!horario_inicio || typeof horario_inicio !== 'string' || horario_inicio.trim().length === 0) {
    errors.push('Horário de início é obrigatório');
  } else if (!isValidTime(horario_inicio)) {
    errors.push('Horário de início deve ter formato válido (HH:MM)');
  }

  // Validar horário de fim
  if (!horario_fim || typeof horario_fim !== 'string' || horario_fim.trim().length === 0) {
    errors.push('Horário de fim é obrigatório');
  } else if (!isValidTime(horario_fim)) {
    errors.push('Horário de fim deve ter formato válido (HH:MM)');
  }

  // Validar se horário de fim é posterior ao de início
  if (horario_inicio && horario_fim && isValidTime(horario_inicio) && isValidTime(horario_fim)) {
    if (horario_fim <= horario_inicio) {
      errors.push('Horário de fim deve ser posterior ao horário de início');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Dados inválidos',
      details: errors
    });
  }

  // Sanitizar dados
  req.body.sala_id = parseInt(sala_id);
  req.body.usuario_id = parseInt(usuario_id);
  req.body.data = data.trim();
  req.body.horario_inicio = horario_inicio.trim();
  req.body.horario_fim = horario_fim.trim();
  
  next();
};

// Middleware para tratar erros de validação do banco de dados
exports.handleDatabaseErrors = (error, req, res, next) => {
  console.error('Erro do banco de dados:', error);

  // Erro de violação de constraint única (email duplicado)
  if (error.code === '23505') {
    if (error.constraint && error.constraint.includes('email')) {
      return res.status(409).json({
        error: 'Email já cadastrado',
        details: 'Este email já está sendo usado por outro usuário'
      });
    }
  }

  // Erro de violação de foreign key
  if (error.code === '23503') {
    return res.status(400).json({
      error: 'Referência inválida',
      details: 'Um dos IDs fornecidos não existe no sistema'
    });
  }

  // Erro de violação de not null
  if (error.code === '23502') {
    return res.status(400).json({
      error: 'Campo obrigatório',
      details: `O campo ${error.column} é obrigatório`
    });
  }

  // Erro genérico
  return res.status(500).json({
    error: 'Erro interno do servidor',
    details: 'Ocorreu um erro inesperado. Tente novamente.'
  });
};
