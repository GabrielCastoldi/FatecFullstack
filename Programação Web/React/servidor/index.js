const express = require("express"); // Importa o módulo express, que facilita a criação de servidores web
const cors = require("cors"); // Importa o módulo cors para permitir requisições de diferentes origens (Cross-Origin Resource Sharing)
const mysql2 = require("mysql2"); // Importa o módulo mysql2, que permite conectar e interagir com o banco de dados MySQL

const app = express(); // Inicializa a aplicação Express
const PORT = 3001; // Define a porta na qual o servidor vai escutar

app.use(cors()); // Aplica o middleware cors para permitir requisições de outras origens
app.use(express.json()); // Aplica o middleware express.json() para permitir o recebimento de JSON no corpo das requisições

// Cria a conexão com o banco de dados MySQL
const banco = mysql2.createConnection({
    host: "localhost",      // Endereço do servidor MySQL
    port: 3306,             // Porta padrão do MySQL
    user: "root",           // Nome do usuário do MySQL
    password: "root",       // Senha do usuário
    database: "aulabd"      // Nome do banco de dados que será utilizado
});

// Tenta estabelecer a conexão com o banco de dados
banco.connect((erro) => {
    if (erro) {
        console.log("Erro ao conectar ao MySQL:");
        console.log(erro);
    } else {
        console.log("Conectado ao MySQL com sucesso!");
    }
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
    console.log("Servidor rodando em http://localhost:" + PORT);
});

// Rota para obter todos os alunos
app.get("/alunos", (req, res) => {
    const sql = "SELECT * FROM alunos";

    banco.query(sql, (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao consultar alunos" });
        } else {
            return res.status(200).json(resultados);
        }
    });
});

// Rota para obter um aluno pelo código
app.get("/alunos/:codigo", (req, res) => {
    const { codigo } = req.params;
    const sql = "SELECT * FROM alunos WHERE codigo = ?";

    banco.query(sql, [codigo], (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao consultar aluno" });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        return res.status(200).json(resultados[0]);
    });
});

// Rota para cadastrar um novo aluno
app.post("/alunos", (req, res) => {
    const { nome, cidade, estado } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !cidade || !estado) {
        return res.status(400).json({ error: "Campos nome, cidade e estado são obrigatórios." });
    }

    const sql = "INSERT INTO alunos(nome, cidade, estado) VALUES (?, ?, ?)";

    banco.query(sql, [nome, cidade, estado], (erro, result) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao cadastrar aluno" });
        } else {
            let mensagem = `Aluno ${nome} cadastrado com sucesso com o código ${result.insertId}`;
            console.log(mensagem);
            return res.status(201).json({ message: mensagem });
        }
    });
});

// Rota para atualizar um aluno existente
app.put("/alunos/:id", (req, res) => {
    const { id } = req.params;
    const { nome, cidade, estado } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !cidade || !estado) {
        return res.status(400).json({ error: "Campos nome, cidade e estado são obrigatórios." });
    }

    const sql = "UPDATE alunos SET nome = ?, cidade = ?, estado = ? WHERE codigo = ?";

    banco.query(sql, [nome, cidade, estado, id], (erro, result) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao atualizar o aluno" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        return res.status(200).json({ message: `Aluno com ID ${id} atualizado com sucesso` });
    });
});

// Rota para excluir um aluno
app.delete("/alunos/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM alunos WHERE codigo = ?";

    banco.query(sql, [id], (erro, result) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao excluir aluno" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        return res.status(200).json({ message: `Aluno com ID ${id} excluído com sucesso` });
    });
});