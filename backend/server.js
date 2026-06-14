// Importa o Express para criar a API
const express = require("express");

// Importa o CORS para permitir acesso do front-end
const cors = require("cors");

// Importa a conexão com o banco criada no db.js
const pool = require("./db");

// Cria a aplicação Express.
// A variável app representa minha API.
const app = express();

// Permite que o front-end faça requisições para a API
app.use(cors());

// Permite receber dados em JSON
app.use(express.json());


// Rota inicial apenas para verificar se a API está funcionando
app.get("/", (req, res) => {
    res.send("API To-Do List funcionando!");
});


// Rota para testar a conexão com o PostgreSQL
app.get("/test-db", async (req, res) => {

    try {

        // Executa uma consulta simples no banco
        const result = await pool.query("SELECT NOW()");

        // Retorna a data e hora do PostgreSQL
        res.json({
            mensagem: "Conexão com PostgreSQL funcionando!",
            dataHoraBanco: result.rows[0]
        });

    } catch (erro) {

        // Mostra o erro no terminal
        console.error(erro);

        // Retorna erro para o navegador
        res.status(500).json({
            erro: "Falha ao conectar no banco"
        });

    }

});
// Rota para listar todas as tarefas cadastradas
app.get("/tasks", async (req, res) => {

    try {

        // Busca todas as tarefas da tabela tasks
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY id"
        );

        // Retorna as tarefas encontradas
        res.json(result.rows);

    } catch (erro) {

        // Mostra o erro no terminal
        console.error(erro);

        // Retorna erro para o navegador
        res.status(500).json({
            erro: "Erro ao buscar tarefas"
        });

    }

});
// Rota para cadastrar uma nova tarefa
app.post("/tasks", async (req, res) => {

    try {

        // Recebe o título enviado pelo usuário
        const { title } = req.body;

        // Verifica se o título foi informado
        if (!title) {

            return res.status(400).json({
                erro: "O título da tarefa é obrigatório"
            });

        }

        // Insere a tarefa no PostgreSQL
        const result = await pool.query(

            `INSERT INTO tasks (title)
             VALUES ($1)
             RETURNING *`,

            [title]

        );

        // Retorna a tarefa criada
        res.status(201).json(result.rows[0]);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao criar tarefa"
        });

    }

});

// Rota para excluir uma tarefa
app.delete("/tasks/:id", async (req, res) => {

    try {

        // Recebe o id enviado pela URL
        const { id } = req.params;

        // Remove a tarefa do banco
        await pool.query(
            "DELETE FROM tasks WHERE id = $1",
            [id]
        );

        // Retorna mensagem de sucesso
        res.json({
            mensagem: "Tarefa removida com sucesso"
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao remover tarefa"
        });

    }

});

// Rota para atualizar uma tarefa como concluída ou não concluída
app.put("/tasks/:id", async (req, res) => {

    try {

        // Pega o id da tarefa pela URL
        const { id } = req.params;

        // Pega o novo status enviado pelo front-end
        const { completed } = req.body;

        // Atualiza o campo completed no banco
        const result = await pool.query(

            `UPDATE tasks
             SET completed = $1
             WHERE id = $2
             RETURNING *`,

            [completed, id]

        );

        // Retorna a tarefa atualizada
        res.json(result.rows[0]);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao atualizar tarefa"
        });

    }

});

// Porta onde a API ficará disponível
const PORT = 3000;

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});