const funcionesSQL = require('../../middlewares/funcionesSQL');
var path = require("path");
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

const templatePaths = {
    page1: path.join(__dirname, '../../reportes/emergencia/008_1.html'),
    page2: path.join(__dirname, '../../reportes/emergencia/008_2.html')
};


//Descarga pdf: Multiples Hojas  
const reporte008_descarga = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let id = req.params.id;
    const consulta = `select * from emergencia_getpdf_008(1,'${id}')`;
    let data = await funcionesSQL.getData(consulta);
    const nombre_archivo=`_008.pdf`;

    if(!data.mensaje || data.mensaje.status != 'ok')
      data=null;
    else data=data.mensaje.data;

    //console.log(JSON.stringify(data));

    const pageContents = [
        {templatePath: templatePaths.page1, data },
        {templatePath: templatePaths.page2, data }
      ];
    //Consulto por id
    await funcionesSQL.generateMultiplesPDF(nombre_archivo,pageContents,req,res);    
}

//Frame pdf: Multiples Hojas
const reporte008_frame = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let id = req.params.id;
    const consulta = `select * from emergencia_getpdf_008(1,'${id}')`;
    let data = await funcionesSQL.getData(consulta);
    const nombre_archivo=`_008.pdf`;

    if(!data.mensaje || data.mensaje.status != 'ok')
      data=null;
    else data=data.mensaje.data;

    //console.log(JSON.stringify(data));

    const pageContents = [
        {templatePath: templatePaths.page1, data },
        {templatePath: templatePaths.page2, data }
      ];
      
    await funcionesSQL.generateMultiplesPDF_Frame(pageContents,req,res);   
}


//Descarga pdf: Una Sola Hoja
const reporte008_descarga1 = async (req, res) => {
    const id = req.params.id;
    const nombre_archivo=`_008.pdf`;
    const pageContents = [
        {templatePath: templatePaths.page1, data: { nombres: "CARLOS ALBERTO", apellidos: "PULLAS RECALDE", fechanac: "10-07-1987" } }
      ];
    //Consulto por id
    await funcionesSQL.generateMultiplesPDF(nombre_archivo,pageContents,req,res);     
}

//Frame pdf: Una sola Hoja
const reporte008_frame1 = async (req, res) => {
    const id = req.params.id;    
    //Consulto por id
    const pageContent = {page1: templatePaths.page1, data: { nombres: "CARLOS ALBERTO", apellidos: "PULLAS RECALDE", fechanac: "10-07-1987" } };
    
    await funcionesSQL.generateOnePdf_Frame(pageContent,req,res);    
}

module.exports = {
    getAll008,
    get008Bsq,
    get008Fechas,
    get008ID,
    crud008,
    reporte008_descarga,
    reporte008_frame,
    reporte008_descarga1,
    reporte008_frame1
}