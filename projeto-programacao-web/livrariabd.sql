CREATE DATABASE livraria;
USE livraria;

-- Tabela de autores
CREATE TABLE autores (
  id_autor INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  pais VARCHAR(50)
);

-- Tabela de livros
CREATE TABLE livros (
  id_livro INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150),
  preco DECIMAL(10,2),
  estoque INT,
  id_autor INT,
  FOREIGN KEY (id_autor) REFERENCES autores(id_autor)
);

-- Tabela de vendas
CREATE TABLE vendas (
  id_venda INT AUTO_INCREMENT PRIMARY KEY,
  data_venda DATE
);

-- Tabela de itens da venda (relacionamento N:N entre livros e vendas)
CREATE TABLE itens_venda (
  id_item INT AUTO_INCREMENT PRIMARY KEY,
  id_livro INT,
  id_venda INT,
  quantidade INT,
  preco_unitario DECIMAL(10,2),
  FOREIGN KEY (id_livro) REFERENCES livros(id_livro),
  FOREIGN KEY (id_venda) REFERENCES vendas(id_venda)
);
