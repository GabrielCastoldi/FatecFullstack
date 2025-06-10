// src/components/home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="conteudo home-page">
      <h1>Bem-vindo à sua Livraria Online!</h1>
      <p>Gerencie autores, livros, vendas e itens de venda de forma eficiente.</p>
      <div className="home-links">
        <Link to="/livros" className="button-home">Ver Livros</Link>
        <Link to="/vendas/cadastrar" className="button-home">Registrar Nova Venda</Link>
        <Link to="/autores" className="button-home">Ver Autores</Link>
      </div>
      {/* Você pode adicionar mais conteúdo dinâmico aqui futuramente */}
    </div>
  );
}