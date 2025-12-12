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
 * CODIGO DE ANAMNESIS DE HOSPITALIZACION
 */

const getAllKardex = async (req, res) => {
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

    console.log(JSON.stringify(opciones));

    consulta = `select * from kardex_getall('${JSON.stringify(opciones)}'::text)`;
    console.log(consulta);
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getKardex_Busqueda = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda = req.params.bsq;;
    opciones.reg_desde = null;
    opciones.reg_cantidad = null;
    opciones.fecha_desde = null;
    opciones.fecha_hasta = null;

    const consulta = `select * from kardex_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getKardex_Fechas = async (req, res) => {
    opciones.hcu = req.params.hcu;
    opciones.busqueda = null;
    opciones.reg_desde = null;
    opciones.reg_cantidad = null;
    opciones.fecha_desde = req.params.f1;
    opciones.fecha_hasta = req.params.f2;

    const consulta = `select * from kardex_getall('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getKardex_ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from kardex_getid(${opcion},'${id}')`;
    await funcionesSQL.getID_Row_StoreProcedure(consulta, req, res);
}

const getKardexDet_ID = async (req, res) => {
    /*Opcion es texto 1(Busqueda por id) 2(Busqueda por cedula o numero de identificacion)*/
    let opcion = req.params.opcion;
    let id = req.params.id;
    const consulta = `select * from kardex_det where fk_kardexcab=${id}`;
    await funcionesSQL.getRows(consulta, req, res);
}


const crud_KardexCab = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_kardex_cab ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const crud_KardexDet = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_kardex_det ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}


/**
 * ZONA DE REPORTES
 */
const templatePaths = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/kardex/kardex.html'),
};


//Descarga pdf: Multiples Hojas  
const reporteKardex_descarga = async (req, res) => {
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


    // KARDEX
    const consulta_kardex = `select * from kardex_getall('${JSON.stringify(opciones)}'::text)`;
    let data_kardex = await funcionesSQL.getData(consulta_kardex);
    data_kardex = (data_kardex?.mensaje?.status === 'ok') ? (data_kardex.mensaje.data ?? data_kardex.mensaje) : null;

    // Logo en Base64
    const nombre_archivo = `_kardex.pdf`;
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
        kardex: data_kardex ?? [],
    };

    const pageContents = [
        { templatePath: templatePaths.page1, data },
    ];
    //Consulto por id
    await funcionesSQL.generateMultiplesPDF(nombre_archivo, pageContents, req, res);
}

//Frame pdf: Multiples Hojas
const reporteKardex_frame = async (req, res) => {
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


    // KARDEX
    const consulta_kardex = `select * from kardex_getall('${JSON.stringify(opciones)}'::text)`;
    let data_kardex = await funcionesSQL.getData(consulta_kardex);
    data_kardex = (data_kardex?.mensaje?.status === 'ok') ? (data_kardex.mensaje.data ?? data_kardex.mensaje) : null;

    // Logo en Base64
    const nombre_archivo = `_kardex.pdf`;
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
       // logo: logoBase64,
        hcu: data_hcu,
        casa_salud: data_casa_salud,
        kardex: data_kardex ?? [],
    };

    const pageContents = [
        { templatePath: templatePaths.page1, data },
    ];

    await funcionesSQL.generateMultiplesPDF_Frame(pageContents, req, res);
}


module.exports = {
    getAllKardex,
    getKardex_Fechas,
    getKardex_ID,
    getKardexDet_ID,
    getKardex_Busqueda,
    crud_KardexCab,
    crud_KardexDet,
    reporteKardex_descarga,
    reporteKardex_frame
}