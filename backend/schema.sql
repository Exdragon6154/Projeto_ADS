CREATE DATABASE IF NOT EXISTS vitrinepro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vitrinepro;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(40),
  cidade VARCHAR(100),
  estado CHAR(2),
  tipo ENUM('cliente','fornecedor','admin') NOT NULL,
  status ENUM('ativo','bloqueado') NOT NULL DEFAULT 'ativo',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fornecedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  empresa VARCHAR(180) NOT NULL,
  responsavel VARCHAR(150) NOT NULL,
  cnpj VARCHAR(30) NOT NULL,
  endereco VARCHAR(255),
  cidade VARCHAR(100),
  estado CHAR(2),
  descricao TEXT,
  status ENUM('ativo','em_analise','bloqueado') NOT NULL DEFAULT 'ativo',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fornecedor_id INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(180) NOT NULL,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  estoque INT NOT NULL DEFAULT 0,
  tamanho VARCHAR(50),
  cor VARCHAR(80),
  descricao TEXT,
  emoji VARCHAR(10) DEFAULT '📦',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_produtos_preco CHECK (preco >= 0),
  CONSTRAINT chk_produtos_estoque CHECK (estoque >= 0),
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favoritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  produto_id INT NULL,
  fornecedor_id INT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE,
  UNIQUE KEY uq_fav_produto (cliente_id, produto_id),
  UNIQUE KEY uq_fav_fornecedor (cliente_id, fornecedor_id)
);

CREATE TABLE IF NOT EXISTS interesses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  cliente_id INT NOT NULL,
  produto_id INT NOT NULL,
  fornecedor_id INT NOT NULL,
  quantidade INT NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_interesses_quantidade CHECK (quantidade > 0),
  CONSTRAINT chk_interesses_valores CHECK (valor_unitario >= 0 AND valor_total >= 0),
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS logs_admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NULL,
  texto VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
