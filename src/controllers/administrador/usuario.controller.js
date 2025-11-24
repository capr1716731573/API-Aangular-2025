const { sequelize } = require('../../config/database');
const funcionesSQL = require('../../middlewares/funcionesSQL');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const variablesEntorno = process.env;

//* CRUD DE LA TABLA USUARIOS


const getUsuario = async (req, res) => {

    let desde = req.query.desde;
    let hasta = req.query.hasta;
    let consulta = '';
    desde = Number(desde);
    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `select * from usuarios p inner join persona p2 on p.fk_persona = p2.pk_persona  order by p.login_usuario LIMIT ${desde + variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    } else {
        consulta = `select * from usuarios p inner join persona p2 on p.fk_persona = p2.pk_persona  order by p.login_usuario `;
    }
    await funcionesSQL.getRows(consulta, req, res);

}

const getUsuarioBsq = async (req, res) => {
    let busqueda = req.params.valor;
    const consulta = `select * from usuarios p inner join persona p2 on p.fk_persona = p2.pk_persona  
    WHERE (p.login_usuario LIKE '%${busqueda}%' 
    OR p2.apellidopat_persona LIKE '%${busqueda}%' 
    OR p2.apellidomat_persona LIKE '%${busqueda}%' 
    OR p2.nombre_primario_persona LIKE '%${busqueda}%' 
    OR p2.nombre_secundario_persona LIKE '%${busqueda}%'
    OR p2.numidentificacion_persona LIKE '%${busqueda}%')
      order by p.login_usuario`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getUsuarioID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from usuarios p inner join persona p2 on p.fk_persona = p2.pk_persona  WHERE pk_usuario=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}

const getUsuarioMedicos = async (req, res) => {
    consulta = `select *,CONCAT(p2.apellidopat_persona,' ',p2.apellidomat_persona,' ',p2.nombre_primario_persona,' ',p2.nombre_secundario_persona) as nombres_completos from usuarios p inner join persona p2 on p.fk_persona = p2.pk_persona where p.doctor_usuario =true order by p.login_usuario`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getUsuarioMedicoBsq = async (req, res) => {
    let busqueda = req.params.valor;
    const consulta = `select *,
    CONCAT(p2.apellidopat_persona,' ',p2.apellidomat_persona,' ',p2.nombre_primario_persona,' ',p2.nombre_secundario_persona) as nombres_completos
    from usuarios p inner join persona p2 on p.fk_persona = p2.pk_persona  
    WHERE
    (p.doctor_usuario =true) AND
    (p.login_usuario LIKE '%${busqueda}%' 
    OR p2.apellidopat_persona LIKE '%${busqueda}%' 
    OR p2.apellidomat_persona LIKE '%${busqueda}%' 
    OR p2.nombre_primario_persona LIKE '%${busqueda}%' 
    OR p2.nombre_secundario_persona LIKE '%${busqueda}%'
    OR p2.numidentificacion_persona LIKE '%${busqueda}%')
      order by p.login_usuario`;
    await funcionesSQL.getRows(consulta, req, res);
}



const crudUsuario = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_usuarios ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);


}
const crudUsuarioPassword = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;

    if (body_json.password_usuario === undefined || body_json.password_usuario === null || body_json.password_usuario === '' || body_json.password_usuario === "") {
        return res.status(500).json({
            status: 'error',
            message: 'Error al enviar password'
        });
    } else {
        body_json.password_usuario = bcryptjs.hashSync(body_json.password_usuario, 10);
        const consulta = `select * from crud_usuarios ('${accion}','${JSON.stringify(body_json)}'::json)`;
        await funcionesSQL.crud_StoreProcedure(consulta, req, res);
    }

}


//* CRUD DE LA TABLA MENU PERFIL
const getUsuarioPerfil = async (req, res) => {

    let desde = req.query.desde;
    let perfil = req.params.perfil;
    let consulta = '';
    desde = Number(desde);

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `select * from usuario_perfil up inner join usuarios u on up.fk_usuario = u.pk_usuario inner join perfil p on up.fk_perfil = p.pk_perfil where p.pk_perfil = ${perfil} order by u.login_usuario ASC  LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    } else {
        consulta = `select * from usuario_perfil up inner join usuarios u on up.fk_usuario = u.pk_usuario inner join perfil p on up.fk_perfil = p.pk_perfil where p.pk_perfil = ${perfil} order by u.login_usuario ASC`;
    }
    await funcionesSQL.getRows(consulta, req, res);
}

const getPerfilUsuario = async (req, res) => {

    let usuario = req.params.usuario;
    let consulta = '';
    consulta = `select * from usuario_perfil up 
                inner join perfil p 
                on up.fk_perfil = p.pk_perfil
                where up.fk_usuario =${usuario} order by p.nombre_perfil ASC`
    await funcionesSQL.getRows(consulta, req, res);
}

const getUsuarioPerfilBsq = async (req, res) => {
    let busqueda = req.params.valor;
    let perfil = req.params.perfil;
    const consulta = `select * from usuario_perfil up inner join usuarios u on up.fk_usuario = u.pk_usuario inner join perfil p on up.fk_perfil = p.pk_perfil where p.pk_perfil = ${perfil} and u.login_usuario LIKE '%${busqueda}%'`;
    await funcionesSQL.getRows(consulta, req, res);
}

const crudUsuarioPerfil = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_usuario_perfil ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

module.exports = {
    getUsuario,
    getUsuarioBsq,
    getUsuarioMedicos,
    getUsuarioMedicoBsq,
    crudUsuario,
    getUsuarioPerfil,
    getPerfilUsuario,
    getUsuarioPerfilBsq,
    getUsuarioID,
    crudUsuarioPerfil,
    crudUsuarioPassword
}