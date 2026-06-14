// Importa a biblioteca PostgreSQL que instalei com npm install pg
const { Pool } = require("pg");

// Lê as variáveis do arquivo .env
require("dotenv").config();

// Cria uma conexão com o banco PostgreSQL
const pool = new Pool({

    // Pega a string de conexão que coloquei no arquivo .env
    connectionString: process.env.DATABASE_URL

});

// Exporta a conexão para que eu possa usar em outros arquivos
module.exports = pool;