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
 * CODIGO DE ANAMNESIS DE HOSPITALIZACION
 */

const getAllInterconsultas_Solicitudes = async (req, res) => {
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
    consulta = `select * from interconsulta_solicitud_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getAllInterconsultas_Fechas = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda = null;
    opciones.reg_desde = null;
    opciones.reg_cantidad = null;
    opciones.fecha_desde = req.params.f1;
    opciones.fecha_hasta = req.params.f2;

    const consulta = `select * from interconsulta_solicitud_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getInterconsultas_Solicitudes_ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from interconsulta_solicitud_getid(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const getInterconsultas_Respuestas_ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from interconsulta_respuesta_getid(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}


const crud_Interconsultas_Solicitud = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_interconsulta_solicitud ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const crud_Interconsultas_Respuestas = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_interconsulta_respuesta ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const getAllDiagnosticoInterconsultas = async (req, res) => {
    let id_inter = req.params.id_inter;
    let tipo_inter = req.params.tipo_inter;
    consulta = `select * from interconsulta_diagnosticos diag inner join cie smc on diag.fk_cie = smc.pk_cie where diag.fk_interconsulta=${id_inter} and diag.tipo_interconsulta='${tipo_inter}' order by diag.pk_interdiag ASC`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getDiagnosticoID_Interconsultas = async (req, res) => {
    let id = req.params.id;
    const consulta = `select * from interconsulta_diagnosticos diag inner join cie smc on diag.fk_cie = smc.pk_cie where diag.pk_interdiag=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}

const crudDiagnostico_Interconsultas = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from interconsulta_crud_diagnosticos ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

/**
 * ZONA DE REPORTES
 */

const templatePaths = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/interconsulta/interconsulta_solicitud.html'),
    page2: path.join(__dirname, '../../reportes/hospitalizacion/interconsulta/interconsulta_respuesta.html')
};


//Descarga pdf: Multiples Hojas  
const reporte_descarga = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let id_sol = req.params.id_sol;
    const consulta_solicitud = `select * from interconsulta_solicitud_getid(1,'${id_sol}')`;
    let data_solicitud = await funcionesSQL.getData(consulta_solicitud);


    if (!data_solicitud.mensaje || data_solicitud.mensaje.status != 'ok') {
        data_solicitud = {};
        return;
    }

    else data_solicitud = data_solicitud.mensaje.data;

    //Ahora cargo datos de la respuesta
    let id_resp = req.params.id_resp;
    let data_respuesta = {};
    if (id_resp === null || id_resp === 'null' || id_resp === undefined) {
        data_respuesta = {};
    } else {
        const consulta_respuesta = `select * from interconsulta_respuesta_getid(1,'${id_resp}')`;
        data_respuesta = await funcionesSQL.getData(consulta_respuesta);

        if (!data_respuesta.mensaje || data_respuesta.mensaje.status != 'ok') {
            data_respuesta = {};
            return;
        }
        else data_respuesta = data_respuesta.mensaje.data;
    }

    const nombre_archivo = `interconsulta.pdf`;



    /**Aqui va la seccion de la imagen en el reporte  */
    const logoPath = path.join(__dirname, "../../images/logo_veltimed.png");
    try {
        const logoBuffer = fs.readFileSync(logoPath);
        const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
        data_solicitud.logo = logoBase64; // ✅ Inyectamos directamente la imagen codificada
        data_respuesta.logo = logoBase64; // ✅ Inyectamos directamente la imagen codificada
    } catch (err) {
        console.error("No se pudo leer el logo:", err.message);
        data_solicitud.logo = null;
        data_respuesta.logo = null;
    }


    const pageContents = [
        { templatePath: templatePaths.page1, data: data_solicitud },
        { templatePath: templatePaths.page2, data: data_respuesta }
    ];
    //Consulto por id
    await funcionesSQL.generateMultiplesPDF(nombre_archivo, pageContents, req, res);
}

//Frame pdf: Multiples Hojas
const reporte_frame = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let id_sol = req.params.id_sol;
    const consulta_solicitud = `select * from interconsulta_solicitud_getid(1,'${id_sol}')`;
    let data_solicitud = await funcionesSQL.getData(consulta_solicitud);


    if (!data_solicitud.mensaje || data_solicitud.mensaje.status != 'ok') {
        data_solicitud = {};
        return;
    }

    else data_solicitud = data_solicitud.mensaje.data;

    //Ahora cargo datos de la respuesta
    let id_resp = req.params.id_resp;
    let data_respuesta = {};
    if (id_resp === null || id_resp === 'null' || id_resp === undefined) {
        data_respuesta = {};
    } else {
        const consulta_respuesta = `select * from interconsulta_respuesta_getid(1,'${id_resp}')`;
        data_respuesta = await funcionesSQL.getData(consulta_respuesta);

        if (!data_respuesta.mensaje || data_respuesta.mensaje.status != 'ok') {
            data_respuesta = {};
            return;
        }
        else data_respuesta = data_respuesta.mensaje.data;
    }

    const nombre_archivo = `interconsulta.pdf`;


    /**Aqui va la seccion de la imagen en el reporte  */
    const logoPath = path.join(__dirname, "../../images/logo_veltimed.png");
    try {
        const logoBuffer = fs.readFileSync(logoPath);
        const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
        data_solicitud.logo = logoBase64; // ✅ Inyectamos directamente la imagen codificada
        data_respuesta.logo = logoBase64; // ✅ Inyectamos directamente la imagen codificada
    } catch (err) {
        console.error("No se pudo leer el logo:", err.message);
        data_solicitud.logo = null;
        data_respuesta.logo = null;
    }

    //console.log(JSON.stringify(data));

    const pageContents = [
        { templatePath: templatePaths.page1, data: data_solicitud },
        { templatePath: templatePaths.page2, data: data_respuesta }
    ];
    //Consulto por id
    await funcionesSQL.generateMultiplesPDF_Frame(pageContents, req, res);
}

module.exports = {
    getAllInterconsultas_Solicitudes,
    getAllInterconsultas_Fechas,
    getInterconsultas_Solicitudes_ID,
    getInterconsultas_Respuestas_ID,
    crud_Interconsultas_Solicitud,
    crud_Interconsultas_Respuestas,
    getAllDiagnosticoInterconsultas,
    getDiagnosticoID_Interconsultas,
    crudDiagnostico_Interconsultas,
    reporte_descarga,
    reporte_frame
}