import "./App.css"; 
// Importa o arquivo CSS para estilização global da aplicação

import { BrowserRouter, Routes, Route } from "react-router-dom"; 
// Importa os componentes do React Router para controlar a navegação da aplicação

import Menu from "./componentes/Menu"; 
// Importa o componente do menu de navegação, que será exibido em todas as páginas

import Home from "./componentes/Home"; 
// Importa o componente da página inicial

import Cadastro from "./componentes/Cadastro"; 
// Importa o componente que contém o formulário para cadastrar novos alunos

import Consulta from "./componentes/Consulta"; 
// Importa o componente que permite consultar a lista de alunos cadastrados

import Excluir from "./componentes/Excluir"; 
// Importa o componente responsável por excluir um aluno, recebe o código do aluno pela URL

import Alterar from "./componentes/Alterar"; 
// Importa o componente para alterar os dados de um aluno, recebe o código pela URL


export default function App() {
  return (
    // BrowserRouter habilita o roteamento baseado na URL do navegador, controla as páginas exibidas
    <BrowserRouter> 

      {/* Componente Menu será renderizado sempre, aparecendo em todas as páginas */}
      <Menu /> 

      {/* Define todas as rotas (páginas) da aplicação */}
      <Routes> 
        {/* Quando a URL for exatamente "/", renderiza o componente Home */}
        <Route path="/" element={<Home />} /> 

        {/* Quando a URL for "/cadastro", renderiza o componente Cadastro */}
        <Route path="/cadastro" element={<Cadastro />} /> 

        {/* Quando a URL for "/consulta", renderiza o componente Consulta */}
        <Route path="/consulta" element={<Consulta />} /> 

        {/* Quando a URL for "/excluir/algum_codigo", renderiza o componente Excluir */}
        <Route path="/excluir/:codigo" element={<Excluir />} /> 

        {/* Quando a URL for "/alterar/algum_codigo", renderiza o componente Alterar */}
        <Route path="/alterar/:codigo" element={<Alterar />} />
      </Routes>
    </BrowserRouter>
  );
}