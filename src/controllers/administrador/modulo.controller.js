const { sequelize } = require('../../config/database');
const funcionesSQL = require('../../middlewares/funcionesSQL');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO


const getModulo = async (req, res) => {

    let desde = req.query.desde;
    let consulta = '';
    desde = Number(desde);

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `select * from modulo p order by p.nombre_mod LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    } else {
        consulta = `select * from modulo p order by p.nombre_mod `;
    }
    await funcionesSQL.getRows(consulta, req, res);

}

const getModuloBsq = async (req, res) => {
    let busqueda = req.params.valor;
    const consulta = `select * from modulo p  WHERE p.nombre_mod LIKE UPPER('%${busqueda}%')`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getModuloID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from modulo p  WHERE p.pk_modulo=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudModulo = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_modulo ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getModulo,
    getModuloBsq,
    getModuloID,
    crudModulo
}