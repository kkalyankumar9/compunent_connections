
const mysql = require('mysql2');
require("dotenv").config(); 
const pool = mysql.createPool({
    host:process.env.HOST,
    user     : process.env.USER,
    password : process.env.PASSWORD,
    database: 'task_manager'
});

module.exports = pool.promise();


