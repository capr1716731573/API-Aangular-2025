const funcionesSQL = require('../../middlewares/funcionesSQL');
var path = require("path");
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
 * CODIGO DE Postoperatorio DE HOSPITALIZACION
 */

const getAllPostoperatorio = async (req, res) => {
  let desde = req.query.desde;
  opciones.hcu = req.params.hcu;
  opciones.busqueda = null;
  opciones.reg_cantidad = variablesEntorno.ROWS_X_PAGE;
  opciones.fecha_desde = null;
  opciones.fecha_hasta = null;
  let consulta = '';
  desde = Number(desde);
  //valido que exista el parametro "desde"
  if (req.query.desde) {
    opciones.reg_desde = desde;
  } else {
    opciones.reg_desde = 0;
  }
  console.log(`${JSON.stringify(opciones)}`);

  consulta = `select * from protocolo_operatorio_getall('${JSON.stringify(opciones)}'::text)`;
  console.log(consulta);
  await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}


const getPostoperatorio_Fechas = async (req, res) => {
  opciones.hcu = req.params.hcu;
  opciones.busqueda = null;
  opciones.reg_desde = null;
  opciones.reg_cantidad = null;
  opciones.fecha_desde = req.params.f1;
  opciones.fecha_hasta = req.params.f2;

  const consulta = `select * from protocolo_operatorio_getall('${JSON.stringify(opciones)}'::text)`;
  await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getPostoperatorio_ID = async (req, res) => {
  /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
  let opcion = req.params.opcion;
  let id = req.params.id;
  const consulta = `select * from protocolo_operatorio_getid(${opcion},'${id}')`;
  await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const crud_Postoperatorio = async (req, res) => {
  const accion = req.params.accion;
  const body_json = req.body;
  const consulta = `select * from crud_protocolo_operatorio ('${accion}','${JSON.stringify(body_json)}'::json)`;
  await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const getAllDiagnosticoPostoperatorio = async (req, res) => {
  let id_post = req.params.id_post;
  consulta = `select * from protocolo_operatorio_diagnosticos pro inner join cie on cie.pk_cie=pro.fk_cie where pro.fk_protope=${id_post} order by pro.pk_protope_diag ASC`;
  await funcionesSQL.getRows(consulta, req, res);
}

const getDiagnosticoID_Postoperatorio = async (req, res) => {
  let id = req.params.id;
  const consulta = `select * from protocolo_operatorio_diagnosticos pro inner join cie on cie.pk_cie=pro.fk_cie where pro.pk_protope_diag=${id}`;
  await funcionesSQL.getRowID(consulta, req, res);
}

const crudDiagnostico_Postoperatorio = async (req, res) => {
  const accion = req.params.accion;
  const body_json = req.body;
  const consulta = `select * from crud_protocolo_operatorio_diagnosticos ('${accion}','${JSON.stringify(body_json)}'::json)`;
  await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const getAllMedicosPostoperatorio = async (req, res) => {
  let id_post = req.params.id_post;
  consulta = `    
select * from protocolo_operatorio_medicos pom 
			inner join especialidad_medica em 
			inner join usuarios u 
			inner join persona p 
			on u.fk_persona = p.pk_persona  
			on em.fk_usuario = u.pk_usuario 
			inner join catalogo_detalle cd 
			on em.fk_catdetalle = cd.pk_catdetalle 
			on em.pk_espemed = pom.medico_usu_id_fk 
		where pom.fk_protope = ${id_post} 
				order by pom.pk_protope_med `;
  await funcionesSQL.getRows(consulta, req, res);
}

const getMedicosID_Postoperatorio = async (req, res) => {
  let id = req.params.id;
  const consulta = `select * from protocolo_operatorio_medicos pom inner join usuarios u inner join persona p 
                on u.fk_persona = p.pk_persona 
                on u.pk_usuario = pom.medico_usu_id_fk
                where pom.pk_protope_med=${id}`;
  await funcionesSQL.getRowID(consulta, req, res);
}

const crudMedicos_Postoperatorio = async (req, res) => {
  const accion = req.params.accion;
  const body_json = req.body;
  const consulta = `select * from crud_protocolo_operatorio_medicos ('${accion}','${JSON.stringify(body_json)}'::json)`;
  await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}


/**
 * ZONA DE REPORTES
 */
const templatePaths = {
  page1: path.join(__dirname, '../../reportes/hospitalizacion/protocolo_quirurgico/protqui1.html'),
  page2: path.join(__dirname, '../../reportes/hospitalizacion/protocolo_quirurgico/protqui2.html')
};


//Descarga pdf: Multiples Hojas  
const reporte_descarga = async (req, res) => {
  /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
  let id = req.params.id;
  const consulta = `select * from protocolo_operatorio_getid(1,'${id}')`;
  let data = await funcionesSQL.getData(consulta);
  const nombre_archivo = `reporte.pdf`;

  if (!data.mensaje || data.mensaje.status != 'ok')
    data = null;
  else {
    data = data.mensaje.data;

    //Procedimiento para visualizar firma y sello formateado correctamente
    //actualizo los paths en el formato que se visualize
    const baseUrl = `${req.protocol}://${req.get('host')}`; // e.g. http://localhost:3005

    let diagramaUrl = "";
    if (data.diagrama_protope) {
      diagramaUrl = `${baseUrl}/postoperatorio/ver/protope?pathprotope=${data.diagrama_protope}`;  // :contentReference[oaicite:2]{index=2}
      /* console.log(diagramaUrl); */
      data.diagrama_protope = diagramaUrl;
    }

    /* console.log(data); */
  }


  //console.log(JSON.stringify(data));

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
  const consulta = `select * from protocolo_operatorio_getid(1,'${id}')`;
  let data = await funcionesSQL.getData(consulta);
  const nombre_archivo = `reporte.pdf`;

  if (!data.mensaje || data.mensaje.status != 'ok')
    data = null;
  else {
    data = data.mensaje.data;

    //Procedimiento para visualizar firma y sello formateado correctamente
    //actualizo los paths en el formato que se visualize
    const baseUrl = `${req.protocol}://${req.get('host')}`; // e.g. http://localhost:3005

    let diagramaUrl = "";
    if (data.diagrama_protope) {
      diagramaUrl = `${baseUrl}/postoperatorio/ver/protope?pathprotope=${data.diagrama_protope}`;  // :contentReference[oaicite:2]{index=2}
      //console.log(diagramaUrl);
      data.diagrama_protope = diagramaUrl;
    }

    //console.log(data);
  }


  //console.log(JSON.stringify(data));

  const pageContents = [
    { templatePath: templatePaths.page1, data },
    { templatePath: templatePaths.page2, data }
  ];

  await funcionesSQL.generateMultiplesPDF_Frame(pageContents, req, res);
}


async function getAllPostoperatorioData({ hcu, fecha_desde, fecha_hasta, desde = 0, hasta = 100 }) {
  // Armamos el objeto opciones que esperaba tu endpoint original
  const opciones = {
    hcu,
    fecha_desde: fecha_desde || null,
    fecha_hasta: fecha_hasta || null,
    reg_desde: Number(desde) || 0,
    reg_hasta: Number(hasta) || 100, // si tu SP lo soporta; si no, lo ignorará
  };

  const { rows } = await funcionesSQL.callTextFunctionRaw('protocolo_operatorio_getall', opciones);
  return rows;
}

async function fetchAllPostOperatorio({ hcu, fecha_desde, fecha_hasta, pageSize = 100 }) {
  let desde = 0;
  const acumulado = [];
  while (true) {
    const chunk = await getAllPostoperatorioData({
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
  // Si necesitas orden cronológico ascendente:
  // acumulado.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  return acumulado;
}


module.exports = {
  getAllPostoperatorio,
  getPostoperatorio_Fechas,
  getPostoperatorio_ID,
  crud_Postoperatorio,
  getAllDiagnosticoPostoperatorio,
  getDiagnosticoID_Postoperatorio,
  crudDiagnostico_Postoperatorio,
  getAllMedicosPostoperatorio,
  getMedicosID_Postoperatorio,
  crudMedicos_Postoperatorio,
  reporte_descarga,
  reporte_frame,
  getAllPostoperatorioData,
  fetchAllPostOperatorio
}