const { sequelize } = require('../../config/database');
const funcionesSQL = require('../../middlewares/funcionesSQL');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO


const getPerfil = async (req, res) => {

    let desde = req.query.desde;
    let consulta = '';
    desde = Number(desde);

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `select * from perfil p order by p.nombre_perfil LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    } else {
        consulta = `select * from perfil p order by p.nombre_perfil `;
    }
    await funcionesSQL.getRows(consulta, req, res);

}

const getPerfilByModulo = async (req, res) => {

    let mod = req.params.mod;
    let consulta = '';
    consulta = `select * from perfil p where p.fk_mod =${mod} order by p.nombre_perfil `;
    console.log(consulta)
    await funcionesSQL.getRows(consulta, req, res);

}

const getPerfilBsq = async (req, res) => {
    let busqueda = req.params.valor;
    const consulta = `select * from perfil p  WHERE p.nombre_perfil LIKE UPPER('%${busqueda}%')`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getPerfilID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from perfil p  WHERE p.pk_perfil=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudPerfil = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_perfil ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getPerfil,
    getPerfilBsq,
    getPerfilByModulo,
    getPerfilID,
    crudPerfil
}