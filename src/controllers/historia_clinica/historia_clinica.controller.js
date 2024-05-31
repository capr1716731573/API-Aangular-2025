const { sequelize } = require('../../config/database');
const funcionesSQL = require('../../middlewares/funcionesSQL');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const variablesEntorno = process.env;

//* CRUD DE LA TABLA HISTORIA CLINICA
let opciones={
    "busqueda":null,
    "reg_desde": null,
    "reg_cantidad:":variablesEntorno.ROWS_X_PAGE
  };


const getAllHCU = async (req, res) => {

    let desde = req.query.desde;
    let consulta = '';
    desde = Number(desde);
    //valido que exista el parametro "desde"
    if (req.query.desde) {        
        opciones.reg_desde=desde;   
    } else {
        opciones.reg_desde=0;
    }
    consulta = `select * from getall_hcu('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);

}

const getHCUBsq = async (req, res) => {
    let busqueda = req.params.valor;
    opciones.busqueda=busqueda;
    opciones.reg_desde=null;
    opciones.reg_cantidad=null;
    const consulta = `select * from getall_hcu('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getHCUID = async (req, res) => {
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from getid_hcu(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const crudHCU = async (req, res) => {
    const accion = req.params.accion;
    const body_json  = req.body;
    const consulta=`select * from crud_historia_clinica ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta,req,res);
    
}


module.exports = {
    getAllHCU,
    getHCUBsq,
    getHCUID,
    crudHCU
}