const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

//* CONSULTA MASTER DE CENSOS TANTO EN INGRESOS O EGRESOS
let consulta_master=`select 
                    u.*,
                    (CASE
                        WHEN u.estado_ubicacion = 'O' THEN 'OCUPADA'
                        WHEN u.estado_ubicacion = 'D' THEN 'DESOCUPADA'
                        WHEN u.estado_ubicacion = 'P' THEN 'PRESTAMO'
                        ELSE 'AVERIADA'
                    END) as estado, 
                    (SELECT row_to_json(torre.*) 
                    FROM tipo_ubicacion torre 
                    WHERE torre.pk_tipoubi = u.fk_torre) AS torre,
                    (SELECT row_to_json(piso.*) 
                    FROM tipo_ubicacion piso 
                    WHERE piso.pk_tipoubi = u.fk_piso) AS piso,
                    (SELECT row_to_json(sala.*) 
                    FROM tipo_ubicacion sala 
                    WHERE sala.pk_tipoubi = u.fk_sala) AS sala,
                    (SELECT row_to_json(habitacion.*) 
                    FROM tipo_ubicacion habitacion 
                    WHERE habitacion.pk_tipoubi = u.fk_habitacion) AS habitacion,
                    (SELECT row_to_json(a.*) 
                    FROM areas a 
                    WHERE a.areas_id_pk = u.areas_id_fk) AS area
                    from
                    ubicacion u  `;

//Consulta de todas las camas
const getUbicacionAll = async (req, res) => {
    let consulta = `${consulta_master}`; 
    await funcionesSQL.getRows(consulta, req, res);
}

//Consulta de todas las camas
const getUbicacionAllXEstado = async (req, res) => {
    let estado = req.params.estado;
    let consulta = `${consulta_master} where estado_ubicacion = '${estado}' order by u.descripcion_ubicacion`; 
    await funcionesSQL.getRows(consulta, req, res);
}


//Consulta de todas las camas x area
const getUbicacionXArea = async (req, res) => {
    let area = req.params.area;
    let consulta = `${consulta_master} where areas_id_fk = ${area} order by u.descripcion_ubicacion`; 
    await funcionesSQL.getRows(consulta, req, res);
}

//Consulta de todas las camas x area y tipo (torre,sala,piso)
const getUbicacionXAreaEstado = async (req, res) => {
    let estado = req.params.estado;
    let area = req.params.area;
    let consulta = `${consulta_master} where estado_ubicacion = '${estado}' and areas_id_fk = ${area} order by u.descripcion_ubicacion`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getUbicacionXId = async (req, res) => {
    let id = req.params.id;
    const consulta = `${consulta_master} where u.pk_ubi =${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}

const crudUbicacion = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_ubicacion ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}


module.exports = {
    getUbicacionAll,
    getUbicacionAllXEstado,
    getUbicacionXArea,
    getUbicacionXAreaEstado,
    getUbicacionXId,
    crudUbicacion
}