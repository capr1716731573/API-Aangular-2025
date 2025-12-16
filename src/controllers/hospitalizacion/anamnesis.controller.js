const funcionesSQL = require('../../middlewares/funcionesSQL');
var path = require("path");
const fs = require('fs');
require('dotenv').config();

const variablesEntorno = process.env;

//* CRUD DE LA TABLA TRIAGE
let opciones = {
  "hcu": null,
  "busqueda": null,
  "reg_desde": null,
  "reg_cantidad": variablesEntorno.ROWS_X_PAGE,
  "fecha_desde": null,
  "fecha_hasta": null
};

/**
 * CODIGO DE ANAMNESIS DE HOSPITALIZACION
 */

const getAllAnamesis_Hosp = async (req, res) => {
  let desde = req.query.desde;
  opciones.hcu = req.params.hcu;
  opciones.reg_cantidad = variablesEntorno.ROWS_X_PAGE;
  opciones.fecha_desde = null;
  opciones.fecha_hasta = null;
  opciones.busqueda = null;
  let consulta = '';
  desde = Number(desde);
  //valido que exista el parametro "desde"
  if (req.query.desde) {
    opciones.reg_desde = desde;
  } else {
    opciones.reg_desde = 0;
  }

  consulta = `select * from anamnesis_hosp_getall('${JSON.stringify(opciones)}'::text)`;
  console.log(consulta);
  await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}


