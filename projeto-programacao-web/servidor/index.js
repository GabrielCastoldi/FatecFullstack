const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors()); // Habilita o CORS para permitir requisições do seu frontend React
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Configuração da conexão com o banco de dados MySQL
const banco = mysql2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "livraria"
});

// Conecta ao banco de dados
banco.connect((erro) => {
    if (erro) {
        console.error("Erro ao conectar ao MySQL:", erro);
    } else {
        console.log("Conectado ao MySQL com sucesso!");
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log("Servidor rodando em http://localhost:" + PORT);
});


// ------------------- ROTAS PARA AUTORES -------------------

// GET: Retorna todos os autores
app.get("/autores", (req, res) => {
    banco.query("SELECT * FROM autores", (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar autores:", erro);
            return res.status(500).json({ error: "Erro ao buscar autores" });
        }
        return res.status(200).json(resultados);
    });
});

// GET: Retorna um autor pelo ID
app.get("/autores/:id", (req, res) => {
    const { id } = req.params;
    banco.query("SELECT * FROM autores WHERE id_autor = ?", [id], (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar autor:", erro);
            return res.status(500).json({ error: "Erro ao buscar autor" });
        }
        if (resultados.length === 0) {
            return res.status(404).json({ message: "Autor não encontrado" });
        }
        return res.status(200).json(resultados[0]);
    });
});

// POST: Cadastra um novo autor
app.post("/autores", (req, res) => {
    const { nome, pais } = req.body;
    if (!nome || !pais) {
        return res.status(400).json({ error: "Campos 'nome' e 'país' são obrigatórios." });
    }
    banco.query("INSERT INTO autores(nome, pais) VALUES (?, ?)", [nome, pais], (erro, result) => {
        if (erro) {
            console.error("Erro ao inserir autor:", erro);
            return res.status(500).json({ error: "Erro ao inserir autor" });
        }
        return res.status(201).json({ message: `Autor ${nome} cadastrado com ID ${result.insertId}.` });
    });
});

