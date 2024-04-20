const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO

const getPersonaFacturacion = async (req, res) => {
    let desde = req.query.desde;
    let consulta ='';
    consulta = `select * from persona_facturacion per order by per.apellidopat_personafac ASC, per.apellidomat_personafac ASC `;
    desde = Number(desde);

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = consulta + ` LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    }
    await funcionesSQL.getRows(consulta, req, res);


}

const getPersonaFacturacionBsq = async (req, res) => {
    let busqueda = req.params.valor;
    const consulta = `select * from persona_facturacion per WHERE per.numidentificacion_persona LIKE UPPER('%${busqueda}%') or per.apellidopat_personafac LIKE UPPER('%${busqueda}%') or per.apellidomat_personafac LIKE UPPER('%${busqueda}%') or per.nombre_primario_personafac LIKE UPPER('%${busqueda}%') or per.nombre_secundario_personafac LIKE UPPER('%${busqueda}%')`;
    await funcionesSQL.getRows(consulta, req, res);
}


const getPersonaFacturacionID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from persona_facturacion per WHERE per.pk_personafac=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudPersonaFacturacion = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_persona_facturacion ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}


module.exports = {
    getPersonaFacturacion,
    getPersonaFacturacionID,
    getPersonaFacturacionBsq,
    crudPersonaFacturacion
}