const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

//* CONSULTA MASTER DE CENSOS TANTO EN INGRESOS O EGRESOS
let consulta_master=`select tu.*,
                    (CASE
                        WHEN tu.tipo_tipoubi = 'T' THEN 'TORRE'
                        WHEN tu.tipo_tipoubi = 'P' THEN 'PISO'
                        WHEN tu.tipo_tipoubi = 'S' THEN 'SALA'
                        ELSE 'HABITACIÓN'
                    END) as tipo 
                    from tipo_ubicacion tu `;

//Consulta de todas los tipos de ubicacion
const getTipoUbicacionAll = async (req, res) => {
    let consulta = `${consulta_master}`; 
    await funcionesSQL.getRows(consulta, req, res);
}

//Consulta de todas tipos buscados por tipo de ubicacoin
const getTipoUbicacionXTipo = async (req, res) => {
    let tipo = req.params.tipo;
    let consulta = `${consulta_master} where tu.tipo_tipoubi = '${tipo}'`; 
    await funcionesSQL.getRows(consulta, req, res);
}

//Consulta de tipo de ubicacion x id
const getTipoUbicacionXId = async (req, res) => {
    let id = req.params.id;
    const consulta = `${consulta_master} where tu.pk_tipoubi =${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}

const crudTipoUbicacion = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_tipo_ubicacion ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}


module.exports = {
    getTipoUbicacionAll,
    getTipoUbicacionXTipo,
    getTipoUbicacionXId,
    crudTipoUbicacion
}