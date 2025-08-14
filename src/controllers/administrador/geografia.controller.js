const { sequelize } = require('../../config/database');
const funcionesSQL = require('../../middlewares/funcionesSQL');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO

const getGeografia = async (req, res) => {

    /** ESPECIFICACION DE TIPO */
    // P: PAIS
    // PR: PROVINCIA
    // CIU: CIUDAD
    // PRR: PARROQUIA

    let desde = req.query.desde;
    let tipoGeografia =(req.query.tipo).toUpperCase(); 
    let padre = req.query.padre; 
    let consulta = '';
    desde = Number(desde);

    if(padre === undefined || padre === null || padre <= 0 || padre === ""){
        consulta = `select * from geografia geo where geo.tipo_geo = '${tipoGeografia}' `;
    }else{
        consulta = `select * from geografia geo where geo.tipo_geo = '${tipoGeografia}' and  geo.fk_padre=${padre} `;
    }

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `${consulta} order by geo.desc_geo  LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    } else {
        consulta = `${consulta} order by geo.desc_geo  `;
    }
    await funcionesSQL.getRows(consulta, req, res);

}

const getGeografiaCantonesPais = async (req, res) => {

    let padre = req.query.padre; 
    let consulta = '';

    consulta =`select c.* from geografia c inner join geografia p on c.fk_padre = p.pk_geo where p.fk_padre =${padre}`;

    await funcionesSQL.getRows(consulta, req, res);

}

const getGeografiaXTipo = async (req, res) => {

    let tipo = req.params.tipo; 
    let consulta = '';

    consulta =`select c.* from geografia c where c.tipo_geo ='${tipo}' order by c.desc_geo ASC`;

    await funcionesSQL.getRows(consulta, req, res);

}


const getGeografiaBsq = async (req, res) => {
    let busqueda = req.params.valor;
    let tipoGeografia =(req.query.tipo).toUpperCase(); 
    let padre = req.query.padre;
    let consulta = '';

    if(padre === undefined || padre === null || padre <= 0 || padre === ""){
        consulta = `select * from geografia geo where geo.tipo_geo = '${tipoGeografia}' `;
    }else{
        consulta = `select * from geografia geo where geo.tipo_geo = '${tipoGeografia}' and  geo.fk_padre=${padre} `;
    }
    
    consulta = `${consulta} and desc_geo LIKE UPPER('%${busqueda}%')`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getGeografiaBsqPad = async (req, res) => {
    let busqueda = req.params.valor;
    let tipoGeografia =(req.query.tipo).toUpperCase(); 
    let padre = req.query.padre;
    let consulta = '';

    if(padre === undefined || padre === null || padre <= 0 || padre === ""){
        consulta = `select * from geografia geo where geo.tipo_geo = '${tipoGeografia}' `;
    }else{
        consulta = `select * from geografia geo where geo.tipo_geo = '${tipoGeografia}' and  geo.fk_padre=${padre} `;
    }
    
    await funcionesSQL.getRows(consulta, req, res);
}

const getGeografiaID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select geo.pk_geo,geo.fk_padre, geo.tipo_geo, geo.desc_geo, padre.pk_geo as padre_pk_geo ,padre.fk_padre as padre_fk_padre, padre.tipo_geo as padre_tipo_geo, padre.desc_geo as padre_desc_geo from geografia geo inner join geografia padre on geo.pk_geo=padre.pk_geo where geo.pk_geo =${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudGeografia = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_geografia ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getGeografia,
    getGeografiaBsq,
    getGeografiaID,
    getGeografiaXTipo,
    getGeografiaCantonesPais,
    crudGeografia,
    getGeografiaBsqPad
}