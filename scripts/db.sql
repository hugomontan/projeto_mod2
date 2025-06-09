DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS salas;

CREATE TABLE salas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  capacidade INTEGER NOT NULL
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  sala_id INTEGER NOT NULL,
  usuario_id INTEGER NOT NULL,
  data DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_reservas_sala_data ON reservas(sala_id, data);
CREATE INDEX idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);
