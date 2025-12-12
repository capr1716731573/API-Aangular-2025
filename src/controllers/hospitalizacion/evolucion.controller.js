const funcionesSQL = require('../../middlewares/funcionesSQL');
var path = require("path");
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


const getAllEvolucion = async (req, res) => {
    let desde = req.query.desde;
    opciones.hcu = req.params.hcu;
    opciones.busqueda = null;
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
    consulta = `select * from getall_evoluciones('${JSON.stringify(opciones)}'::text)`;
    await funcionesSQL.getAll_Rows_StoreProcedure(consulta, req, res);
}

const getBsqEvolucion = async (req, res) => {
    opciones.busqueda = req.params.valor;
    opciones.hcu = req.params.hcu;
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
    const body_json = req.body;
    const consulta = `select * from crud_evolucion ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

const templatePaths = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/evolucion/evolucion.html')
};


//Descarga pdf: Multiples Hojas  
const reporteEvolucion_descarga = async (req, res) => {
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


    let consulta = `select * from getall_evoluciones('${JSON.stringify(opciones)}'::text)`;
    let data_evo = await funcionesSQL.getData(consulta);
    const nombre_archivo = `_evolucion.pdf`;

    if (!data_evo.mensaje || data_evo.mensaje.status != 'ok')
        data_evo = null;
    else data_evo = data_evo.mensaje.data;

    // 🔴👉 Unificamos TODO en un solo objeto:
    const data = {
        hcu: data_hcu,
        casa_salud: data_casa_salud,
        data_evo: data_evo ?? [],
    };


    const pageContents = [
        { templatePath: templatePaths.page1, data }
    ];

    await funcionesSQL.generateMultiplesPDF(nombre_archivo, pageContents, req, res);
}

//Frame pdf: Multiples Hojas
const reporteEvolucion_frame = async (req, res) => {

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


    let consulta = `select * from getall_evoluciones('${JSON.stringify(opciones)}'::text)`;
    let data_evo = await funcionesSQL.getData(consulta);
    const nombre_archivo = `_evolucion.pdf`;

    if (!data_evo.mensaje || data_evo.mensaje.status != 'ok')
        data_evo = null;
    else data_evo = data_evo.mensaje.data;

    // 🔴👉 Unificamos TODO en un solo objeto:
    const data = {
        hcu: data_hcu,
        casa_salud: data_casa_salud,
        data_evo: data_evo ?? [],
    };


    const pageContents = [
        { templatePath: templatePaths.page1, data }
    ];

    await funcionesSQL.generateMultiplesPDF_Frame(pageContents, req, res);
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