const getAnamesis_Hosp_Fechas = async (req, res) => {
  opciones.hcu = req.params.hcu;
  opciones.busqueda = null;
  opciones.reg_desde = null;
  opciones.reg_cantidad = null;
  opciones.fecha_desde = req.params.f1;
  opciones.fecha_hasta = req.params.f2;

  const consulta = `select * from anamnesis_hosp_getall('${JSON.stringify(opciones)}'::text)`;
  await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getAnamesis_Hosp_ID = async (req, res) => {
  /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
  let opcion = req.params.opcion;
  let id = req.params.id;
  const consulta = `select * from anamnesis_hosp_getid(${opcion},'${id}')`;
  await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const crud_Anamesis_Hosp = async (req, res) => {
  const accion = req.params.accion;
  const body_json = req.body;
  const consulta = `select * from crud_anamnesis_hosp ('${accion}','${JSON.stringify(body_json)}'::json)`;
  await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const getAllDiagnosticoAnamesis_Hosp = async (req, res) => {
  let id_anam = req.params.id_anam;
  consulta = `select * from anamnesis_diagnosticos diag inner join cie smc on diag.fk_cie = smc.pk_cie where diag.fk_anam_hosp=${id_anam} order by diag.pk_anamdiag ASC`;
  await funcionesSQL.getRows(consulta, req, res);
}

const getDiagnosticoID_Anamesis_Hosp = async (req, res) => {
  let id = req.params.id;
  const consulta = `select * from anamnesis_diagnosticos diag inner join cie smc on diag.fk_cie = smc.pk_cie where diag.pk_anamdiag=${id}`;
  await funcionesSQL.getRowID(consulta, req, res);
}

const crudDiagnostico_Anamesis_Hosp = async (req, res) => {
  const accion = req.params.accion;
  const body_json = req.body;
  const consulta = `select * from anamnesis_hosp_crud_diagnosticos ('${accion}','${JSON.stringify(body_json)}'::json)`;
  await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

/**
 * ZONA DE REPORTES
 */
const templatePaths = {
  page1: path.join(__dirname, '../../reportes/hospitalizacion/anamnesis/anamnesis1.html'),
  page2: path.join(__dirname, '../../reportes/hospitalizacion/anamnesis/anamnesis2.html')
};


//Descarga pdf: Multiples Hojas  
const reporte_descarga = async (req, res) => {
  /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
  let id = req.params.id;
  const consulta = `select * from anamnesis_hosp_getid(1,'${id}')`;
  let data = await funcionesSQL.getData(consulta);
  //console.log(data);
  const nombre_archivo = `_008.pdf`;

  if (!data.mensaje || data.mensaje.status != 'ok')
    data = null;
  else data = data.mensaje.data;

  /**Aqui va la seccion de la imagen en el reporte  */
  const logoPath = path.join(__dirname, "../../images/logo_veltimed.png");
  try {
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    data.logo = logoBase64; // ✅ Inyectamos directamente la imagen codificada
  } catch (err) {
    console.error("No se pudo leer el logo:", err.message);
    data.logo = null;
  }


  const pageContents = [
    { templatePath: templatePaths.page1, data },
    { templatePath: templatePaths.page2, data }
  ];
  //Consulto por id
  await funcionesSQL.generateMultiplesPDF(nombre_archivo, pageContents, req, res);
}

//Frame pdf: Multiples Hojas
const reporte_frame = async (req, res) => {
  /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
  let id = req.params.id;
  const consulta = `select * from anamnesis_hosp_getid(1,'${id}')`;
  let data = await funcionesSQL.getData(consulta);
  //console.log(data);
  const nombre_archivo = `_008.pdf`;

  if (!data.mensaje || data.mensaje.status != 'ok')
    data = null;
  else data = data.mensaje.data;

  /**Aqui va la seccion de la imagen en el reporte  */
  const logoPath = path.join(__dirname, "../../images/logo_veltimed.png");
  try {
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    data.logo = logoBase64; // ✅ Inyectamos directamente la imagen codificada
  } catch (err) {
    console.error("No se pudo leer el logo:", err.message);
    data.logo = null;
  }


  const pageContents = [
    { templatePath: templatePaths.page1, data },
    { templatePath: templatePaths.page2, data }
  ];

  await funcionesSQL.generateMultiplesPDF_Frame(pageContents, req, res);
}


//Descarga pdf: Una Sola Hoja
const reporte008_descarga1 = async (req, res) => {
  const id = req.params.id;
  const nombre_archivo = `_008.pdf`;
  const pageContents = [
    { templatePath: templatePaths.page1, data: { nombres: "CARLOS ALBERTO", apellidos: "PULLAS RECALDE", fechanac: "10-07-1987" } }
  ];
  //Consulto por id
  await funcionesSQL.generateMultiplesPDF(nombre_archivo, pageContents, req, res);
}

//Frame pdf: Una sola Hoja
const reporte008_frame1 = async (req, res) => {
  const id = req.params.id;
  //Consulto por id
  const pageContent = { page1: templatePaths.page1, data: { nombres: "CARLOS ALBERTO", apellidos: "PULLAS RECALDE", fechanac: "10-07-1987" } };

  await funcionesSQL.generateOnePdf_Frame(pageContent, req, res);
}



//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@  PDF TOTAL     @@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
async function getAllAnamnesisData({ hcu, fecha_desde, fecha_hasta, desde = 0, hasta = 100 }) {
  // Armamos el objeto opciones que esperaba tu endpoint original
  const opciones = {
    hcu,
    fecha_desde: fecha_desde || null,
    fecha_hasta: fecha_hasta || null,
    reg_desde: Number(desde) || 0,
    reg_hasta: Number(hasta) || 100, // si tu SP lo soporta; si no, lo ignorará
  };

  const { rows } = await funcionesSQL.callTextFunctionRaw('anamnesis_hosp_getall', opciones);
  return rows;
}


async function fetchAllAnamnesis({ hcu, fecha_desde, fecha_hasta, pageSize = 100 }) {
  let desde = 0;
  const acumulado = [];
  while (true) {
    const chunk = await getAllAnamnesisData({
      hcu,
      fecha_desde,
      fecha_hasta,
      desde,
      hasta: pageSize,
    });
    if (!chunk?.length) break;
    acumulado.push(...chunk);
    if (chunk.length < pageSize) break; // última página
    desde += pageSize;
  }

  return acumulado;
}

module.exports = {
  getAllAnamesis_Hosp,
  getAnamesis_Hosp_Fechas,
  getAnamesis_Hosp_ID,
  crud_Anamesis_Hosp,
  getAllDiagnosticoAnamesis_Hosp,
  getDiagnosticoID_Anamesis_Hosp,
  crudDiagnostico_Anamesis_Hosp,
  reporte_descarga,
  reporte_frame,
  reporte008_descarga1,
  reporte008_frame1,
  getAllAnamnesisData,
  fetchAllAnamnesis
}