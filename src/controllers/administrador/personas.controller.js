const {sequelize} = require('../../config/database');
const funcionesSQL = require('../../middlewares/funcionesSQL');

require('dotenv').config();

const variablesEntorno=process.env;

//* CRUD DE LA TABLA PERSONA
let opciones={
    "busqueda":null,
    "reg_desde": null,
    "reg_cantidad":variablesEntorno.ROWS_X_PAGE
  };

const getAllPersona = async (req, res) => {

    let desde = req.query.desde;
    let consulta = '';
    desde = Number(desde);
    console.log('desde: '+desde);

    //valido que exista el parametro "desde"
    if (req.query.desde) {        
        opciones.reg_desde=desde;   
    } else {
        opciones.reg_desde=0;
    }
    consulta = `select * from getall_persona('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);

}

const getPersonaBsq = async (req, res) => {
    let busqueda = req.params.valor;
    opciones.busqueda=busqueda;
    opciones.reg_desde=null;
    opciones.reg_cantidad=null;
    const consulta = `select * from getall_persona('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getPersonaID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id)   2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from getid_persona(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const crudPersona= async (req,res) => {
    const accion = req.params.accion;
    const body_json  = req.body;
    const consulta=`select * from crud_persona ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta,req,res);
}

module.exports={
    getAllPersona,
    getPersonaID,
    getPersonaBsq,
    crudPersona
}