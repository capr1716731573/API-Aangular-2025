const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO


const getInstituciones= async (req, res) => {

    let desde = req.query.desde;
    let consulta = '';
    desde = Number(desde);

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `select * from institucion i LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    } else {
        consulta = `select * from institucion i `;
    }
    await funcionesSQL.getRows(consulta, req, res);

}

const getInstitucionesBsq = async (req, res) => {
    let busqueda = req.params.valor;
    const consulta = `select * from institucion i where i.ins_descripcion LIKE UPPER('%${busqueda}%')`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getInstitucionesID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from institucion i where i.ins_id_pk=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudInstituciones= async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_institucion ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getInstituciones,
    getInstitucionesBsq,
    getInstitucionesID,
    crudInstituciones
}