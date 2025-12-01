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
        dialect: "postgres",
        logging: true,
        timezone: '-05:00',              // muy importante
        dialectOptions: {
            useUTC: false,                 // si quieres trabajar en hora local
        },
    }
);

module.exports = {
    sequelize
}
