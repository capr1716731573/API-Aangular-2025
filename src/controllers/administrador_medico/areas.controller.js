const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE TIPO DE UBICACION

//Aqui consulto completo por estado, tipo, paginado y todos 
const getAreas = async (req, res) => {
    let estado = String(req.params.estado).toLowerCase() === "true";
    let casa_salud = req.params.casa;
    let desde = req.query.desde;
    let consulta = 'select * from areas';
    desde = Number(desde);
    if (estado) {       
        consulta = `${consulta} where (area_habilitada=true)`;
    } else {
        consulta = `${consulta} where (area_habilitada=true OR area_habilitada=false)`;
    }

    if (casa_salud != null) {
        consulta = `${consulta} AND casalud_id_fk=${casa_salud}`;
    }
    //Ordeno por descripcion
    consulta=`${consulta} ORDER BY area_descripcion ASC `
    
    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `${consulta} LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    }

    console.lo

    await funcionesSQL.getRows(consulta, req, res);

}

const getAreasBsq = async (req, res) => {
    let estado = String(req.params.estado).toLowerCase() === "true";
    let casa_salud = req.params.casa;
    let busqueda = req.params.valor;

    let consulta = 'select * from areas';

    if (!estado) {
        consulta = `${consulta} where (area_habilitada=true OR area_habilitada=false)`;
    } else {
        consulta = `${consulta} where (area_habilitada=true)`;
    }

    if (casa_salud != null) {
        consulta = `${consulta} AND casalud_id_fk=${casa_salud}`;
    }
    
    //valido la busqueda
    consulta=`${consulta} AND area_descripcion LIKE UPPER('%${busqueda}%') ORDER BY area_descripcion ASC`
   
    await funcionesSQL.getRows(consulta, req, res);
}

const getAreasID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from areas where areas_id_pk=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudAreas = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_areas ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getAreas,
    getAreasBsq,
    getAreasID,
    crudAreas
}