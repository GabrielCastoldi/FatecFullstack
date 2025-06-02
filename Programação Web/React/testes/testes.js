// Consulta todos os alunos
function consultar() {
  fetch("http://localhost:3001/alunos")
    .then((res) => res.json())
    .then((data) => {
      console.log("Alunos:", data);
      document.getElementById("resultado").innerHTML = JSON.stringify(
        data,
        null,
        2
      );
    })
    .catch((err) => {
      document.getElementById("resultado").innerHTML =
        "Erro ao obter dados da API!";
    });
}

// Consulta um aluno específico pelo código
function consultarPorCodigo(codigo) {
  fetch(`http://localhost:3001/alunos/${codigo}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Aluno:", data);
      document.getElementById("resultado").innerHTML = JSON.stringify(
        data,
        null,
        2
      );
    })
    .catch((err) => {
      document.getElementById("resultado").innerHTML =
        "Erro ao obter dados da API!";
    });
}

// Cadastra um novo aluno
function cadastrar() {
  const aluno = {
    nome: "Guilherme",
    cidade: "Mococa",
    estado: "SP",
  };

  fetch("http://localhost:3001/alunos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(aluno),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("resultado").innerHTML =
        data.message || data.error;
    })
    .catch((err) => {
      document.getElementById("resultado").innerHTML =
        "Erro ao cadastrar aluno!";
    });
}

// Altera os dados de um aluno pelo código
function alterar(codigo) {
  const alunoAtualizado = {
    nome: "Guilherme Henrique de Souza",
    cidade: "São Paulo",
    estado: "SP",
  };

  fetch(`http://localhost:3001/alunos/${codigo}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(alunoAtualizado),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("resultado").innerHTML =
        data.message || data.error;
    })
    .catch((err) => {
      document.getElementById("resultado").innerHTML =
        "Erro ao atualizar aluno!";
    });
}

// Exclui um aluno pelo código
function excluir(codigo) {
  fetch(`http://localhost:3001/alunos/${codigo}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("resultado").innerHTML =
        data.message || data.error;
    })
    .catch((err) => {
      document.getElementById("resultado").innerHTML = "Erro ao excluir aluno!";
    });
}