// PUT: Atualiza um autor pelo ID
app.put("/autores/:id", (req, res) => {
    const { id } = req.params;
    const { nome, pais } = req.body;
    if (!nome || !pais) {
        return res.status(400).json({ error: "Campos 'nome' e 'país' são obrigatórios." });
    }
    banco.query("UPDATE autores SET nome = ?, pais = ? WHERE id_autor = ?", [nome, pais, id], (erro, result) => {
        if (erro) {
            console.error("Erro ao atualizar autor:", erro);
            return res.status(500).json({ error: "Erro ao atualizar autor" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Autor não encontrado." });
        }
        return res.status(200).json({ message: `Autor atualizado com sucesso.` });
    });
});

// DELETE: Exclui um autor pelo ID
app.delete("/autores/:id", (req, res) => {
    const { id } = req.params;
    banco.query("DELETE FROM autores WHERE id_autor = ?", [id], (erro, result) => {
        if (erro) {
            console.error("Erro ao excluir autor:", erro);
            return res.status(500).json({ error: "Erro ao excluir autor." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Autor não encontrado." });
        }
        return res.status(200).json({ message: `Autor excluído com sucesso.` });
    });
});


// ------------------- ROTAS PARA LIVROS -------------------

// GET: Retorna todos os livros
app.get("/livros", (req, res) => {
    banco.query("SELECT * FROM livros", (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar livros:", erro);
            return res.status(500).json({ error: "Erro ao buscar livros" });
        }
        return res.status(200).json(resultados);
    });
});

// GET: Retorna um livro pelo ID
app.get("/livros/:id", (req, res) => {
    const { id } = req.params;
    banco.query("SELECT * FROM livros WHERE id_livro = ?", [id], (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar livro:", erro);
            return res.status(500).json({ error: "Erro ao buscar livro" });
        }
        if (resultados.length === 0) {
            return res.status(404).json({ message: "Livro não encontrado" });
        }
        return res.status(200).json(resultados[0]);
    });
});

// POST: Cadastra um novo livro
app.post("/livros", (req, res) => {
    const { titulo, preco, estoque, id_autor } = req.body;
    // Validações
    if (!titulo || preco == null || estoque == null || !id_autor) {
        return res.status(400).json({ error: "Todos os campos (titulo, preco, estoque, id_autor) são obrigatórios." });
    }
    if (isNaN(parseFloat(preco)) || parseFloat(preco) <= 0) {
        return res.status(400).json({ error: "Preço inválido. Deve ser um número maior que zero." });
    }
    if (isNaN(parseInt(estoque, 10)) || parseInt(estoque, 10) < 0) {
        return res.status(400).json({ error: "Estoque inválido. Deve ser um número inteiro não negativo." });
    }

    banco.query("INSERT INTO livros(titulo, preco, estoque, id_autor) VALUES (?, ?, ?, ?)",
        [titulo, parseFloat(preco), parseInt(estoque, 10), id_autor], (erro, result) => {
            if (erro) {
                console.error("Erro ao inserir livro:", erro);
                // Erro de chave estrangeira (autor não existe)
                if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({ error: "ID do autor não existe." });
                }
                return res.status(500).json({ error: "Erro ao inserir livro." });
            }
            return res.status(201).json({ message: `Livro "${titulo}" cadastrado com sucesso com ID ${result.insertId}.` });
        });
});

// PUT: Atualiza um livro pelo ID
app.put("/livros/:id", (req, res) => {
    const { id } = req.params;
    const { titulo, preco, estoque, id_autor } = req.body;
    // Validações
    if (!titulo || preco == null || estoque == null || !id_autor) {
        return res.status(400).json({ error: "Todos os campos (titulo, preco, estoque, id_autor) são obrigatórios para atualização." });
    }
    if (isNaN(parseFloat(preco)) || parseFloat(preco) <= 0) {
        return res.status(400).json({ error: "Preço inválido. Deve ser um número maior que zero." });
    }
    if (isNaN(parseInt(estoque, 10)) || parseInt(estoque, 10) < 0) {
        return res.status(400).json({ error: "Estoque inválido. Deve ser um número inteiro não negativo." });
    }

    banco.query("UPDATE livros SET titulo = ?, preco = ?, estoque = ?, id_autor = ? WHERE id_livro = ?",
        [titulo, parseFloat(preco), parseInt(estoque, 10), id_autor, id], (erro, result) => {
            if (erro) {
                console.error("Erro ao atualizar livro:", erro);
                if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({ error: "ID do autor não existe." });
                }
                return res.status(500).json({ error: "Erro ao atualizar livro." });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Livro não encontrado." });
            }
            return res.status(200).json({ message: `Livro atualizado com sucesso.` });
        });
});

// DELETE: Exclui um livro pelo ID
app.delete("/livros/:id", (req, res) => {
    const { id } = req.params;
    banco.query("DELETE FROM livros WHERE id_livro = ?", [id], (erro, result) => {
        if (erro) {
            console.error("Erro ao excluir livro:", erro);
            // Considerar erros de chave estrangeira se houver itens de venda associados
            if (erro.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ error: "Não é possível excluir o livro, pois ele está associado a um ou mais itens de venda." });
            }
            return res.status(500).json({ error: "Erro ao excluir livro." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Livro não encontrado." });
        }
        return res.status(200).json({ message: `Livro excluído com sucesso.` });
    });
});


// ------------------- ROTAS PARA VENDAS -------------------

// GET: Retorna todas as vendas
app.get("/vendas", (req, res) => {
    banco.query("SELECT * FROM vendas", (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar vendas:", erro);
            return res.status(500).json({ error: "Erro ao buscar vendas" });
        }
        return res.status(200).json(resultados);
    });
});

// GET: Retorna uma venda pelo ID (Adicionado)
app.get("/vendas/:id", (req, res) => {
    const { id } = req.params;
    banco.query("SELECT * FROM vendas WHERE id_venda = ?", [id], (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar venda:", erro);
            return res.status(500).json({ error: "Erro ao buscar venda" });
        }
        if (resultados.length === 0) {
            return res.status(404).json({ message: "Venda não encontrada" });
        }
        return res.status(200).json(resultados[0]);
    });
});

