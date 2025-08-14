const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO


const getCasaSalud= async (req, res) => {

    let desde = req.query.desde;
    let consulta = '';
    desde = Number(desde);

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `select cs.*,i.* , g.* from casas_salud cs left join institucion i on cs.ins_id_fk = i.ins_id_pk left join geografia g on cs.fk_geo = g.pk_geo LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    } else {
        consulta = `select cs.*,i.* , g.* from casas_salud cs left join institucion i on cs.ins_id_fk = i.ins_id_pk left join geografia g on cs.fk_geo = g.pk_geo `;
    }
    await funcionesSQL.getRows(consulta, req, res);

}

const getCasaSaludPrincipal = async (req, res) => {
    const consulta = `select cs.*,i.* , g.* from casas_salud cs left join institucion i on cs.ins_id_fk = i.ins_id_pk left join geografia g on cs.fk_geo = g.pk_geo where cs.casalud_principal =true limit 1`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const getCasaSaludBsq = async (req, res) => {
    let busqueda = req.params.valor;
    const consulta = `select cs.*,i.* , g.* from casas_salud cs left join institucion i on cs.ins_id_fk = i.ins_id_pk left join geografia g on cs.fk_geo = g.pk_geo WHERE cs.casalud_descripcion LIKE UPPER('%${busqueda}%')`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getCasaSaludID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select cs.*,i.* , g.desc_geo from casas_salud cs left join institucion i on cs.ins_id_fk = i.ins_id_pk left join geografia g on cs.fk_geo = g.pk_geo WHERE cs.casalud_id_pk=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudCasaSalud= async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_casasalud ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getCasaSalud,
    getCasaSaludBsq,
    getCasaSaludPrincipal,
    getCasaSaludID,
    crudCasaSalud
}