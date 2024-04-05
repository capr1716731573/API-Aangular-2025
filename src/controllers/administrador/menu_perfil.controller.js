const { sequelize } = require('../../config/database');
const funcionesSQL = require('../../middlewares/funcionesSQL');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO


const getMenuAll = async (req, res) => {
    
    let consulta = 'select * from get_menu_all()';
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);

}

const getMenuAllByPerfil = async (req, res) => {
    let perfil = req.params.perfil;
    let estado = req.params.estado;
    let consulta = `select * from get_menu_perfil(${estado},${perfil})`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);

}


const crudMenu = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_menu ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const crudMenuPerfil = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_menu_perfil ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}


module.exports = {
    getMenuAll,
    getMenuAllByPerfil,
    crudMenu,
    crudMenuPerfil
}