const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const variablesEntorno = process.env;

//* CONSULTA MASTER
let consulta_master=`select CONCAT(p.apellidopat_persona,' ',p.apellidomat_persona,' ',p.nombre_primario_persona,' ',p.nombre_secundario_persona) as nombre_completo,*                    
                    from
                    especialidad_medica em
                    inner join usuarios u 
                    inner join persona p on u.fk_persona = p.pk_persona
                    on em.fk_usuario = u.pk_usuario
                    inner join catalogo_detalle cd on em.fk_catdetalle = cd.pk_catdetalle`


const getEspecialidadesUsuario= async (req, res) => {

    let desde = req.query.desde;
    let consulta = '';
    desde = Number(desde);

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `${consulta_master} LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    } else {
        consulta = `${consulta_master} `;
    }
    await funcionesSQL.getRows(consulta, req, res);

}

const getEspecialidadesUsuarioBsq = async (req, res) => {
    let busqueda = req.params.valor;
    const consulta = `${consulta_master} where 
                                        p.apellidopat_persona like UPPER('%${busqueda}%') or
                                        p.apellidomat_persona like UPPER('%${busqueda}%') or
                                        p.nombre_primario_persona like UPPER('%${busqueda}%') or
                                        p.nombre_secundario_persona like UPPER('%${busqueda}%') or
                                        p.numidentificacion_persona like ('%${busqueda}%') or
                                        cd.desc_catdetalle like UPPER('%${busqueda}%')`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getEspecialidadesUsuarioID = async (req, res) => {
    let id = req.params.id;
    const consulta = `${consulta_master} where em.pk_espemed =${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudEspecialidadesUsuario= async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_especialidades_usuario ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getEspecialidadesUsuario,
    getEspecialidadesUsuarioBsq,
    getEspecialidadesUsuarioID,
    crudEspecialidadesUsuario
}