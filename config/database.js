process.loadEnvFile();
require('dotenv').config();

const config = process.env;
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.PASSWORD, {
  host: config.HOST,
  dialect: 'mssql'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Department = require("../models/department.js")(sequelize, Sequelize);
db.Employee = require("../models/employee.js")(sequelize, Sequelize);


module.exports = db;
