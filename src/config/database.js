//NO IMPORTAR ASI DA PROBLEMAS
//import Sequelize from "sequelize";
const Sequelize = require('sequelize');
require('dotenv').config();

const variablesEntorno = process.env;


const sequelize = new Sequelize(
    variablesEntorno.DB,
    variablesEntorno.USER,
    variablesEntorno.PASSWORD,
    {
        host: variablesEntorno.HOST,
        port: variablesEntorno.PORT,
        dialect: "postgres"
    }
);

module.exports = {
    sequelize
}
