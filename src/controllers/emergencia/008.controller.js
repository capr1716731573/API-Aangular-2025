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

/*
  Aqui coloco lista de 008 que estan en espera sin atender
*/

const getAll008_Espera = async (req, res) => {
    let consulta_008_espera=`
      WITH consulta AS (
          SELECT _008.*,
            (SELECT json_build_object(
                'triage', row_to_json(tri)
            )  
            FROM emergencia_triage tri
              INNER JOIN persona pac_tri ON tri.fk_persona = pac_tri.pk_persona
                INNER JOIN historia_clinica hcu_tri ON hcu_tri.fk_persona = pac_tri.pk_persona
              WHERE hcu_tri.pk_hcu = _008.fk_hcu
                    AND tri.fecha_triage = _008.fecha_inicio
              ORDER BY tri.hora_triage DESC
              LIMIT 1) AS triage,
            hcu.*, 
            persona.*, 
            calcular_edad_json(persona.fecnac_persona, current_date) AS edad,
            sexo.desc_catdetalle as sexo,
            concat(persona.apellidopat_persona,' ',persona.apellidomat_persona,' ',persona.nombre_primario_persona) as "responsable",
            EXTRACT(day FROM now() - (_008.fecha_inicio + _008.hora_inicio::time))::text || ' Dias - ' ||
            LPAD(EXTRACT(hour FROM now() - (_008.fecha_inicio + _008.hora_inicio::time))::text, 2, '0') || ' horas - ' ||
            LPAD(EXTRACT(minute FROM now() - (_008.fecha_inicio + _008.hora_inicio::time))::text, 2, '0') || ' minutos - ' ||
            LPAD(EXTRACT(second FROM now() - (_008.fecha_inicio + _008.hora_inicio::time))::text, 2, '0') || ' segundos' AS tiempo_transcurrido
        FROM  
            emergencia_008 AS _008 
        inner join usuarios suu
              on suu.pk_usuario = _008.medico_usu_id_fk 
        INNER JOIN 
            historia_clinica AS hcu 
        INNER JOIN 
            persona AS persona 
        ON 
            hcu.fk_persona = persona.pk_persona 
        ON 
            _008.fk_hcu = hcu.pk_hcu 
        LEFT JOIN catalogo_detalle sexo on sexo.pk_catdetalle = persona.fk_sexo
        )
      SELECT *
      FROM consulta
      WHERE estado_emerg=false
  `;
  
    let color = req.params.color;
  
    if(color === 'AZ'){
      consulta_008_espera = consulta_008_espera+` AND json_extract_path_text(consulta.triage, 'triage', 'clasificacion_triage') = 'AZ'`;
    }else if(color === 'RO'){
      consulta_008_espera = consulta_008_espera+` AND json_extract_path_text(consulta.triage, 'triage', 'clasificacion_triage') = 'RO'`;
    }else if(color === 'NA'){
      consulta_008_espera = consulta_008_espera+` AND json_extract_path_text(consulta.triage, 'triage', 'clasificacion_triage') = 'NA'`;
    }else if(color === 'VE'){
      consulta_008_espera = consulta_008_espera+` AND json_extract_path_text(consulta.triage, 'triage', 'clasificacion_triage') = 'VE'`;
    }else if(color === 'AM'){
      consulta_008_espera = consulta_008_espera+` AND json_extract_path_text(consulta.triage, 'triage', 'clasificacion_triage') = 'AM'`;
    }else{
      consulta_008_espera = consulta_008_espera+` and (triage is null) `;
    }
    consulta_008_espera = consulta_008_espera + ` order by consulta.fecha_inicio ASC, consulta.hora_inicio ASC`;
    await funcionesSQL.getRows(consulta_008_espera, req, res);
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

const getAlerta008 = async (req, res) => {
    /*Aqui retirno la cantidad de 008 y triages no cerradas por el usuario seleccionado o que abre el sistema*/
    let usuario = req.params.usuario;
    const consulta = `
          SELECT json_build_object(
            'num_008', 
            (SELECT count(*) 
            FROM emergencia_008 e 
            WHERE e.estado_emerg = false 
              AND e.medico_usu_id_fk = ${usuario}),
  
            'num_triage', 
            (SELECT count(*) 
            FROM emergencia_triage et 
            WHERE et.estado_triage = false 
              AND et.fk_usuario = ${usuario})
        ) AS resultado;
    `;
    await funcionesSQL.getRowID(consulta, req, res);
  }


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
    getAll008_Espera,
    get008Bsq,
    get008Fechas,
    get008ID,
    crud008,
    getAlerta008,
    reporte008_descarga,
    reporte008_frame,
    reporte008_descarga1,
    reporte008_frame1
}