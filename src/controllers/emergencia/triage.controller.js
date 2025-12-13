const funcionesSQL = require('../../middlewares/funcionesSQL');
var path = require("path");
require('dotenv').config();

const variablesEntorno = process.env;

//* CRUD DE LA TABLA TRIAGE
let opciones = {
    "busqueda": null,
    "reg_desde": null,
    "reg_cantidad": variablesEntorno.ROWS_X_PAGE,
    "fecha_desde": null,
    "fecha_hasta": null
};


const getAllTriage = async (req, res) => {

    let desde = req.query.desde;
    opciones = {
        "busqueda": null,
        "reg_desde": null,
        "reg_cantidad": variablesEntorno.ROWS_X_PAGE,
        "fecha_desde": null,
        "fecha_hasta": null
    };
    let consulta = '';
    desde = Number(desde);

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        opciones.reg_desde = desde;
    } else {
        opciones.reg_desde = 0;
    }
    consulta = `select * from emergencia_getall_triage('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);

}

const getTriageBsq = async (req, res) => {
    opciones.busqueda = req.params.valor;
    opciones.reg_desde = null;
    opciones.reg_cantidad = null;
    opciones.fecha_desde = null;
    opciones.fecha_hasta = null;

    console.log(`AQUI PRUEBA: ${req.params.valor} --- ${JSON.stringify(opciones)}`);

    const consulta = `select * from emergencia_getall_triage('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getTriageFechas = async (req, res) => {
    opciones.busqueda = null;
    opciones.reg_desde = null;
    opciones.reg_cantidad = null;
    opciones.fecha_desde = req.params.f1;
    opciones.fecha_hasta = req.params.f2;
    const consulta = `select * from emergencia_getall_triage('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}


const getTriageID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id)   2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from emergencia_getaid_triage(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const crudTriage = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from emergencia_crud_triage ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const templatePaths = {
    page1: path.join(__dirname, '../../reportes/emergencia/triage.html')
};

//Descarga pdf: Multiples Hojas  
const reporteTriage_descarga = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let id = req.params.id;
    const consulta = `select * from emergencia_getaid_triage(1,'${id}')`;
    let data = await funcionesSQL.getData(consulta);
    const nombre_archivo = `triage.pdf`;

    if (!data.mensaje || data.mensaje.status != 'ok')
        data = null;
    else data = data.mensaje.data;

    //console.log(JSON.stringify(data));

    const pageContents = [
        { templatePath: templatePaths.page1, data }
    ];
    //Consulto por id
    await funcionesSQL.generateMultiplesPDF(nombre_archivo, pageContents, req, res);
}

//Frame pdf: Multiples Hojas
const reporteTriage_frame = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let id = req.params.id;
    const consulta = `select * from emergencia_getaid_triage(1,'${id}')`;
    let data = await funcionesSQL.getData(consulta);


    const nombre_archivo = `triage.pdf`;

    if (!data.mensaje || data.mensaje.status != 'ok')
        data = null;
    else {
        data = data.mensaje.data
    };

    //console.log(JSON.stringify(data));

    const pageContents = [
        { templatePath: templatePaths.page1, data }
    ];

    await funcionesSQL.generateMultiplesPDF_Frame(pageContents, req, res);
}


module.exports = {
    getAllTriage,
    getTriageBsq,
    getTriageFechas,
    getTriageID,
    crudTriage,
    reporteTriage_descarga,
    reporteTriage_frame
}