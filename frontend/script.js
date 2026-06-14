// URL da API que está rodando localmente
const API_URL = "http://localhost:3000/tasks";

// Seleciona os elementos do HTML
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");


// Função que busca todas as tarefas no banco
async function carregarTarefas() {

    try {

        // Faz uma requisição GET para a API
        const resposta = await fetch(API_URL);

        // Converte a resposta para JSON
        const tarefas = await resposta.json();

        // Limpa a lista antes de desenhar novamente
        taskList.innerHTML = "";

        // Percorre todas as tarefas recebidas do banco
        tarefas.forEach((tarefa) => {

            // Cria um item da lista para representar uma tarefa
            const li = document.createElement("li");

            // Cria o texto da tarefa
            const taskText = document.createElement("span");
            taskText.textContent = tarefa.title;

            // Se a tarefa estiver concluída, risca o texto
            if (tarefa.completed) {
                taskText.style.textDecoration = "line-through";
            }

            // Cria o botão de concluir
            const completeButton = document.createElement("button");

            // Muda o texto do botão dependendo do status da tarefa
            completeButton.textContent = tarefa.completed ? "Desfazer" : "Concluir";

            // Quando clicar, altera o status da tarefa
            completeButton.addEventListener("click", () => {
                atualizarTarefa(tarefa.id, !tarefa.completed);
            });

            // Cria o botão de excluir
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Excluir";

            // Quando clicar, exclui a tarefa
            deleteButton.addEventListener("click", () => {
                excluirTarefa(tarefa.id);
            });

            // Coloca o texto e os botões dentro do item da lista
            li.appendChild(taskText);
            li.appendChild(completeButton);
            li.appendChild(deleteButton);

            // Adiciona a tarefa na tela
            taskList.appendChild(li);

        });

    } catch (erro) {

        console.error("Erro ao carregar tarefas:", erro);

    }

}


// Função para criar uma nova tarefa
async function criarTarefa() {

    try {

        // Pega o texto digitado no input
        const title = taskInput.value.trim();

        // Impede criar tarefa vazia
        if (!title) {
            alert("Digite uma tarefa!");
            return;
        }

        // Envia a tarefa para a API salvar no banco
        await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title
            })

        });

        // Limpa o campo depois de adicionar
        taskInput.value = "";

        // Atualiza a lista na tela
        carregarTarefas();

    } catch (erro) {

        console.error("Erro ao criar tarefa:", erro);

    }

}


// Função para atualizar uma tarefa
async function atualizarTarefa(id, completed) {

    try {

        // Envia para a API o novo status da tarefa
        await fetch(`${API_URL}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                completed: completed
            })

        });

        // Atualiza a lista após alterar
        carregarTarefas();

    } catch (erro) {

        console.error("Erro ao atualizar tarefa:", erro);

    }

}


// Função para excluir uma tarefa
async function excluirTarefa(id) {

    try {

        // Envia uma requisição DELETE para a API
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        // Atualiza a lista depois de excluir
        carregarTarefas();

    } catch (erro) {

        console.error("Erro ao excluir tarefa:", erro);

    }

}


// Quando clicar no botão Adicionar, cria uma tarefa
addButton.addEventListener("click", criarTarefa);

// Quando a página abrir, carrega as tarefas do banco
carregarTarefas();