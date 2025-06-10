// src/App.jsx

// REMOVA 'BrowserRouter' desta importação!
import { Routes, Route, Link } from "react-router-dom";

// --- Importa o componente Home (Página Inicial) ---
import Home from "./componentes/home/Home"; // Verifique se o caminho e o nome 'componentes' estão corretos

// --- Importa os componentes de Autores ---
import ConsultaAutores from "./componentes/autores/ConsultaAutores";
import CadastroAutor from "./componentes/autores/CadastroAutor";
import AlterarAutor from "./componentes/autores/AlterarAutor";

// --- Importa os componentes de Livros ---
import ConsultaLivros from "./componentes/livros/ConsultaLivros";
import CadastroLivro from "./componentes/livros/CadastroLivro";
import AlterarLivro from "./componentes/livros/AlterarLivro";

// --- Importa os componentes de Vendas ---
import ConsultaVendas from "./componentes/vendas/ConsultaVendas";
import CadastroVenda from "./componentes/vendas/CadastroVenda";

// --- Importa os componentes de Itens de Venda ---
import ConsultaItensVenda from "./componentes/itensVenda/ConsultaItensVenda";
import CadastroItemVenda from "./componentes/itensVenda/CadastroItemVenda";

// --- Importa o CSS para estilização ---
import './App.css';
import './index.css';

function App() {
  return (
    // REMOVA A TAG <BrowserRouter> AQUI e a de fechamento lá embaixo
    // Use um Fragmento React (<></>) para envolver o <header> e <main>
    <>
      <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li> {/* Link para a página Home */}
            <li><Link to="/autores">Autores</Link></li>
            <li><Link to="/livros">Livros</Link></li>
            <li><Link to="/vendas">Vendas</Link></li>
            <li><Link to="/itens-venda">Itens de Venda</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          {/* Rota para a página inicial (Home) */}
          <Route path="/" element={<Home />} />

          {/* Rotas para Autores */}
          <Route path="/autores" element={<ConsultaAutores />} />
          <Route path="/autores/cadastrar" element={<CadastroAutor />} />
          <Route path="/autores/alterar/:id" element={<AlterarAutor />} />

          {/* Rotas para Livros */}
          <Route path="/livros" element={<ConsultaLivros />} />
          <Route path="/livros/cadastrar" element={<CadastroLivro />} />
          <Route path="/livros/alterar/:id" element={<AlterarLivro />} />

          {/* Rotas para Vendas */}
          <Route path="/vendas" element={<ConsultaVendas />} />
          <Route path="/vendas/cadastrar" element={<CadastroVenda />} />

          {/* Rotas para Itens de Venda */}
          <Route path="/itens-venda" element={<ConsultaItensVenda />} />
          <Route path="/itens-venda/cadastrar" element={<CadastroItemVenda />} />

          {/* Rota para lidar com caminhos não encontrados (404) */}
          <Route path="*" element={<h2>Página não encontrada</h2>} />
        </Routes>
      </main>
    </> // E feche o Fragmento aqui
  );
}

export default App;