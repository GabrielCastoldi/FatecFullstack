import { StrictMode } from 'react'
// Importa o StrictMode do React, que ativa verificações e avisos adicionais para ajudar no desenvolvimento

import { createRoot } from 'react-dom/client'
// Importa a função createRoot para criar o root da aplicação React (nova API do React 18+)

import './index.css'
// Importa o arquivo CSS global para estilização base da aplicação

import App from './App.jsx'
// Importa o componente principal da aplicação

// Cria a raiz do React associada ao elemento HTML com id 'root' (geralmente uma <div> no index.html)
createRoot(document.getElementById('root')).render(
  // Renderiza o componente App dentro do StrictMode para ativar as verificações extras durante o desenvolvimento
  <StrictMode>
    <App />
  </StrictMode>,
)