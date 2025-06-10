// === AUTORES ===

// Lista todos os autores
function consultarAutores() {
  fetch("http://localhost:3001/autores")
    .then(res => res.json())
    .then(data => {
      mostrarResultado(data);
    })
    .catch(err => mostrarErro("Erro ao consultar autores"));
}

// Cadastra um autor novo
function cadastrarAutor() {
  const novoAutor = {
    nome: "Machado de Assis",
    nacionalidade: "Brasileiro"
  };

  fetch("http://localhost:3001/autores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novoAutor)
  })
    .then(res => res.json())
    .then(data => mostrarResultado(data))
    .catch(err => mostrarErro("Erro ao cadastrar autor"));
}

// === LIVROS ===

// Lista todos os livros
function consultarLivros() {
  fetch("http://localhost:3001/livros")
    .then(res => res.json())
    .then(data => {
      mostrarResultado(data);
    })
    .catch(err => mostrarErro("Erro ao consultar livros"));
}

// Cadastra um livro novo
function cadastrarLivro() {
  const novoLivro = {
    titulo: "Dom Casmurro",
    autor_id: 1,
    preco: 39.9
  };

  fetch("http://localhost:3001/livros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novoLivro)
  })
    .then(res => res.json())
    .then(data => mostrarResultado(data))
    .catch(err => mostrarErro("Erro ao cadastrar livro"));
}

// === Funções auxiliares ===

function mostrarResultado(dado) {
  document.getElementById("resultado").innerText = JSON.stringify(dado, null, 2);
}

function mostrarErro(msg) {
  document.getElementById("resultado").innerText = msg;
}
