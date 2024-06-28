const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL Pool initialization
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE, // Specify the database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Ensure the database is selected
pool.query('USE task_manager')
    .then(() => console.log('Database selected: task_manager'))
    .catch(err => console.error('Error selecting database:', err.message));

module.exports = pool;