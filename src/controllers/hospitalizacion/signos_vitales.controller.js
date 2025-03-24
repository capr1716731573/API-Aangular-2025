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

/**
 * CODIGO DE EPICRISIS DE HOSPITALIZACION
 */

const getAll_SignosVitales_a = async (req, res) => {
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

    consulta = `select * from signos_vitales_a_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getAll_SignosVitales_c = async (req, res) => {
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

    consulta = `select * from signos_vitales_c_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getAll_SignosVitales_d = async (req, res) => {
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

    consulta = `select * from signos_vitales_d_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getAll_SignosVitales_e = async (req, res) => {
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

    consulta = `select * from signos_vitales_e_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}


const getSignosVitales_Fechas_a = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda=null;
    opciones.reg_desde=null;
    opciones.reg_cantidad=null;
    opciones.fecha_desde=req.params.f1;
    opciones.fecha_hasta=req.params.f2;

    const consulta = `select * from signos_vitales_a_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getSignosVitales_Fechas_c = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda=null;
    opciones.reg_desde=null;
    opciones.reg_cantidad=null;
    opciones.fecha_desde=req.params.f1;
    opciones.fecha_hasta=req.params.f2;

    const consulta = `select * from signos_vitales_c_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getSignosVitales_Fechas_d = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda=null;
    opciones.reg_desde=null;
    opciones.reg_cantidad=null;
    opciones.fecha_desde=req.params.f1;
    opciones.fecha_hasta=req.params.f2;

    const consulta = `select * from signos_vitales_d_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getSignosVitales_Fechas_e = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda=null;
    opciones.reg_desde=null;
    opciones.reg_cantidad=null;
    opciones.fecha_desde=req.params.f1;
    opciones.fecha_hasta=req.params.f2;

    const consulta = `select * from signos_vitales_e_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getSignosVitales_a_ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from signos_vitales_a_getid(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const getSignosVitales_c_ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from signos_vitales_c_getid(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const getSignosVitales_d_ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from signos_vitales_d_getid(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const getSignosVitales_e_ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from signos_vitales_e_getid(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const crud_SignosVitales_a = async (req, res) => {
    const accion = req.params.accion;
    const body_json  = req.body;
    const consulta=`select * from crud_signos_a ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta,req,res);    
}

const crud_SignosVitales_c = async (req, res) => {
    const accion = req.params.accion;
    const body_json  = req.body;
    const consulta=`select * from crud_signos_c ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta,req,res);    
}

const crud_SignosVitales_d = async (req, res) => {
    const accion = req.params.accion;
    const body_json  = req.body;
    const consulta=`select * from crud_signos_d ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta,req,res);    
}

const crud_SignosVitales_e = async (req, res) => {
    const accion = req.params.accion;
    const body_json  = req.body;
    const consulta=`select * from crud_signos_e ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta,req,res);    
}

/**
 * ZONA DE REPORTES
 */
const templatePaths = {
    page1: path.join(__dirname, '../../reportes/epicrisis/008_1.html'),
    page2: path.join(__dirname, '../../reportes/epicrisis/008_2.html')
};


//Descarga pdf: Multiples Hojas  
const reporte008_descarga = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let id = req.params.id;
    const consulta = `select * from epicrisis_getpdf_008(1,'${id}')`;
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
    const consulta = `select * from epicrisis_getpdf_008(1,'${id}')`;
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
    getAll_SignosVitales_a,
    getAll_SignosVitales_c,
    getAll_SignosVitales_d,
    getAll_SignosVitales_e,
    getSignosVitales_Fechas_a,
    getSignosVitales_Fechas_c,
    getSignosVitales_Fechas_d,
    getSignosVitales_Fechas_e,
    getSignosVitales_a_ID,
    getSignosVitales_c_ID,
    getSignosVitales_d_ID,
    getSignosVitales_e_ID,
    crud_SignosVitales_a,
    crud_SignosVitales_c,
    crud_SignosVitales_d,
    crud_SignosVitales_e
}