// POST: Registra uma nova venda
app.post("/vendas", (req, res) => {
    const { data_venda } = req.body;
    if (!data_venda) {
        return res.status(400).json({ error: "Data da venda é obrigatória." });
    }
    // Validação de formato de data (opcional, mas bom ter)
    if (isNaN(new Date(data_venda).getTime())) {
        return res.status(400).json({ error: "Formato de data inválido." });
    }

    banco.query("INSERT INTO vendas(data_venda) VALUES (?)", [data_venda], (erro, result) => {
        if (erro) {
            console.error("Erro ao inserir venda:", erro);
            return res.status(500).json({ error: "Erro ao registrar venda." });
        }
        return res.status(201).json({ message: `Venda registrada com sucesso com ID ${result.insertId}.` });
    });
});

// PUT: Atualiza uma venda pelo ID (Adicionado - considere a necessidade)
app.put("/vendas/:id", (req, res) => {
    const { id } = req.params;
    const { data_venda } = req.body;
    if (!data_venda) {
        return res.status(400).json({ error: "Data da venda é obrigatória para atualização." });
    }
    if (isNaN(new Date(data_venda).getTime())) {
        return res.status(400).json({ error: "Formato de data inválido." });
    }

    banco.query("UPDATE vendas SET data_venda = ? WHERE id_venda = ?", 
        [data_venda, id], (erro, result) => {
        if (erro) {
            console.error("Erro ao atualizar venda:", erro);
            return res.status(500).json({ error: "Erro ao atualizar venda." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Venda não encontrada." });
        }
        return res.status(200).json({ message: `Venda atualizada com sucesso.` });
    });
});

// DELETE: Exclui uma venda pelo ID (Adicionado - CUIDADO com dependências)
// ATENÇÃO: É CRÍTICO lidar com os itens de venda associados.
// Se sua tabela `itens_venda` tiver `ON DELETE CASCADE` na chave estrangeira `id_venda`, o MySQL cuidará disso automaticamente.
// Caso contrário, você deve primeiro excluir os itens de venda ANTES de excluir a venda, ou usar uma transação como mostrado abaixo.
app.delete("/vendas/:id", (req, res) => {
    const { id } = req.params;
    banco.getConnection((err, connection) => { // Usar pool de conexão se tiver, ou garantir que a conexão é liberada
        if (err) {
            console.error("Erro ao obter conexão do banco:", err);
            return res.status(500).json({ error: "Erro ao obter conexão do banco." });
        }
        connection.beginTransaction(async (transactionErr) => {
            if (transactionErr) {
                connection.release();
                console.error("Erro ao iniciar transação:", transactionErr);
                return res.status(500).json({ error: "Erro ao iniciar transação." });
            }

            try {
                // 1. Excluir itens de venda associados a esta venda
                await connection.promise().query("DELETE FROM itens_venda WHERE id_venda = ?", [id]);

                // 2. Excluir a venda
                const [result] = await connection.promise().query("DELETE FROM vendas WHERE id_venda = ?", [id]);

                if (result.affectedRows === 0) {
                    // Se a venda não foi encontrada, reverte e retorna 404
                    connection.rollback(() => connection.release());
                    return res.status(404).json({ message: "Venda não encontrada." });
                }

                connection.commit(() => {
                    connection.release();
                    return res.status(200).json({ message: `Venda e seus itens associados excluídos com sucesso.` });
                });
            } catch (queryError) {
                // Em caso de erro, reverte a transação
                connection.rollback(() => connection.release());
                console.error("Erro durante a exclusão da venda e seus itens:", queryError);
                return res.status(500).json({ error: "Erro ao excluir venda e seus itens." });
            }
        });
    });
});


// ------------------- ROTAS PARA ITENS DE VENDA -------------------

// GET: Retorna todos os itens de venda
app.get("/itens-venda", (req, res) => {
    banco.query("SELECT * FROM itens_venda", (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar itens de venda:", erro);
            return res.status(500).json({ error: "Erro ao buscar itens de venda" });
        }
        return res.status(200).json(resultados);
    });
});

// GET: Retorna um item de venda pelo ID (Adicionado)
app.get("/itens-venda/:id", (req, res) => {
    const { id } = req.params;
    banco.query("SELECT * FROM itens_venda WHERE id_item_venda = ?", [id], (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar item de venda:", erro);
            return res.status(500).json({ error: "Erro ao buscar item de venda" });
        }
        if (resultados.length === 0) {
            return res.status(404).json({ message: "Item de venda não encontrado" });
        }
        return res.status(200).json(resultados[0]);
    });
});

