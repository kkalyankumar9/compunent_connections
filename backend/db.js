const { Sequelize } = require("sequelize");
require('dotenv').config();
const database = new Sequelize(
    process.env.DATABASE, process.env.USER,  process.env.PASSWORD, {
  host: "localhost",
  dialect: "mysql",
});

module.exports = database;

