const { Sequelize } = require("sequelize");

const database = new Sequelize("task_manager", "root", "Kalyan@99", {
    host: "localhost",
    port: 3306, 
    dialect: "mysql",
  });
  

module.exports = database;