// POST: Cadastra um novo item de venda
app.post("/itens-venda", (req, res) => {
    const { id_livro, id_venda, quantidade, preco_unitario } = req.body;
    // Validações
    if (!id_livro || !id_venda || quantidade == null || preco_unitario == null) {
        return res.status(400).json({ error: "Todos os campos (id_livro, id_venda, quantidade, preco_unitario) são obrigatórios." });
    }
    if (isNaN(parseInt(quantidade, 10)) || parseInt(quantidade, 10) <= 0) {
        return res.status(400).json({ error: "Quantidade inválida. Deve ser um número inteiro positivo." });
    }
    if (isNaN(parseFloat(preco_unitario)) || parseFloat(preco_unitario) <= 0) {
        return res.status(400).json({ error: "Preço unitário inválido. Deve ser um número maior que zero." });
    }

    banco.query("INSERT INTO itens_venda(id_livro, id_venda, quantidade, preco_unitario) VALUES (?, ?, ?, ?)",
        [id_livro, id_venda, parseInt(quantidade, 10), parseFloat(preco_unitario)], (erro, result) => {
            if (erro) {
                console.error("Erro ao inserir item de venda:", erro);
                // Erros de chave estrangeira (livro ou venda não existe)
                if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({ error: "ID do livro ou da venda não existe." });
                }
                return res.status(500).json({ error: "Erro ao inserir item de venda." });
            }
            return res.status(201).json({ message: `Item de venda cadastrado com sucesso com ID ${result.insertId}.` });
        });
});

// PUT: Atualiza um item de venda pelo ID (Adicionado)
app.put("/itens-venda/:id", (req, res) => {
    const { id } = req.params;
    const { id_livro, id_venda, quantidade, preco_unitario } = req.body;
    // Validações
    if (!id_livro || !id_venda || quantidade == null || preco_unitario == null) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios para atualização." });
    }
    if (isNaN(parseInt(quantidade, 10)) || parseInt(quantidade, 10) <= 0) {
        return res.status(400).json({ error: "Quantidade inválida. Deve ser um número inteiro positivo." });
    }
    if (isNaN(parseFloat(preco_unitario)) || parseFloat(preco_unitario) <= 0) {
        return res.status(400).json({ error: "Preço unitário inválido. Deve ser um número maior que zero." });
    }

    banco.query("UPDATE itens_venda SET id_livro = ?, id_venda = ?, quantidade = ?, preco_unitario = ? WHERE id_item_venda = ?",
        [id_livro, id_venda, parseInt(quantidade, 10), parseFloat(preco_unitario), id], (erro, result) => {
            if (erro) {
                console.error("Erro ao atualizar item de venda:", erro);
                if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({ error: "ID do livro ou da venda não existe." });
                }
                return res.status(500).json({ error: "Erro ao atualizar item de venda." });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Item de venda não encontrado." });
            }
            return res.status(200).json({ message: `Item de venda atualizado com sucesso.` });
        });
});

// DELETE: Exclui um item de venda pelo ID (Adicionado)
app.delete("/itens-venda/:id", (req, res) => {
    const { id } = req.params;
    banco.query("DELETE FROM itens_venda WHERE id_item_venda = ?", [id], (erro, result) => {
        if (erro) {
            console.error("Erro ao excluir item de venda:", erro);
            return res.status(500).json({ error: "Erro ao excluir item de venda." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item de venda não encontrado." });
        }
        return res.status(200).json({ message: `Item de venda excluído com sucesso.` });
    });
});