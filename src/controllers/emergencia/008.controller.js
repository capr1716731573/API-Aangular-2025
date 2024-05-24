const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const variablesEntorno = process.env;

//* CRUD DE LA TABLA TRIAGE
let opciones={
    "busqueda":null,
    "reg_desde": null,
    "reg_cantidad":variablesEntorno.ROWS_X_PAGE,
    "fecha_desde":null,
  	"fecha_hasta":null
  };


const getAll008 = async (req, res) => {
    let desde = req.query.desde;
    let consulta = '';
    desde = Number(desde);
    //valido que exista el parametro "desde"
    if (req.query.desde) {        
        opciones.reg_desde=desde;   
    } else {
        opciones.reg_desde=0;
    }
    consulta = `select * from emergencia_getall_008('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const get008Bsq = async (req, res) => {
    opciones.busqueda=req.params.valor;
    opciones.reg_desde=null;
    opciones.reg_cantidad=null;
    opciones.fecha_desde=null;
    opciones.fecha_hasta=null;
    const consulta = `select * from emergencia_getall_008('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const get008Fechas = async (req, res) => {
    opciones.busqueda=null;
    opciones.reg_desde=null;
    opciones.reg_cantidad=null;
    opciones.fecha_desde=req.params.f1;
    opciones.fecha_hasta=req.params.f2;

    const consulta = `select * from emergencia_getall_008('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}


const get008ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from emergencia_getid_008(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const crud008 = async (req, res) => {
    const accion = req.params.accion;
    const body_json  = req.body;
    const consulta=`select * from emergencia_crud_008 ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta,req,res);    
}

module.exports = {
    getAll008,
    get008Bsq,
    get008Fechas,
    get008ID,
    crud008
}