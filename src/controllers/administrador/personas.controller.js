const {sequelize} = require('../../config/database');
const funcionesSQL = require('../../middlewares/funcionesSQL');

require('dotenv').config();

const variablesEntorno=process.env;

const crudPersona= async (req,res) => {
    const accion = req.params.accion;
    const body_json  = req.body;
    const consulta=`select * from crud_persona ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta,req,res);
}

module.exports={
    crudPersona
}