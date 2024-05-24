const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const getAllDiagnostico = async (req, res) => {
    let id_008 = req.params.id_008;
    consulta =`select * from emergencia_diagnosticos diag inner join cie smc on diag.fk_cie = smc.pk_cie where diag.fk_emerg=${id_008} order by diag.pk_emerdiag ASC`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getDiagnosticoID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from emergencia_diagnosticos diag inner join cie smc on diag.fk_cie = smc.pk_cie where diag.pk_emerdiag=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}

const crudDiagnostico = async (req, res) => {
    const accion = req.params.accion;
    const body_json  = req.body;
    const consulta=`select * from emergencia_crud_diagnosticos ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta,req,res);    
}

module.exports = {
    getAllDiagnostico,
    getDiagnosticoID,
    crudDiagnostico
}