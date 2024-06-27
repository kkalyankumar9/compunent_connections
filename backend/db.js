
const mysql = require('mysql2');
require("dotenv").config(); 
const pool = mysql.createPool({
    host: 'localhost',
    user     : process.env.USER,
    password : process.env.PASSWORD,
    database: 'task_manager'
});

module.exports = pool.promise();
