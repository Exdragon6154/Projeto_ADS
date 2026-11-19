-- VitrinePRO_22: notificacoes administrativas. Migração incremental e segura.
USE vitrinepro;
CREATE TABLE IF NOT EXISTS notificacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NULL,
  tipo VARCHAR(40) NOT NULL,
  titulo VARCHAR(160) NOT NULL,
  mensagem VARCHAR(500) NOT NULL,
  lida TINYINT(1) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notificacoes_admin_data (admin_id, criado_em),
  INDEX idx_notificacoes_lida (lida),
  CONSTRAINT fk_notificacoes_admin FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
