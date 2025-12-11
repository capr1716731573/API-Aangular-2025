const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO


const getInecEspecialidadesMedicas = async (req, res) => {

    const isDefined = (v) =>
        v !== undefined &&
        v !== null &&
        v !== '' &&
        v !== 'null' &&
        v !== 'undefined';

    let { estado } = req.params;
    let { desde } = req.query;

    let consulta = 'SELECT * FROM inec_especialidades i';

    // Validación correcta del estado
    if (isDefined(estado)) {
        consulta += ' WHERE i.estado_inecespe = true';
    }

    // Validación correcta de paginación
    if (isDefined(desde) && !isNaN(Number(desde))) {
        desde = Number(desde);
        consulta += ` LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    }

    await funcionesSQL.getRows(consulta, req, res);
};


const getInecEspecialidadesMedicasBsq = async (req, res) => {

    const isTrue = (v) =>
        v === true ||
        v === "true" ||
        v === 1 ||
        v === "1";

    let { estado, valor: busqueda } = req.params;

    let consulta = `SELECT * FROM inec_especialidades i`;

    // Solo aplicar filtro si estado es verdaderamente true
    if (isTrue(estado)) {
        consulta += ` WHERE i.estado_inecespe = true`;
    }

    // Filtro de búsqueda
    consulta += ` ${isTrue(estado) ? "AND" : "WHERE"} i.nombre_inecespe ILIKE ('%${busqueda}%')`;

    await funcionesSQL.getRows(consulta, req, res);
};


const getInecEspecialidadesMedicasID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from inec_especialidades i where i.pk_inecespe=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudInecEspecialidadesMedicas = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_institucion ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getInecEspecialidadesMedicas,
    getInecEspecialidadesMedicasBsq,
    getInecEspecialidadesMedicasID,
    crudInecEspecialidadesMedicas
}