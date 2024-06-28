const { Sequelize } = require('sequelize');

const database = new Sequelize('task_manager', 'root', 'Kalyan@99', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = database;
