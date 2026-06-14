// Importa a biblioteca PostgreSQL
const { Pool } = require("pg");

// Lê o arquivo .env quando estiver rodando localmente
require("dotenv").config();

// Cria a conexão com o banco PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // Necessário para conexão com Supabase no ambiente do Render
    ssl: {
        rejectUnauthorized: false
    }
});

// Exporta a conexão para usar no server.js
module.exports = pool;