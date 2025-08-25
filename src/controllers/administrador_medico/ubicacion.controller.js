const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE TIPO DE UBICACION
let consulta_master=`select u.*,torre.*,piso.*,sala.*,habitacion.*,clase_ubicacion.*,areas.* from
                        ubicacion u 
                        inner join tipo_ubicacion torre on u.fk_torre = torre.pk_tipoubi
                        inner join tipo_ubicacion piso on u.fk_piso = piso.pk_tipoubi
                        inner join tipo_ubicacion sala on u.fk_sala = sala.pk_tipoubi
                        inner join tipo_ubicacion habitacion on u.fk_habitacion = habitacion.pk_tipoubi
                        inner join catalogo_detalle clase_ubicacion on u.clase_ubicacion = clase_ubicacion.pk_catdetalle
                        inner join areas areas on areas.areas_id_pk = u.areas_id_fk`

//Aqui consulto completo por estado, tipo, paginado y todos 
const getUbicacion = async (req, res) => {
    let estado = req.params.estado;
    let area = req.params.area;
    let desde = req.query.desde;
    let consulta = consulta_master;
    desde = Number(desde);

    if (!estado) {
        consulta = `${consulta} where (estado_ubicacion='A' OR estado_ubicacion='O' OR estado_ubicacion='D')`;
    } else {
        consulta = `${consulta} where (estado_ubicacion='${estado}')`;
    }

    if (area != null) {
        consulta = `${consulta} AND areas_id_fk=${area}`;
    }
    //Ordeno por descripcion
    consulta=`${consulta} ORDER BY descripcion_ubicacion ASC `
    
    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `${consulta} LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    }

    await funcionesSQL.getRows(consulta, req, res);

}

const getUbicacionBsq = async (req, res) => {
    let estado = req.params.estado;
    let area = req.params.area;
    let busqueda = req.params.valor;

   let consulta = consulta_master;

    if (!estado) {
        consulta = `${consulta} where (estado_ubicacion='A' OR estado_ubicacion='O' OR estado_ubicacion='D')`;
    } else {
        consulta = `${consulta} where (estado_ubicacion='${estado}')`;
    }

    if (area != null) {
        consulta = `${consulta} AND areas_id_fk=${area}`;
    }
    
    //valido la busqueda
    consulta=`${consulta} and u.descripcion_ubicacion like UPPER('%${busqueda}%')
                        and torre.desc_tipoubi like UPPER('%${busqueda}%')
                        and piso.desc_tipoubi like UPPER('%${busqueda}%')
                        and sala.desc_tipoubi like UPPER('%${busqueda}%')
                        and habitacion.desc_tipoubi like UPPER('%${busqueda}%')
                        and clase_ubicacion.desc_catdetalle  like UPPER('%${busqueda}%')
                        and areas.area_descripcion like UPPER('%${busqueda}%')`
   
    await funcionesSQL.getRows(consulta, req, res);
}

const getUbicacionID = async (req, res) => {
    let id = req.params.id;
    const consulta = `${consulta_master} where u.pk_ubi=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudUbicacion = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_ubicacion ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getUbicacion,
    getUbicacionBsq,
    getUbicacionID,
    crudUbicacion
}