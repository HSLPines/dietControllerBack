create schema DietController;

CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    sexo ENUM('masculino', 'feminino', 'outro'),
    idade INT,
    altura DECIMAL(4, 2),
    peso DECIMAL(5, 2),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Meta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    tipo ENUM('diaria', 'semanal', 'mensal'),
    calorias_objetivo DECIMAL(5, 2),
    proteina_objetivo DECIMAL(5, 2),
    carboidrato_objetivo DECIMAL(5, 2),
    data_inicio DATE,
    data_fim DATE,
    status ENUM('ativa', 'completada', 'pendente') DEFAULT 'ativa',
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE Calendario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    data DATE,
    descricao TEXT,
    meta_id INT,
    pontos_gamificacao INT DEFAULT 0,
    status ENUM('completada', 'pendente') DEFAULT 'pendente',
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (meta_id) REFERENCES Meta(id)
);

CREATE TABLE Tutorial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    status ENUM('completado', 'pendente') DEFAULT 'pendente',
    data_completado DATETIME,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE Refeicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nome VARCHAR(100),
    data_hora DATETIME,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE Alimento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    calorias DECIMAL(5, 2),
    proteina DECIMAL(5, 2),
    carboidrato DECIMAL(5, 2),
    gordura DECIMAL(5, 2),
    micronutrientes TEXT
);

CREATE TABLE Refeicao_Alimento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    refeicao_id INT,
    alimento_id INT,
    quantidade DECIMAL(5, 2), -- Quantidade consumida em gramas
    FOREIGN KEY (refeicao_id) REFERENCES Refeicao(id),
    FOREIGN KEY (alimento_id) REFERENCES Alimento(id)
);

CREATE TABLE Receita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nome VARCHAR(100),
    descricao TEXT,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);


