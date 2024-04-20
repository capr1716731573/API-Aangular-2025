const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO

const getIvaParametros = async (req, res) => {

    let consulta = ''; 
    consulta = `select * from iva_valores iva order by iva.codigo_iva `;
    await funcionesSQL.getRows(consulta, req, res);

}

const getIvaParametrosID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from iva_valores iva WHERE iva.pk_iva=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}

const crudIvaParametros = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_iva_parametros ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}


module.exports = {
    getIvaParametros,
    getIvaParametrosID,
    crudIvaParametros
}