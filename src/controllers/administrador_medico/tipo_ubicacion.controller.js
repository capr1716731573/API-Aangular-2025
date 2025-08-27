const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE TIPO DE UBICACION

//Aqui consulto completo por estado, tipo, paginado y todos 
const getTipoUbicacion = async (req, res) => {
    let estado = String(req.params.estado).toLowerCase() === "true";
    let tipo = req.params.tipo;
    let desde = req.query.desde;
    let consulta = 'select * from tipo_ubicacion';
    desde = Number(desde);

    if (estado) {
        consulta = `${consulta} where (habilitado_tipoubi=true)`;
    } else {
        consulta = `${consulta} where (habilitado_tipoubi=true OR habilitado_tipoubi=false)`;
    }
    // Solo agrego filtro si "tipo" es un número válido
    if (tipo && tipo !== "null" && tipo !== "undefined") {
        consulta += ` AND tipo_tipoubi='${tipo}'`;
    }
    //Ordeno por descripcion
    consulta = `${consulta} ORDER BY desc_tipoubi ASC `

    //valido que exista el parametro "desde"
    if (req.query.desde && (Number(req.query.desde)>=0)) {
        consulta = `${consulta} LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    }


    await funcionesSQL.getRows(consulta, req, res);

}

const getTipoUbicacionsBsq = async (req, res) => {
    let estado = String(req.params.estado).toLowerCase() === "true";
    let tipo = req.params.tipo;
    let busqueda = req.params.valor;

    let consulta = 'select * from tipo_ubicacion';

    if (estado) {
        consulta = `${consulta} where (habilitado_tipoubi=true)`;
    } else {
        consulta = `${consulta} where (habilitado_tipoubi=true OR habilitado_tipoubi=false)`;
    }

     // Solo agrego filtro si "tipo" es un número válido
    if (tipo && tipo !== "null" && tipo !== "undefined") {
        consulta += ` AND tipo_tipoubi='${tipo}'`;
    }

    //valido la busqueda
    consulta = `${consulta} AND desc_tipoubi LIKE UPPER('%${busqueda}%') ORDER BY desc_tipoubi ASC`

    await funcionesSQL.getRows(consulta, req, res);
}

const getTipoUbicacionID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from tipo_ubicacion where pk_tipoubi=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudTipoUbicacion = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_tipo_ubicacion ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getTipoUbicacion,
    getTipoUbicacionsBsq,
    getTipoUbicacionID,
    crudTipoUbicacion
}