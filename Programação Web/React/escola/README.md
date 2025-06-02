
# FATEC - Programação WEB - Sistema CRUD de Alunos

Escola é uma aplicação web simples em React que permite gerenciar alunos via uma API RESTful. Com esta aplicação, é possível cadastrar, consultar, alterar e excluir alunos.

---

## Funcionalidades

O sistema realiza as seguintes operações:

- Consultar todos os alunos cadastrados.
- Consultar aluno específico por código (ID).
- Cadastrar um novo aluno com nome, cidade e estado.
- Alterar os dados de um aluno existente.
- Excluir um aluno pelo código.

---

## Como executar

### Requisitos

- Node.js instalado na máquina.
- Backend API rodando localmente em `http://localhost:3001` (API de alunos).

### Passos para rodar o frontend React

1. Clone ou baixe o projeto.

2. Instale as dependências:

```bash
npm install
```

3. Inicie a aplicação:

```bash
npm run dev
```

4. Acesse no navegador:

```
http://localhost:5173
```

---

## Estrutura dos componentes principais

- **App.jsx**: Define as rotas da aplicação com React Router.
- **Menu.jsx**: Menu de navegação entre as páginas.
- **Home.jsx**: Página inicial.
- **Cadastro.jsx**: Formulário para cadastrar alunos.
- **Consulta.jsx**: Lista e consulta alunos.
- **Alterar.jsx**: Componente para alterar dados de um aluno. Busca dados atuais ao carregar e permite editar.
- **Excluir.jsx**: Componente para excluir alunos.

---

## Exemplo de uso

- Na página inicial, navegue pelo menu para consultar ou cadastrar alunos.
- Para alterar ou excluir, use as rotas com o código do aluno, ex: `/alterar/1` ou `/excluir/1`.
- Os formulários são preenchidos automaticamente com os dados do aluno ao abrir a página de alteração.

---

## Tecnologias utilizadas

- React.js (com hooks e React Router)
- Axios para comunicação HTTP com a API
- Vite para bundling e desenvolvimento
- Backend REST API (não inclusa, deve estar rodando em localhost:3001)