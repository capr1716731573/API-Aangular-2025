const { sequelize } = require('../../config/database');
const funcionesSQL = require('../../middlewares/funcionesSQL');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO

const getCatalogosCabecera = async (req, res) => {

    let desde = req.query.desde;
    let consulta = '';
    desde = Number(desde);

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `select * from catalogo_cabecera cc order by cc.descripcion_catcab LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    } else {
        consulta = `select * from catalogo_cabecera cc order by cc.descripcion_catcab `;
    }
    await funcionesSQL.getRows(consulta, req, res);

}

const getCatalogosCabeceraBsq = async (req, res) => {
    let busqueda = req.params.valor;
    const consulta = `select * from catalogo_cabecera  WHERE descripcion_catcab LIKE UPPER('%${busqueda}%')`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getCatalogosCabeceraID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from catalogo_cabecera WHERE  pk_catcab=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}

const crudCatalogosCabecera = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_catalogo_cabecera ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}


/* CODIGO DE LA TABAL DE DETALLES DE CATALOGO */

const getCatalogosDetalle = async (req, res) => {
    let padre_cab = req.params.padre;
    let estado = req.params.estado;
    let desde = req.query.desde;
    let consulta ='';
    
    if (req.params.estado) {
        estado=true;
        consulta = `select * from catalogo_detalle cd inner join catalogo_cabecera cc on cd.fk_catcabecera = cc.pk_catcab where cc.codigo_catcab = '${padre_cab}' and cd.estado_catdetalle = ${estado} order by cd.desc_catdetalle asc`;
    }else{
        consulta = `select * from catalogo_detalle cd inner join catalogo_cabecera cc on cd.fk_catcabecera = cc.pk_catcab where cc.codigo_catcab = '${padre_cab}' order by cd.desc_catdetalle asc`;
    }
    console.log(consulta);
    desde = Number(desde);

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = consulta + ` LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    }
    await funcionesSQL.getRows(consulta, req, res);

}

const getCatalogosDetalleBsq = async (req, res) => {
    let padre_cab = req.params.padre;
    let busqueda = req.params.valor;
    const consulta = `select * from catalogo_detalle cd inner join catalogo_cabecera cc on cd.fk_catcabecera = cc.pk_catcab where cc.codigo_catcab = '${padre_cab}' and desc_catdetalle LIKE UPPER('%${busqueda}%')`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getCatalogosDetalleID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from catalogo_detalle cd inner join catalogo_cabecera cc on cd.fk_catcabecera = cc.pk_catcab where cd.pk_catdetalle =${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}

const crudCatalogosDetalle = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_catalogo_detalle ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getCatalogosCabecera,
    getCatalogosCabeceraBsq,
    getCatalogosCabeceraID,
    crudCatalogosCabecera,
    getCatalogosDetalle,
    getCatalogosDetalleBsq,
    getCatalogosDetalleID,
    crudCatalogosDetalle
}