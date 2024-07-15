const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

//* CONSULTA MASTER DE CENSOS TANTO EN INGRESOS O EGRESOS
let consulta_master=`select a.*, cs.casalud_descripcion, m.nombre_mod from 
                    areas a 
                    inner join casas_salud cs on cs.casalud_id_pk= a.casalud_id_fk 
                    inner join modulos m on a.fk_mod = m.pk_mod `;

//Consulta de todas las areas
const getAreasAll = async (req, res) => {
    let consulta = `${consulta_master}`; 
    await funcionesSQL.getRows(consulta, req, res);
}

//Consulta de todas las areas por casa de salud
const getAreasXCasadeSalud = async (req, res) => {
    let casa = req.params.casa;
    let consulta = `${consulta_master} where a.casalud_id_fk = ${casa}`; 
    await funcionesSQL.getRows(consulta, req, res);
}

//Consulta de todas las areas por modulo
const getAreasXModulo = async (req, res) => {
    let modulo = req.params.mod;
    let consulta = `${consulta_master} where a.fk_mod = ${modulo}`; 
    await funcionesSQL.getRows(consulta, req, res);
}

const getAreaXId = async (req, res) => {
    let id = req.params.id;
    const consulta = `${consulta_master} where a.areas_id_pk =${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}

const crudArea = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_areas ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}


module.exports = {
    getAreasAll,
    getAreasXCasadeSalud,
    getAreasXModulo,
    getAreaXId,
    crudArea
}