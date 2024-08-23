const funcionesSQL = require('../../middlewares/funcionesSQL');
var path = require("path");
require('dotenv').config();

const variablesEntorno = process.env;

//* CRUD DE LA TABLA TRIAGE
let opciones={
    "hcu":null,
    "busqueda":null,
    "reg_desde": null,
    "reg_cantidad":variablesEntorno.ROWS_X_PAGE,
    "fecha_desde":null,
  	"fecha_hasta":null
  };


const getAllEvolucion = async (req, res) => {    
    let desde = req.query.desde;
    opciones.hcu = req.params.hcu;
    opciones.fecha_desde=null;
    opciones.fecha_hasta=null;
    let consulta = '';
    desde = Number(desde);
    //valido que exista el parametro "desde"
    if (req.query.desde) {        
        opciones.reg_desde=desde;   
    } else {
        opciones.reg_desde=0;
    }
    consulta = `select * from getall_evoluciones('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getBsqEvolucion = async (req, res) => {
    opciones.busqueda=req.params.valor;
    opciones.hcu=req.params .hcu;
    const consulta = `select * from getall_evoluciones('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getIdEvolucion = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let id = req.params.id;
    const consulta = `select * from getid_evoluciones(${id})`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const crudEvoluciones = async (req, res) => {
    const accion = req.params.accion;
    const body_json  = req.body;
    const consulta=`select * from crud_evolucion ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta,req,res);    
}

const templatePaths = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/evolucion.html')
};


//Descarga pdf: Multiples Hojas  
const reporteEvolucion_descarga = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    opciones.hcu = req.params.hcu;
    let consulta = `select * from getall_evoluciones('${JSON.stringify(opciones)}'::text)`;
    let data = await funcionesSQL.getData(consulta);
    const nombre_archivo=`_evolucion.pdf`;

    if(!data.mensaje || data.mensaje.status != 'ok')
      data=null;
    else data=data.mensaje.data;

    //console.log(JSON.stringify(data));

    const pageContents = [
        {templatePath: templatePaths.page1, data }
      ];
    //Consulto por id
    await funcionesSQL.generateMultiplesPDF(nombre_archivo,pageContents,req,res);    
}

//Frame pdf: Multiples Hojas
const reporteEvolucion_frame = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    opciones.hcu = req.params.hcu;
    let consulta = `select * from getall_evoluciones('${JSON.stringify(opciones)}'::text)`;
    let data = await funcionesSQL.getData(consulta);
    const nombre_archivo=`_evolucion.pdf`;

    if(!data.mensaje || data.mensaje.status != 'ok')
      data=null;
    else data=data.mensaje.data;

    //console.log(JSON.stringify(data));

    const pageContents = [
        {templatePath: templatePaths.page1, data }
      ];

    await funcionesSQL.generateMultiplesPDF_Frame(pageContents,req,res);   
}


//Descarga pdf: Una Sola Hoja
const reporteEvolucion_descarga1 = async (req, res) => {
   
}

//Frame pdf: Una sola Hoja
const reporteEvolucion_frame1 = async (req, res) => {
    
}

module.exports = {
    getAllEvolucion,
    getBsqEvolucion,
    getIdEvolucion,
    crudEvoluciones,
    reporteEvolucion_descarga,
    reporteEvolucion_frame,
    reporteEvolucion_descarga1,
    reporteEvolucion_frame1
}