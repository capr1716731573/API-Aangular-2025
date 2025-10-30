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
 * CODIGO DE EPICRISIS DE HOSPITALIZACION
 */

const getAllEpicrisis = async (req, res) => {
    let desde = req.query.desde;
    opciones.hcu = req.params.hcu;
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

    consulta = `select * from epicrisis_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}


const getEpicrisis_Fechas = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda = null;
    opciones.reg_desde = null;
    opciones.reg_cantidad = null;
    opciones.fecha_desde = req.params.f1;
    opciones.fecha_hasta = req.params.f2;

    const consulta = `select * from epicrisis_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getEpicrisis_ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from epicrisis_getid(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const crud_Epicrisis = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_epicrisis ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const getAllDiagnosticoEpicrisis = async (req, res) => {
    let id_epi = req.params.id_epi;
    consulta = `select * from epicrisis_diagnosticos diag inner join cie smc on diag.fk_cie = smc.pk_cie where diag.fk_epi=${id_epi} order by diag.pk_epidiag ASC`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getDiagnosticoID_Epicrisis = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from epicrisis_diagnosticos diag inner join cie smc on diag.fk_cie = smc.pk_cie where diag.pk_epidiag=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}

const crudDiagnostico_Epicrisis = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from epicrisis_crud_diagnosticos ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const getAllMedicosEpicrisis = async (req, res) => {
    let id_epi = req.params.id_epi;
    consulta = `select 
            epimed.pk_epimed as pk_epimed,
            concat(med.apellidopat_persona,' ',med.apellidomat_persona,' ',med.nombre_primario_persona,' ',med.nombre_secundario_persona) as medico_nombre,
            med.numidentificacion_persona as medico_identificacion,
            espe.desc_catdetalle as medico_especilidad,
            epimed.periodo_desde_epimed periodo_desde,
            epimed.periodo_hasta_epimed periodo_hasta
            from 
            epicrisis_medicos epimed inner join especialidad_medica espemed
            inner join usuarios usu
            inner join persona med on usu.fk_persona = med.pk_persona
            on usu.pk_usuario = espemed.fk_usuario 
            inner join catalogo_detalle espe on espe.pk_catdetalle = espemed.fk_catdetalle 
            on espemed.pk_espemed = epimed.fk_espemed 
            where epimed.fk_epi = ${id_epi}
            order by epimed.periodo_desde_epimed ASC
    `;
    await funcionesSQL.getRows(consulta, req, res);
}

const getMedicosID_Epicrisis = async (req, res) => {
    let id = req.params.id;
    consulta = `select *
            from 
            epicrisis_medicos epimed inner join especialidad_medica espemed
            inner join usuarios usu
            inner join persona med on usu.fk_persona = med.pk_persona
            on usu.pk_usuario = espemed.fk_usuario 
            inner join catalogo_detalle espe on espe.pk_catdetalle = espemed.fk_catdetalle 
            on espemed.pk_espemed = epimed.pk_epimed 
            where epimed.fk_epi = ${id_epi}
            order by epimed.periodo_desde ASC
        `;
    await funcionesSQL.getRowID(consulta, req, res);
}

const crudMedicos_Epicrisis = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from epicrisis_crud_medicos ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

/**
 * ZONA DE REPORTES
 */
const templatePaths = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/epicrisis/epicrisis1.html'),
    page2: path.join(__dirname, '../../reportes/hospitalizacion/epicrisis/epicrisis2.html')
};


//Descarga pdf: Multiples Hojas  
const reporte_descarga = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let id = req.params.id;
    const consulta = `select * from epicrisis_getid(1,'${id}')`;
    let data = await funcionesSQL.getData(consulta);
    const nombre_archivo = `_008.pdf`;

    if (!data.mensaje || data.mensaje.status != 'ok')
        data = null;
    else data = data.mensaje.data;

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
    const consulta = `select * from epicrisis_getid(1,'${id}')`;
    let data = await funcionesSQL.getData(consulta);
    const nombre_archivo = `_epicrisis.pdf`;

    if (!data.mensaje || data.mensaje.status != 'ok')
        data = null;
    else data = data.mensaje.data;

    //console.log(JSON.stringify(data));

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

async function getAllEpicrisisData({ hcu, fecha_desde, fecha_hasta, desde = 0, hasta = 100 }) {
    // Armamos el objeto opciones que esperaba tu endpoint original
    const opciones = {
        hcu,
        fecha_desde: fecha_desde || null,
        fecha_hasta: fecha_hasta || null,
        reg_desde: Number(desde) || 0,
        reg_hasta: Number(hasta) || 100, // si tu SP lo soporta; si no, lo ignorará
    };

    const { rows } = await funcionesSQL.callTextFunctionRaw('epicrisis_getall', opciones);
    return rows;
}


module.exports = {
    getAllEpicrisis,
    getEpicrisis_Fechas,
    getEpicrisis_ID,
    crud_Epicrisis,
    getAllDiagnosticoEpicrisis,
    getDiagnosticoID_Epicrisis,
    crudDiagnostico_Epicrisis,
    getAllMedicosEpicrisis,
    getMedicosID_Epicrisis,
    crudMedicos_Epicrisis,
    reporte_descarga,
    reporte_frame,
   
}