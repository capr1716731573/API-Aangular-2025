const funcionesSQL = require('../../middlewares/funcionesSQL');
var path = require("path");
const fs = require('fs');
require('dotenv').config();
const dayjs = require("dayjs"); // si no lo tienes, instala con npm i dayjs

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

const getAll_SignosVitales_b = async (req, res) => {
    let desde = req.query.desde;
    opciones.hcu = req.params.hcu;
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

    consulta = `select * from signos_vitales_b_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getAll_SignosVitales_c = async (req, res) => {
    let desde = req.query.desde;
    opciones.hcu = req.params.hcu;
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

    consulta = `select * from signos_vitales_c_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getAll_SignosVitales_d = async (req, res) => {
    let desde = req.query.desde;
    opciones.hcu = req.params.hcu;
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

    consulta = `select * from signos_vitales_d_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getAll_SignosVitales_e = async (req, res) => {
    let desde = req.query.desde;
    opciones.hcu = req.params.hcu;
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

    consulta = `select * from signos_vitales_e_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getAll_SignosVitales_f = async (req, res) => {
    let desde = req.query.desde;
    opciones.hcu = req.params.hcu;
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

    consulta = `select * from signos_vitales_f_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}


const getSignosVitales_Fechas_b = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda = null;
    opciones.reg_desde = null;
    opciones.reg_cantidad = null;
    opciones.fecha_desde = req.params.f1;
    opciones.fecha_hasta = req.params.f2;

    const consulta = `select * from signos_vitales_b_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getSignosVitales_Fechas_c = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda = null;
    opciones.reg_desde = null;
    opciones.reg_cantidad = null;
    opciones.fecha_desde = req.params.f1;
    opciones.fecha_hasta = req.params.f2;

    const consulta = `select * from signos_vitales_c_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getSignosVitales_Fechas_d = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda = null;
    opciones.reg_desde = null;
    opciones.reg_cantidad = null;
    opciones.fecha_desde = req.params.f1;
    opciones.fecha_hasta = req.params.f2;

    const consulta = `select * from signos_vitales_d_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getSignosVitales_Fechas_e = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda = null;
    opciones.reg_desde = null;
    opciones.reg_cantidad = null;
    opciones.fecha_desde = req.params.f1;
    opciones.fecha_hasta = req.params.f2;

    const consulta = `select * from signos_vitales_e_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getSignosVitales_Fechas_f = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda = null;
    opciones.reg_desde = null;
    opciones.reg_cantidad = null;
    opciones.fecha_desde = req.params.f1;
    opciones.fecha_hasta = req.params.f2;

    const consulta = `select * from signos_vitales_f_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}


const getSignosVitales_b_ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from signos_vitales_b_getid(${opcion},'${id}')`;
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

const getSignosVitales_f_ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from signos_vitales_f_getid(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const crud_SignosVitales_b = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_signos_b ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const crud_SignosVitales_c = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_signos_c ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const crud_SignosVitales_d = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_signos_d ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const crud_SignosVitales_e = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_signos_e ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const crud_SignosVitales_f = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_signos_f ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

/**
 * ZONA DE REPORTES
 */
const templatePaths = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/signos_vitales/signos_vitales.html'),
};


//Descarga pdf: Multiples Hojas  
const reporteSignos_descarga = async (req, res) => {
    //AQUI VALIDO SI TIENE UNA FECHA PARA COLOCAR EL PERIODO
    opciones.hcu = req.params.hcu;
    opciones.todos = true;
    opciones.reg_cantidad = null;

    // ✅ Validar si llega una fecha válida (no null, no undefined, no vacía)
    if (req.params.fecha1 && req.params.fecha1.trim() !== "" && req.params.fecha1 != null && req.params.fecha1 != 'null') {
        opciones.fecha_desde = req.params.fecha1;
        if (req.params.fecha2 && req.params.fecha2.trim() !== "" && req.params.fecha2 != null && req.params.fecha2 != 'null') {
            opciones.fecha_hasta = req.params.fecha2;
        } else {
            opciones.fecha_hasta = dayjs().format("YYYY-MM-DD"); // fecha actual
        }

    } else {
        opciones.fecha_desde = null;
        opciones.fecha_hasta = null;
    }



    //HISTORIA CLINICA
    const consulta_hcu = `select *, calcular_edad_json(p.fecnac_persona,CURRENT_DATE) as edad_completa, sexo.desc_catdetalle as sexo  from historia_clinica hcu 
                            inner join persona p 
                            inner join catalogo_detalle sexo on p.fk_sexo = sexo.pk_catdetalle
                            on p.pk_persona = hcu.fk_persona
                            where hcu.pk_hcu=${opciones.hcu}`;
    let data_hcu = await funcionesSQL.getData(consulta_hcu);
    //data_hcu = (data_hcu?.mensaje?.status === 'ok') ? (data_hcu.mensaje.data ?? data_a.mensaje) : null;

    //CASA DE SALUD
    const consulta_casa_salud = `select * from casas_salud cs
                                 inner join institucion i on cs.ins_id_fk = i.ins_id_pk
                                 where cs.casalud_principal =true limit 1`;
    let data_casa_salud = await funcionesSQL.getData(consulta_casa_salud);

    // B
    const consulta_signos_b = `select * from signos_vitales_b_getall('${JSON.stringify(opciones)}'::text)`;
    let data_b = await funcionesSQL.getData(consulta_signos_b);
    data_b = (data_b?.mensaje?.status === 'ok') ? (data_b.mensaje.data ?? data_b.mensaje) : null;

    // C
    const consulta_signos_c = `select * from signos_vitales_c_getall('${JSON.stringify(opciones)}'::text)`;
    let data_c = await funcionesSQL.getData(consulta_signos_c);
    data_c = (data_c?.mensaje?.status === 'ok') ? (data_c.mensaje.data ?? data_c.mensaje) : null;

    // D
    const consulta_signos_d = `select * from signos_vitales_d_getall('${JSON.stringify(opciones)}'::text)`;
    let data_d = await funcionesSQL.getData(consulta_signos_d);
    data_d = (data_d?.mensaje?.status === 'ok') ? (data_d.mensaje.data ?? data_d.mensaje) : null;

    // E
    const consulta_signos_e = `select * from signos_vitales_e_getall('${JSON.stringify(opciones)}'::text)`;
    let data_e = await funcionesSQL.getData(consulta_signos_e);
    data_e = (data_e?.mensaje?.status === 'ok') ? (data_e.mensaje.data ?? data_e.mensaje) : null;

    // F
    const consulta_signos_f = `select * from signos_vitales_f_getall('${JSON.stringify(opciones)}'::text)`;
    let data_f = await funcionesSQL.getData(consulta_signos_f);
    data_f = (data_f?.mensaje?.status === 'ok') ? (data_f.mensaje.data ?? data_f.mensaje) : null;

    // Logo en Base64
    const nombre_archivo = `_signos_vitales.pdf`;
    const logoPath = path.join(__dirname, '../../images/logo_veltimed.png');

    /* let logoBase64 = null;
    try {
        const logoBuffer = fs.readFileSync(logoPath);
        logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (err) {
        console.error('No se pudo leer el logo:', err.message);
    } */

    // 🔴👉 Unificamos TODO en un solo objeto:
    const data = {
        //logo: logoBase64,
        hcu: data_hcu,
        casa_salud: data_casa_salud,
        seccion_b: data_b ?? [],   // o {} según lo que devuelva tu SP
        seccion_c: data_c ?? [],
        seccion_d: data_d ?? [],
        seccion_e: data_e ?? [],
        seccion_f: data_f ?? [],
    };

    "Claves foráneas"

    const pageContents = [
        { templatePath: templatePaths.page1, data }
    ];

    // Si tu helper soporta opciones PDF, añade orientación aquí (ver punto 2)
    const pdfOptions = { format: 'A4', landscape: true, printBackground: true, margin: { top: '12mm', right: '10mm', bottom: '12mm', left: '10mm' } };
    await funcionesSQL.generateMultiplesPDF(nombre_archivo, pageContents, req, res, pdfOptions);
};

//Frame pdf: Multiples Hojas
const reporteSignos_frame = async (req, res) => {
    //AQUI VALIDO SI TIENE UNA FECHA PARA COLOCAR EL PERIODO
    opciones.hcu = req.params.hcu;
    opciones.todos = true;
    opciones.reg_cantidad = null;

    // ✅ Validar si llega una fecha válida (no null, no undefined, no vacía)
    if (req.params.fecha1 && req.params.fecha1.trim() !== "" && req.params.fecha1 != null && req.params.fecha1 != 'null') {
        opciones.fecha_desde = req.params.fecha1;
        if (req.params.fecha2 && req.params.fecha2.trim() !== "" && req.params.fecha2 != null && req.params.fecha2 != 'null') {
            opciones.fecha_hasta = req.params.fecha2;
        } else {
            opciones.fecha_hasta = dayjs().format("YYYY-MM-DD"); // fecha actual
        }

    } else {
        opciones.fecha_desde = null;
        opciones.fecha_hasta = null;
    }

    //HISTORIA CLINICA
    const consulta_hcu = `select *, calcular_edad_json(p.fecnac_persona,CURRENT_DATE) as edad_completa, sexo.desc_catdetalle as sexo  from historia_clinica hcu 
                            inner join persona p 
                            inner join catalogo_detalle sexo on p.fk_sexo = sexo.pk_catdetalle
                            on p.pk_persona = hcu.fk_persona
                            where hcu.pk_hcu=${opciones.hcu}`;
    let data_hcu = await funcionesSQL.getData(consulta_hcu);
    //data_hcu = (data_hcu?.mensaje?.status === 'ok') ? (data_hcu.mensaje.data ?? data_a.mensaje) : null;

    //CASA DE SALUD
    const consulta_casa_salud = `select * from casas_salud cs
                                 inner join institucion i on cs.ins_id_fk = i.ins_id_pk
                                 where cs.casalud_principal =true limit 1`;
    let data_casa_salud = await funcionesSQL.getData(consulta_casa_salud);

    // B
    const consulta_signos_b = `select * from signos_vitales_b_getall('${JSON.stringify(opciones)}'::text)`;
    let data_b = await funcionesSQL.getData(consulta_signos_b);
    data_b = (data_b?.mensaje?.status === 'ok') ? (data_b.mensaje.data ?? data_b.mensaje) : null;

    // C
    const consulta_signos_c = `select * from signos_vitales_c_getall('${JSON.stringify(opciones)}'::text)`;
    let data_c = await funcionesSQL.getData(consulta_signos_c);
    data_c = (data_c?.mensaje?.status === 'ok') ? (data_c.mensaje.data ?? data_c.mensaje) : null;

    // D
    const consulta_signos_d = `select * from signos_vitales_d_getall('${JSON.stringify(opciones)}'::text)`;
    let data_d = await funcionesSQL.getData(consulta_signos_d);
    data_d = (data_d?.mensaje?.status === 'ok') ? (data_d.mensaje.data ?? data_d.mensaje) : null;

    // E
    const consulta_signos_e = `select * from signos_vitales_e_getall('${JSON.stringify(opciones)}'::text)`;
    let data_e = await funcionesSQL.getData(consulta_signos_e);
    data_e = (data_e?.mensaje?.status === 'ok') ? (data_e.mensaje.data ?? data_e.mensaje) : null;

    // F
    const consulta_signos_f = `select * from signos_vitales_f_getall('${JSON.stringify(opciones)}'::text)`;
    let data_f = await funcionesSQL.getData(consulta_signos_f);
    data_f = (data_f?.mensaje?.status === 'ok') ? (data_f.mensaje.data ?? data_f.mensaje) : null;

    // Logo en Base64
    const nombre_archivo = `_signos_vitales.pdf`;
    const logoPath = path.join(__dirname, '../../images/logo_veltimed.png');

    /* let logoBase64 = null;
    try {
        const logoBuffer = fs.readFileSync(logoPath);
        logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (err) {
        console.error('No se pudo leer el logo:', err.message);
    } */

    // 🔴👉 Unificamos TODO en un solo objeto:
    const data = {
        //logo: logoBase64,
        hcu: data_hcu,
        casa_salud: data_casa_salud,
        seccion_b: data_b ?? [],   // o {} según lo que devuelva tu SP
        seccion_c: data_c ?? [],
        seccion_d: data_d ?? [],
        seccion_e: data_e ?? [],
        seccion_f: data_f ?? [],
    };

    console.log(data.seccion_e);

    const pageContents = [
        { templatePath: templatePaths.page1, data }
    ];

    // Si tu helper soporta opciones PDF, añade orientación aquí (ver punto 2)
    const pdfOptions = { format: 'A4', landscape: true, printBackground: true, margin: { top: '12mm', right: '10mm', bottom: '12mm', left: '10mm' } };
    await funcionesSQL.generateMultiplesPDF_Frame(pageContents, req, res, pdfOptions);
}


module.exports = {
    getAll_SignosVitales_b,
    getAll_SignosVitales_c,
    getAll_SignosVitales_d,
    getAll_SignosVitales_e,
    getAll_SignosVitales_f,
    getSignosVitales_Fechas_b,
    getSignosVitales_Fechas_c,
    getSignosVitales_Fechas_d,
    getSignosVitales_Fechas_e,
    getSignosVitales_Fechas_f,
    getSignosVitales_b_ID,
    getSignosVitales_c_ID,
    getSignosVitales_d_ID,
    getSignosVitales_e_ID,
    getSignosVitales_f_ID,
    crud_SignosVitales_b,
    crud_SignosVitales_c,
    crud_SignosVitales_d,
    crud_SignosVitales_e,
    crud_SignosVitales_f,
    reporteSignos_descarga,
    reporteSignos_frame
}