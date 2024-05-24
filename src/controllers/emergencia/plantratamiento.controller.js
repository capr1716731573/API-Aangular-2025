const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const getAllTratamiento = async (req, res) => {
    let id_008 = req.params.id_008;
    consulta =`select * from emergencia_plan_tratamiento plan where plan.fk_emerg=${id_008} order by plan.pk_plantra ASC`;
    await funcionesSQL.getRows(consulta, req, res);
}


const getTratamientoID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from emergencia_plan_tratamiento plan where plan.pk_emerdiag=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}

const crudTratamiento = async (req, res) => {
    const accion = req.params.accion;
    const body_json  = req.body;
    const consulta=`select * from emergencia_crud_plan_tratamiento ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta,req,res);    
}

module.exports = {
    getAllTratamiento,
    getTratamientoID,
    crudTratamiento
}