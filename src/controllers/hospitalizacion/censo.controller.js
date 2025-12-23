const funcionesSQL = require('../../middlewares/funcionesSQL');
const evolucionController = require('../../controllers/hospitalizacion/evolucion.controller');
const anamnesisController = require('../../controllers/hospitalizacion/anamnesis.controller');
const emergencia008Controller = require('../../controllers/emergencia/008.controller');
const triageController = require('../../controllers/emergencia/triage.controller');
const interconsultaController = require('../../controllers/hospitalizacion/interconsultas.controller');
const epicrisisController = require('../../controllers/hospitalizacion/epicrisis.controller');
const postoperatorioController = require('../../controllers/hospitalizacion/postoperatorio.controller');
const anexoController = require('../../controllers/hospitalizacion/anexos.controller');

const { dayjs, parseLocal, fmtDMY } = require('../../helpers/time');
const { appendAnnexesToPdfBuffer } = require('../../helpers/appendAnnexesToPdfBuffer');

require('dotenv').config();
var path = require("path");
const fs = require('fs');
const ExcelJS = require('exceljs');
const dayjs2 = require("dayjs");
const { PDFDocument } = require('pdf-lib');

const variablesEntorno = process.env;

//* CONSULTA MASTER DE CENSOS TANTO EN INGRESOS O EGRESOS
let consulta_master = `select 
                        ch.*, 
                        p.apellidopat_persona ,
                        p.apellidomat_persona ,
                        concat(p.nombre_primario_persona,' ',p.nombre_secundario_persona) as nombres_persona,
                        p.numidentificacion_persona,
                        calcular_edad_json(p.fecnac_persona::timestamp, now()::timestamp) as edad,
                        sexo.desc_catdetalle as sexo,
                        a.area_descripcion as area,
                        torre.desc_tipoubi as torre,
                        piso.desc_tipoubi as piso,
                        sala.desc_tipoubi as sala,
                        torre.pk_tipoubi as torre_pk,
                        piso.pk_tipoubi as piso_pk,
                        sala.pk_tipoubi as sala_pk,
                        habitacion.desc_tipoubi as habitacion,
                        u.descripcion_ubicacion as ubicacion,
                       COALESCE(
                          (
                            SELECT to_jsonb(ch2)
                            FROM ciclo_hospitalizacion ch2
                            WHERE ch2.fk_ciclohosp = ch.pk_ciclohosp
                              AND ch2.tipo_ciclohosp = 'EGRESO'
                            ORDER BY ch2.fecha_ciclohosp DESC, ch2.hora_ciclohosp DESC
                            LIMIT 1
                          ),
                          '{}'::jsonb
                        ) AS egreso
                        from ciclo_hospitalizacion ch 
                        inner join historia_clinica hc 
                        inner join persona p 
                        inner join catalogo_detalle as sexo on sexo.pk_catdetalle = p.fk_sexo
                        on hc.fk_persona =p.pk_persona 
                        on ch.fk_hcu = hc.pk_hcu 
                        inner join ubicacion u 
                        left join tipo_ubicacion torre on u.fk_torre = torre.pk_tipoubi
                        left join tipo_ubicacion piso on u.fk_piso = piso.pk_tipoubi
                        left join tipo_ubicacion sala on u.fk_sala = sala.pk_tipoubi 
                        left join tipo_ubicacion habitacion on u.fk_habitacion = habitacion.pk_tipoubi
                        inner join areas a on a.areas_id_pk = u.areas_id_fk 
                        on u.pk_ubi =ch.fk_ubi 
                        `;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@       Ingresos     @@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//Consulta por HCU del ultimo ingreso activo es decir esta hospitalizado
const getIngresosXHcuVigente = async (req, res) => {
  let hcu = req.params.hcu;
  //tipo_censo puede ser INGRESO  o EGRESO
  let consulta = `${consulta_master} where ch.fk_hcu=${hcu} and tipo_ciclohosp='INGRESO' and ch.activo_ciclohosp=true order by ch.fecha_ciclohosp desc, ch.hora_ciclohosp desc limit 1`;
  await funcionesSQL.getRows(consulta, req, res);
}

//Consulta por HCU del ultimo ingreso activo es decir esta hospitalizado
const getIngresosXHcu = async (req, res) => {
  let hcu = req.params.hcu;
  //tipo_censo puede ser INGRESO  o EGRESO
  let consulta = `${consulta_master} where ch.fk_hcu=${hcu} and tipo_ciclohosp='INGRESO' order by ch.fecha_ciclohosp desc, ch.pk_ciclohosp desc`;
  await funcionesSQL.getRows(consulta, req, res);
}

//Consulta de ingresos por area y piso
const getIngresosXAreaPiso = async (req, res) => {
  let area = req.params.area;
  let consulta = `${consulta_master} where a.areas_id_pk = ${area} and tipo_ciclohosp='INGRESO' and ch.activo_ciclohosp=true order by torre.desc_tipoubi asc, piso.desc_tipoubi asc, u.descripcion_ubicacion ASC`;
  await funcionesSQL.getRows(consulta, req, res);
}

//Consulta de ingresos por area y piso
const getIngresosXAreaTorrePisoSala = async (req, res) => {
  let area = req.params.area;
  let torre = req.params.torre;
  let piso = req.params.piso;
  let sala = req.params.sala;
  let consulta = `${consulta_master} where a.areas_id_pk = ${area} and tipo_ciclohosp='INGRESO' and ch.activo_ciclohosp=true `;
  let order = ' order by torre.desc_tipoubi asc, piso.desc_tipoubi asc, u.descripcion_ubicacion ASC';

  if (torre != undefined && torre != null && torre != '' && torre != 0 && torre != 'undefined' && torre != 'null') {
    consulta = `${consulta} and torre.pk_tipoubi=${torre} `;
  }
  if (piso != undefined && piso != null && piso != '' && piso != 0 && piso != 'undefined' && piso != 'null') {
    consulta = `${consulta} and piso.pk_tipoubi=${piso} `;
  }
  if (sala != undefined && sala != null && sala != '' && sala != 0 && sala != 'undefined' && sala != 'null') {
    consulta = `${consulta} and sala.pk_tipoubi=${sala} `;
  }

  consulta = `${consulta}${order}`;
  console.error(consulta);

  await funcionesSQL.getRows(consulta, req, res);
}

const getHcuHospitalizado = async (req, res) => {
  let identificacion = req.params.identificacion;
  const consulta = `SELECT  
                        hc.pk_hcu ,
                        p.apellidopat_persona,
                        p.apellidomat_persona,
                        p.nombre_primario_persona,
                        p.nombre_secundario_persona,
                        p.numidentificacion_persona,
                        calcular_edad_json(p.fecnac_persona::timestamp, now()::timestamp) AS edad,
                        sexo.desc_catdetalle AS sexo,
                        COALESCE((
                        SELECT row_to_json(ch)
                        FROM (
                            SELECT ch.*,
                            a.area_descripcion as area,
                            torre.desc_tipoubi as torre,
                            piso.desc_tipoubi as piso,
                            sala.desc_tipoubi as sala,
                            torre.pk_tipoubi as torre_pk,
                            piso.pk_tipoubi as piso_pk,
                            sala.pk_tipoubi as sala_pk,
                            habitacion.desc_tipoubi as habitacion,
                            u.descripcion_ubicacion as cama
                            FROM ciclo_hospitalizacion ch
                            inner join ubicacion u 
                            left join tipo_ubicacion torre on u.fk_torre = torre.pk_tipoubi
                            left join tipo_ubicacion piso on u.fk_piso = piso.pk_tipoubi
                            left join tipo_ubicacion sala on u.fk_sala = sala.pk_tipoubi 
                            left join tipo_ubicacion habitacion on u.fk_habitacion = habitacion.pk_tipoubi
                            inner join areas a on a.areas_id_pk = u.areas_id_fk
                            on u.pk_ubi=ch.fk_ubi
                            WHERE ch.fk_hcu = hc.pk_hcu
                            AND ch.tipo_ciclohosp = 'INGRESO'
                            AND ch.activo_ciclohosp = true
                            ORDER BY ch.fecha_ciclohosp DESC
                            LIMIT 1
                        ) ch
                        ), NULL) AS ingreso
                    FROM historia_clinica hc 
                    INNER JOIN persona p 
                    ON hc.fk_persona = p.pk_persona
                    INNER JOIN catalogo_detalle sexo 
                    ON p.fk_sexo = sexo.pk_catdetalle
                    WHERE p.numidentificacion_persona = '${identificacion}';
`;
  await funcionesSQL.getRowID(consulta, req, res);
}

const getCensoXId = async (req, res) => {
  let id = req.params.id;
  const consulta = `${consulta_master} where ch.pk_ciclohosp=${id}`;
  await funcionesSQL.getRowID(consulta, req, res);
}

const crudCicloHospitalizacion = async (req, res) => {
  const accion = req.params.accion;
  const body_json = req.body;
  const consulta = `select * from crud_ciclo_hospitalizacion ('${accion}','${JSON.stringify(body_json)}'::json)`;
  await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@       Egresos     @@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
let consulta_egreso_master = `
select 
persona.apellidopat_persona ,
persona.apellidomat_persona ,
concat(persona.nombre_primario_persona,' ',persona.nombre_secundario_persona) as nombres_persona,
persona.numidentificacion_persona,
calcular_edad_json(persona.fecnac_persona::timestamp, now()::timestamp) as edad,
sexo.desc_catdetalle as sexo,
ch.*,
ie.nombre_inecespe,
ie.codigo_inecespe,
cieprincipal.desc_cie as "cie_principal",
cieprincipal.codigo_cie as "cod_cie_principal",
ciesecundario1.desc_cie as "cie_secundario1",
ciesecundario1.codigo_cie as "cod_cie_secundario1",
ciesecundario2.desc_cie as "cie_secundario2",
ciesecundario2.codigo_cie as "cod_cie_secundario2",
ciecausaext.desc_cie as "cie_causaext",
ciecausaext.codigo_cie as "_cod_cie_causaext"
from
ciclo_hospitalizacion ch 
inner join historia_clinica hcu
inner join persona persona
inner join catalogo_detalle sexo on sexo.pk_catdetalle = persona.fk_sexo 
on persona.pk_persona = hcu.fk_persona 
on hcu.pk_hcu  = ch.fk_hcu 
left join inec_especialidades ie on ch.fk_inecespe= ie.pk_inecespe 
left join cie cieprincipal on cieprincipal.pk_cie= ch.fk_cieprincipal 
left join cie ciesecundario1 on ciesecundario1.pk_cie= ch.fk_ciesecundaria1
left join cie ciesecundario2 on ciesecundario2.pk_cie= ch.fk_ciesecundaria2
left join cie ciecausaext on ciecausaext.pk_cie= ch.fk_ciecausaext
where ch.tipo_ciclohosp ='EGRESO'
`;

const getEgresosAll = async (req, res) => {
  const isDefined = (v) =>
    v !== undefined &&
    v !== null &&
    v !== '' &&
    v !== 'null' &&
    v !== 'undefined';
  let { desde } = req.query;
  let consulta_egreso = '';
  // Validación correcta de paginación
  if (isDefined(desde) && !isNaN(Number(desde))) {
    desde = Number(desde);
    consulta_egreso += `${consulta_egreso_master} order by ch.pk_ciclohosp DESC LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
  } else {
    consulta_egreso += `${consulta_egreso_master} order by ch.pk_ciclohosp DESC`;
  }

  await funcionesSQL.getRows(consulta_egreso, req, res);
}

const getEgresosBusqueda = async (req, res) => {
  let valor = req.params.bsq;
  const isDefined = (v) =>
    v !== undefined &&
    v !== null &&
    v !== '' &&
    v !== 'null' &&
    v !== 'undefined';
  let consulta_egreso = '';
  // Validación correcta del estado
  if (isDefined(valor)) {
    consulta_egreso += `${consulta_egreso_master} 
                            and 
                            (persona.apellidopat_persona like upper('%${valor}%') or 
                            persona.apellidomat_persona like upper('%${valor}%') or
                            persona.nombre_primario_persona like upper('%${valor}%') or
                            persona.nombre_secundario_persona like upper('%${valor}%') or
                            persona.numidentificacion_persona like '%${valor}%') order by ch.pk_ciclohosp DESC`;
  } else {
    consulta_egreso += `${consulta_egreso_master} order by ch.pk_ciclohosp DESC`;
  }

  await funcionesSQL.getRows(consulta_egreso, req, res);
}

const getEgresoXId = async (req, res) => {
  let id = req.params.id;
  const consulta = `${consulta_egreso_master} and ch.pk_ciclohosp=${id}`;
  await funcionesSQL.getRowID(consulta, req, res);
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@       Reportes     @@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Consulta Inec
const getReporteEgresosINEC = async (req, res) => {
  try {
    // 1) Parámetros recibidos por params
    const { mes, anio } = req.params;

    const p_mes = parseInt(mes, 10);
    const p_anio = parseInt(anio, 10);

    if (isNaN(p_mes) || isNaN(p_anio)) {
      return res.status(400).json({
        status: 'error',
        message: 'Parámetros mes y/o año inválidos',
      });
    }

    // 2) Ejecutar función PL/pgSQL reporte_egresos_inec
    const consulta = `
      SELECT *
      FROM reporte_egresos_inec(${p_mes}, ${p_anio});
    `;

    const datos_consulta = await funcionesSQL.getArray(consulta);

    // 3) Crear workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // 4) Casa de Salud
    const consulta_casa_salud = `
      SELECT * 
      FROM casas_salud cs
      INNER JOIN institucion i ON cs.ins_id_fk = i.ins_id_pk
      WHERE cs.casalud_principal = true
      LIMIT 1
    `;
    let data_casa_salud = await funcionesSQL.getData(consulta_casa_salud);

    // 5) Encabezados (ya sin logo, filas hacia arriba)
    worksheet.mergeCells('A1', 'G1');
    worksheet.getCell('A1').value = data_casa_salud
      ? data_casa_salud.casalud_descripcion
      : 'CASA DE SALUD';
    worksheet.getCell('A1').font = { size: 18, bold: true };

    worksheet.mergeCells('A2', 'P2');
    worksheet.getCell('A2').value =
      `Reporte de Egresos INEC - Mes: ${p_mes} / Año: ${p_anio} - Generado: ${dayjs2().format('YYYY-MM-DD')}`;
    worksheet.getCell('A2').font = { size: 16, bold: true };

    // 6) Cabeceras (salidas del RETURN TABLE de reporte_egresos_inec)
    const headers = [
      'MES_RECOLECCIÓN_1',
      'No. HISTORIA CLÍNICA _2',
      'TIPO_IDENTIFICACIÓN_3',
      'Número de identificación _4',
      'PRIMER NOMBRE _5',
      'SEGUNDO NOMBRE _5',
      'PRIMER APELLIDO _5',
      'SEGUNDO APELLIDO _5',
      'NACIONALIDAD_6',
      'PAIS_6',
      'SEXO_7',
      'ANIO_8',
      'MES_8',
      'DIA_8',
      'FECHA AAAA/MM/DD _8',
      'TIPO_EDAD_9',
      'EDAD_9',
      'ETNIA_10',
      'TIPO_SEGURO_11',
      'DISCAPACIDAD_12',
      'PROVINCIA_13',
      'CANTON_13',
      'PARROQUIA_13',
      'ANIO_INGRESO_14',
      'MES_INGRESO_14',
      'DIA_INGRESO_14',
      'AAAA/MM/DD_INGRESO_14',
      'HORA_INGRESO_14',
      'ANIO_EGRESO_15',
      'MES_EGRESO_15',
      'DIA_EGRESO_15',
      'AAAA/MM/DD_EGRESO_15',
      'HORA_EGRESO_15',
      'DIAS_ESTADA_16',
      'CONDICION_EGRESO_17',
      'ESPECIALIDAD EGRESO',
      'AFECCIÓN PRINCIPAL_19',
      'OTRAS AFECCIONES_1_19',
      'OTRAS AFECCIONES_2_19',
      'CAUSA EXTERNA_19',
      'CODIGO AFECCIÓN PRINCIPAL_19',
      'CODIGO OTRAS AFECCIONES_1_19',
      'CODIGO OTRAS AFECCIONES_2_19',
      'CODIGO CAUSA EXTERNA_19'
    ];

    const startRow = 4;
    worksheet.getRow(startRow).values = headers;
    worksheet.getRow(startRow).font = { bold: true };

    // 7) Poner datos
    let rowIdx = startRow + 1;

    for (const row of datos_consulta) {
      // Mapear manteniendo orden exacto del RETURN TABLE
      const valores = headers.map((h) => row[h] ?? '');
      worksheet.getRow(rowIdx).values = valores;
      rowIdx++;
    }

    // Ajuste de ancho de columnas
    worksheet.columns = headers.map(() => ({ width: 19 }));

    // 8) Enviar archivo Excel
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="reporte_egresos_inec_${p_mes}_${p_anio}.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error generando Excel INEC:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al generar el reporte Excel INEC',
      error: error.message,
    });
  }
};

//Consulta Pacientes Hospitalizados
const getCensoActualReporte = async (req, res) => {
  try {
    let consulta = `${consulta_master} 
      WHERE tipo_ciclohosp = 'INGRESO' 
        AND ch.activo_ciclohosp = true 
      ORDER BY torre.desc_tipoubi ASC, piso.desc_tipoubi ASC, u.descripcion_ubicacion ASC`;

    let datos_consulta = await funcionesSQL.getArray(consulta);

    // 2) Crear workbook y hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // 3) Casa de Salud
    const consulta_casa_salud = `
      SELECT * 
      FROM casas_salud cs
      INNER JOIN institucion i ON cs.ins_id_fk = i.ins_id_pk
      WHERE cs.casalud_principal = true
      LIMIT 1
    `;
    let data_casa_salud = await funcionesSQL.getData(consulta_casa_salud);

    // 4) Logo (COMENTADO)
    /*
    const logoPath = path.join(__dirname, '../../images/logo_veltimed.png');
    let logoBuffer = null;
    try {
      logoBuffer = fs.readFileSync(logoPath);
    } catch (err) {
      console.error('No se pudo leer el logo:', err.message);
    }

    if (logoBuffer) {
      const imageId = workbook.addImage({
        buffer: logoBuffer,
        extension: 'png',
      });

      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 200, height: 50 }
      });
    }
    */

    // 5) Encabezados (subidos hacia arriba)
    worksheet.mergeCells('A1', 'G1');
    worksheet.getCell('A1').value = data_casa_salud
      ? data_casa_salud.casalud_descripcion
      : 'CASA DE SALUD';
    worksheet.getCell('A1').font = { size: 18, bold: true };
    worksheet.getCell('A1').alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true
    };

    worksheet.mergeCells('A2', 'P2');
    worksheet.getCell('A2').value =
      `Reporte de Censo Actual a la fecha: ${dayjs2().format('YYYY-MM-DD')}`;
    worksheet.getCell('A2').font = { size: 16, bold: true };
    worksheet.getCell('A2').alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true
    };

    // 6) Cabeceras de columnas (también más arriba)
    const startRow = 4;
    const headers = [
      'TORRE',
      'PISO',
      'SALA',
      'HABITACIÓN',
      'CAMA',
      'HCU',
      'PACIENTE',
      'SEXO',
      'EDAD',
      'FECHA INGRESO',
      'MÉDICO'
    ];

    worksheet.getRow(startRow).values = headers;
    worksheet.getRow(startRow).font = { bold: true };

    // 7) Llenar filas con datos
    let rowIdx = startRow + 1;
    for (const row of datos_consulta) {
      worksheet.getRow(rowIdx).values = [
        row.torre || '',
        row.piso || '',
        row.sala || '',
        row.habitacion || '',
        row.ubicacion || '',
        row.numidentificacion_persona || '',
        (row.apellidopat_persona + ' ' + row.apellidomat_persona + ' ' + row.nombres_persona) || '',
        row.sexo || '',
        (row.edad.valor + ' ' + row.edad.tipo) || '',
        row.fecha_ciclohosp || '',
        (row.fecha_creacion_ciclo.apellidopat_persona + ' ' + row.fecha_creacion_ciclo.apellidomat_persona + ' ' + row.fecha_creacion_ciclo.nombre_primario_persona + ' ' + row.fecha_creacion_ciclo.nombre_secundario_persona) || '',
      ];
      rowIdx++;
    }

    // 8) Enviar el archivo Excel en la respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reporte_censo_actual.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
    console.log('Reporte Excel generado y enviado');

  } catch (error) {
    console.error('Error generando reporte Excel:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al generar el reporte Excel',
      error: error.message,
    });
  }
};

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@       Reportes PDF TOTAL    @@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const getPDFTotal = async (req, res) => {
  try {
    const { finalBuffer } = await buildPDFTotalFinalBuffer(req);
    const base64 = finalBuffer.toString('base64');
    return res.json({ status: 'ok', message: base64 });
  } catch (error) {
    const status = error?.status || 500;
    return res.status(status).json({ ok: false, message: error?.message || 'Error generando PDF' });
  }
}

async function buildPDFTotalFinalBuffer(req) {
  const hcu = Number((req.params.hcu ?? '').toString().trim());
  if (!hcu) {
    const err = new Error("Falta 'hcu' válido");
    err.status = 400;
    throw err;
  }

  let opcionesEv = {};
  opcionesEv.hcu = req.params.hcu;

  // 1) Censos del paciente
  //const censos = await getHistorialXHcuData(hcu);

  // 2) Para probar: traer evoluciones de cada censo
  let evolucionesIds = [];
  let emergencia008Ids = [];
  let triageIds = [];
  let anamnesisIds = [];
  let interconsultasIds = [];
  let interconsultasResp = [];
  let epicrisisIds = [];
  let postoperatorioIds = [];


  //*********** HISTORIA CLINICA ****************************** */
  const consulta_hcu = `select *, calcular_edad_json(p.fecnac_persona,CURRENT_DATE) as edad_completa, sexo.desc_catdetalle as sexo  from historia_clinica hcu 
                                inner join persona p 
                                inner join catalogo_detalle sexo on p.fk_sexo = sexo.pk_catdetalle
                                on p.pk_persona = hcu.fk_persona
                                where hcu.pk_hcu=${opcionesEv.hcu}`;
  let data_hcu = await funcionesSQL.getData(consulta_hcu);

  //*********** CASA DE SALUD ****************************** */
  const consulta_casa_salud = `select * from casas_salud cs
                                     inner join institucion i on cs.ins_id_fk = i.ins_id_pk
                                     where cs.casalud_principal =true limit 1`;
  let data_casa_salud = await funcionesSQL.getData(consulta_casa_salud);

  //*********** EVOLUCIONES ****************************** */
  let consultaEv = `select * from getall_evoluciones('${JSON.stringify(opcionesEv)}'::text)`;
  const dataEvResp = await funcionesSQL.getData(consultaEv);
  const data_evo = (dataEvResp?.mensaje?.status === 'ok')
    ? (dataEvResp.mensaje.data ?? [])
    : [];

  // El template `evolucion.html` espera { hcu, casa_salud, data_evo }
  const dataEv = {
    hcu: data_hcu ?? {},
    casa_salud: data_casa_salud ?? {},
    data_evo
  };




  /***********    LOGO **************************************** */
  /* 
    const logoPath = path.join(__dirname, '../../images/logo_veltimed.png');
  
    let logoBase64 = null;
    try {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (err) {
      console.error('No se pudo leer el logo:', err.message);
    } */



  //*********** SIGNOS VITALES ****************************** */
  // B
  const consulta_signos_b = `select * from signos_vitales_b_getall('${JSON.stringify(opcionesEv)}'::text)`;
  let data_b = await funcionesSQL.getData(consulta_signos_b);
  data_b = (data_b?.mensaje?.status === 'ok') ? (data_b.mensaje.data ?? data_b.mensaje) : null;

  // C
  const consulta_signos_c = `select * from signos_vitales_c_getall('${JSON.stringify(opcionesEv)}'::text)`;
  let data_c = await funcionesSQL.getData(consulta_signos_c);
  data_c = (data_c?.mensaje?.status === 'ok') ? (data_c.mensaje.data ?? data_c.mensaje) : null;

  // D
  const consulta_signos_d = `select * from signos_vitales_d_getall('${JSON.stringify(opcionesEv)}'::text)`;
  let data_d = await funcionesSQL.getData(consulta_signos_d);
  data_d = (data_d?.mensaje?.status === 'ok') ? (data_d.mensaje.data ?? data_d.mensaje) : null;

  // E
  const consulta_signos_e = `select * from signos_vitales_e_getall('${JSON.stringify(opcionesEv)}'::text)`;
  let data_e = await funcionesSQL.getData(consulta_signos_e);
  data_e = (data_e?.mensaje?.status === 'ok') ? (data_e.mensaje.data ?? data_e.mensaje) : null;

  // F
  const consulta_signos_f = `select * from signos_vitales_f_getall('${JSON.stringify(opcionesEv)}'::text)`;
  let data_f = await funcionesSQL.getData(consulta_signos_f);
  data_f = (data_f?.mensaje?.status === 'ok') ? (data_f.mensaje.data ?? data_f.mensaje) : null;

  const dataSignos = {
    //logo: logoBase64,
    hcu: data_hcu,
    casa_salud: data_casa_salud,
    seccion_b: data_b ?? [],   // o {} según lo que devuelva tu SP
    seccion_c: data_c ?? [],
    seccion_d: data_d ?? [],
    seccion_e: data_e ?? [],
    seccion_f: data_f ?? [],
  };

  //*********** KARDEX ****************************** */
  let opcionesKardex = {};
  opcionesKardex.hcu = req.params.hcu;

  const consulta_kardex = `select * from kardex_getall('${JSON.stringify(opcionesKardex)}'::text)`;
  let data_kardex_aux = await funcionesSQL.getData(consulta_kardex);
  data_kardex_aux = (data_kardex_aux?.mensaje?.status === 'ok') ? (data_kardex_aux.mensaje.data ?? data_kardex_aux.mensaje) : null;

  // 🔴👉 Unificamos TODO en un solo objeto:
  const data_kardex = {
    //logo: logoBase64,
    hcu: data_hcu,
    casa_salud: data_casa_salud,
    kardex: data_kardex_aux ?? [],
  };

  //*********** EMERGENCIA 008 ****************************** */
  const emergencias008 = await emergencia008Controller.fetchAll008({
    hcu,
    //fecha_desde: desde,
    //fecha_hasta: hasta,
    pageSize: 10000,
  });

  for (let i = 0; i < emergencias008.length; i++) {
    let listEmergenciaxCenso = emergencias008[i];
    let arrayEmergencia008 = listEmergenciaxCenso.mensaje.data;
    if (arrayEmergencia008 == null) {
      arrayEmergencia008 = [];
    }

    for (let j = 0; j < arrayEmergencia008.length; j++) {
      const emergenciaI = arrayEmergencia008[j]; //emergenciaI.logo = logoBase64;
      emergencia008Ids.push(emergenciaI);
    }
  }


  //*********** TRIAGE ****************************** */
  const triage = await triageController.fetchAllTriage({
    hcu,
    //fecha_desde: desde,
    //fecha_hasta: hasta,
    pageSize: 10000,
  });

  for (let i = 0; i < triage.length; i++) {
    let listTriagexCenso = triage[i];
    let arrayTriage = listTriagexCenso.mensaje.data;
    if (arrayTriage == null) {
      arrayTriage = [];
    }

    for (let j = 0; j < arrayTriage.length; j++) {
      const triageI = arrayTriage[j] ?? {};
      // En el PDF individual, TRIAGE usa el SP `emergencia_getaid_triage` (trae el objeto completo).
      // En el PDF total, `emergencia_getall_triage` puede venir "resumido", así que hacemos un fetch por ID.
      const findTriageId = (obj) => {
        if (!obj || typeof obj !== 'object') return undefined;
        const entries = Object.entries(obj);

        const asNum = (v) => {
          const n = Number(v);
          return Number.isFinite(n) ? n : undefined;
        };

        // 1) Keys explícitas conocidas
        const direct =
          obj.pk_triage ??
          obj.pk_tria ??
          obj.pk_tri ??
          obj.pk_emergtriage ??
          obj.pk_emergencia_triage ??
          obj.pk_emergencia ??
          obj.pk ??
          obj.id;
        const directNum = asNum(direct);
        if (directNum) return directNum;

        // 2) Cualquier key que contenga triage/tria y pk/id
        for (const [k, v] of entries) {
          if (!k) continue;
          if (!(/triag|tria/i.test(k) && /(pk|id)/i.test(k))) continue;
          const n = asNum(v);
          if (n) return n;
        }

        // 3) Si SOLO hay un pk_ numérico, usarlo (fallback)
        const pkCandidates = entries
          .filter(([k, v]) => /^pk_/i.test(k) && !/^fk_/i.test(k) && asNum(v))
          .map(([_, v]) => asNum(v))
          .filter(Boolean);
        if (pkCandidates.length === 1) return pkCandidates[0];

        return undefined;
      };

      let triageData = triageI;
      const triageId = findTriageId(triageI);
      if (Number.isFinite(triageId) && triageId > 0) {
        const consulta_tria = `select * from emergencia_getaid_triage(1,'${triageId}')`;
        const triageResp = await funcionesSQL.getData(consulta_tria);
        if (triageResp?.mensaje?.status === 'ok') {
          triageData = triageResp.mensaje.data ?? triageI;
        }
      }

      // Fallback de campos básicos si vienen faltantes
      if (triageData && typeof triageData === 'object') {
        triageData = { ...triageData };
        if (!triageData.institucion && data_casa_salud?.ins_descripcion) triageData.institucion = data_casa_salud.ins_descripcion;
        if (!triageData.casalud_codigo && data_casa_salud?.casalud_codigo) triageData.casalud_codigo = data_casa_salud.casalud_codigo;
        if (!triageData.casalud_descripcion && data_casa_salud?.casalud_descripcion) triageData.casalud_descripcion = data_casa_salud.casalud_descripcion;

        if (!triageData.paciente_numidentificacion && data_hcu?.numidentificacion_persona) triageData.paciente_numidentificacion = data_hcu.numidentificacion_persona;
        if (!triageData.paciente_apellido1 && data_hcu?.apellidopat_persona) triageData.paciente_apellido1 = data_hcu.apellidopat_persona;
        if (!triageData.paciente_apellido2 && data_hcu?.apellidomat_persona) triageData.paciente_apellido2 = data_hcu.apellidomat_persona;
        if (!triageData.paciente_nombre_primario && data_hcu?.nombre_primario_persona) triageData.paciente_nombre_primario = data_hcu.nombre_primario_persona;
        if (!triageData.pacienteo_nombre_secundario && data_hcu?.nombre_secundario_persona) triageData.pacienteo_nombre_secundario = data_hcu.nombre_secundario_persona;

        if (!triageData.edad && data_hcu?.edad_completa) triageData.edad = data_hcu.edad_completa;
      }

      triageIds.push(triageData);
    }
  }

  //*********** ANAMNESIS ****************************** */
  const anamnesis = await anamnesisController.fetchAllAnamnesis({
    hcu,
    //fecha_desde: desde,
    //fecha_hasta: hasta,
    pageSize: 10000,
  });

  for (let i = 0; i < anamnesis.length; i++) {
    let listAnamnesisxCenso = anamnesis[i];
    let arrayAnamnesis = listAnamnesisxCenso.mensaje.data;
    if (arrayAnamnesis == null) {
      arrayAnamnesis = [];
    }

    for (let j = 0; j < arrayAnamnesis.length; j++) {
      const anamnesisI = arrayAnamnesis[j] ?? {};
      // Anamnesis templates usan campos "planos" como `edad_completa` e info de casa de salud (sin prefijo)
      const anamnesisData = {
        ...(data_casa_salud ?? {}),
        ...(data_hcu ?? {}),
        ...anamnesisI,
      };
      if (!anamnesisData.edad_completa && data_hcu?.edad_completa) {
        anamnesisData.edad_completa = data_hcu.edad_completa;
      }
      //anamnesisData.logo = logoBase64
      anamnesisIds.push(anamnesisData);
    }
  }

  //*********** INTERCONSULTA ****************************** */
  const interconsultas = await interconsultaController.fetchAllInterconsulta({
    hcu,
    //fecha_desde: desde,
    //fecha_hasta: hasta,
    pageSize: 10000,
  });

  for (let i = 0; i < interconsultas.length; i++) {
    let listInterconsultasxCenso = interconsultas[i];
    let arrayInterconsultas = listInterconsultasxCenso.mensaje.data;
    if (arrayInterconsultas == null) {
      arrayInterconsultas = [];
    }

    for (let j = 0; j < arrayInterconsultas.length; j++) {
      const interconsulta = arrayInterconsultas[j] ?? {};
      // Interconsulta templates usan campos "planos" como `edad_completa` e info de casa de salud (sin prefijo)
      const interconsultaData = {
        ...(data_casa_salud ?? {}),
        ...(data_hcu ?? {}),
        ...interconsulta,
      };
      if (!interconsultaData.edad_completa && data_hcu?.edad_completa) {
        interconsultaData.edad_completa = data_hcu.edad_completa;
      }
      interconsultasIds.push(interconsultaData);

      let id_sol = interconsulta.pk_intersol;
      const consulta_respuesta = `select * from interconsulta_respuesta_getbysol(1,'${id_sol}')`;
      let data_respuesta = await funcionesSQL.getData(consulta_respuesta);
      if (!data_respuesta.mensaje || data_respuesta.mensaje.status != 'ok') {
        data_respuesta = {};
      }
      else data_respuesta = data_respuesta.mensaje.data; //data_respuesta.logo = logoBase64

      const respuestaData = {
        ...(data_casa_salud ?? {}),
        ...(data_hcu ?? {}),
        ...(data_respuesta ?? {}),
      };
      if (!respuestaData.edad_completa && data_hcu?.edad_completa) {
        respuestaData.edad_completa = data_hcu.edad_completa;
      }
      interconsultasResp.push(respuestaData);
    }
  }

  //*********** EPICRISIS ****************************** */
  const epicrisis = await epicrisisController.fetchAllEpicrisis({
    hcu,
    //fecha_desde: desde,
    //fecha_hasta: hasta,
    pageSize: 10000,
  });

  for (let i = 0; i < epicrisis.length; i++) {
    let listEpicrisisxCenso = epicrisis[i];
    let arrayEpicrisis = listEpicrisisxCenso.mensaje.data;
    if (arrayEpicrisis == null) {
      arrayEpicrisis = [];
    }

    for (let j = 0; j < arrayEpicrisis.length; j++) {
      const epicrisisI = arrayEpicrisis[j] ?? {}; //epicrisisI.logo = logoBase64;
      // Epicrisis templates usan campos "planos" como `edad_completa` e info de casa de salud (sin prefijo)
      const epicrisisData = {
        ...(data_casa_salud ?? {}),
        ...(data_hcu ?? {}),
        ...epicrisisI,
      };
      if (!epicrisisData.edad_completa && data_hcu?.edad_completa) {
        epicrisisData.edad_completa = data_hcu.edad_completa;
      }
      epicrisisIds.push(epicrisisData);
    }
  }

  //*********** PROTOCOLO POSTOPERATORIO ****************************** */
  const postoperatorios = await postoperatorioController.fetchAllPostOperatorio({
    hcu,
    //fecha_desde: desde,
    //fecha_hasta: hasta,
    pageSize: 10000,
  });


  for (let i = 0; i < postoperatorios.length; i++) {
    let listPostoperatorioxCenso = postoperatorios[i];
    let arrayPostoperatorio = listPostoperatorioxCenso.mensaje.data;
    if (arrayPostoperatorio == null) {
      arrayPostoperatorio = [];
    }

    for (let j = 0; j < arrayPostoperatorio.length; j++) {
      const postoperatorio = arrayPostoperatorio[j] ?? {};

      // Protocolo Quirúrgico templates usan campos "planos" (edad_completa, ins_descripcion, numidentificacion_persona, etc.)
      const protoData = {
        ...(data_casa_salud ?? {}),
        ...(data_hcu ?? {}),
        ...postoperatorio,
      };
      if (!protoData.edad_completa && data_hcu?.edad_completa) {
        protoData.edad_completa = data_hcu.edad_completa;
      }
      //Ajusto el logo
      //postoperatorio.logo = logoBase64;
      //Ajusto el diagrama
      const baseUrl = `${req.protocol}://${req.get('host')}`; // e.g. http://localhost:3005

      // El template `protqui2.html` usa `{{diagrama_protope}}`
      // Preferimos embebido (data URI) para que Puppeteer lo renderice siempre.
      if (protoData.diagrama_protope) {
        const raw = protoData.diagrama_protope.toString();
        const alreadyOk = /^data:|^https?:\/\//i.test(raw);
        if (!alreadyOk) {
          const rutaNorm = raw.replace(/\\/g, '/');
          const abs = path.resolve(process.cwd(), rutaNorm);
          try {
            if (fs.existsSync(abs)) {
              const ext = path.extname(abs).toLowerCase();
              const mime = (ext === '.png')
                ? 'image/png'
                : ((ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : null);

              if (mime) {
                const fileBuf = fs.readFileSync(abs);
                protoData.diagrama_protope = `data:${mime};base64,${fileBuf.toString('base64')}`;
              } else {
                protoData.diagrama_protope = `${baseUrl}/postoperatorio/ver/protope?pathprotope=${encodeURIComponent(rutaNorm)}`;
              }
            } else {
              protoData.diagrama_protope = `${baseUrl}/postoperatorio/ver/protope?pathprotope=${encodeURIComponent(rutaNorm)}`;
            }
          } catch (e) {
            protoData.diagrama_protope = `${baseUrl}/postoperatorio/ver/protope?pathprotope=${encodeURIComponent(rutaNorm)}`;
          }
        }
      }

      postoperatorioIds.push(protoData);
    }
  }

  /*********** CARGA DE TEMPLATES HTML ******************* */
  const templatePathsEv = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/evolucion/evolucion.html')
  };

  const templatePathsSignos = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/signos_vitales/signos_vitales.html')
  };

  const templatePathsKardex = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/kardex/kardex.html')
  };
  const templatePathsAnam = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/anamnesis/anamnesis1.html'),
    page2: path.join(__dirname, '../../reportes/hospitalizacion/anamnesis/anamnesis2.html')
  };
  const templatePathsInter = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/interconsulta/interconsulta_solicitud.html'),
    page2: path.join(__dirname, '../../reportes/hospitalizacion/interconsulta/interconsulta_respuesta.html')
  };
  const templatePathsEpi = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/epicrisis/epicrisis1.html'),
    page2: path.join(__dirname, '../../reportes/hospitalizacion/epicrisis/epicrisis2.html')
  };
  const templatePathsProt = {
    page1: path.join(__dirname, '../../reportes/hospitalizacion/protocolo_quirurgico/protqui1.html'),
    page2: path.join(__dirname, '../../reportes/hospitalizacion/protocolo_quirurgico/protqui2.html')
  };

  const templatePathsEmer = {
    page1: path.join(__dirname, '../../reportes/emergencia/008_1.html'),
    page2: path.join(__dirname, '../../reportes/emergencia/008_2.html')
  };

  const templatePathsTriage = {
    page1: path.join(__dirname, '../../reportes/emergencia/triage.html')
  };

  const templateTitle = path.join(__dirname, '../../reportes/shared/section_title.html');

  /*********** CARGA DE DATOS EN TEMPLATES HTML ******************* */
  let pageContents = [];

  // Portadas por sección (una página antes de cada bloque)
  pageContents.push({ templatePath: templateTitle, data: { title: 'EVOLUCIONES' }, landscape: false });
  pageContents.push({ templatePath: templatePathsEv.page1, data: dataEv })

  pageContents.push({ templatePath: templateTitle, data: { title: 'SIGNOS VITALES' }, landscape: true });
  pageContents.push({ templatePath: templatePathsSignos.page1, data: dataSignos })

  pageContents.push({ templatePath: templateTitle, data: { title: 'KARDEX' }, landscape: true });
  pageContents.push({ templatePath: templatePathsKardex.page1, data: data_kardex })

  if (emergencia008Ids.length) {
    pageContents.push({ templatePath: templateTitle, data: { title: 'EMERGENCIA 008' }, landscape: false });
  }
  for (let emer = 0; emer < emergencia008Ids.length; emer++) {
    pageContents.push({ templatePath: templatePathsEmer.page1, data: emergencia008Ids[emer] })
    pageContents.push({ templatePath: templatePathsEmer.page2, data: emergencia008Ids[emer] })
  }

  if (triageIds.length) {
    pageContents.push({ templatePath: templateTitle, data: { title: 'TRIAGE' }, landscape: false });
  }
  for (let triage = 0; triage < triageIds.length; triage++) {
    pageContents.push({ templatePath: templatePathsTriage.page1, data: triageIds[triage] })
  }

  if (anamnesisIds.length) {
    pageContents.push({ templatePath: templateTitle, data: { title: 'ANAMNESIS' }, landscape: false });
  }
  for (let anam = 0; anam < anamnesisIds.length; anam++) {
    pageContents.push({ templatePath: templatePathsAnam.page1, data: anamnesisIds[anam] })
    pageContents.push({ templatePath: templatePathsAnam.page2, data: anamnesisIds[anam] })
  }

  if (interconsultasIds.length) {
    pageContents.push({ templatePath: templateTitle, data: { title: 'INTERCONSULTAS' }, landscape: false });
  }
  for (let inter = 0; inter < interconsultasIds.length; inter++) {
    pageContents.push({ templatePath: templatePathsInter.page1, data: interconsultasIds[inter] })
    pageContents.push({ templatePath: templatePathsInter.page2, data: interconsultasResp[inter] })
  }

  if (epicrisisIds.length) {
    pageContents.push({ templatePath: templateTitle, data: { title: 'EPICRISIS' }, landscape: false });
  }
  for (let epi = 0; epi < epicrisisIds.length; epi++) {
    pageContents.push({ templatePath: templatePathsEpi.page1, data: epicrisisIds[epi] })
    pageContents.push({ templatePath: templatePathsEpi.page2, data: epicrisisIds[epi] })
  }

  if (postoperatorioIds.length) {
    pageContents.push({ templatePath: templateTitle, data: { title: 'PROTOCOLO QUIRURGICO' }, landscape: false });
  }
  for (let post = 0; post < postoperatorioIds.length; post++) {
    pageContents.push({ templatePath: templatePathsProt.page1, data: postoperatorioIds[post] })
    pageContents.push({ templatePath: templatePathsProt.page2, data: postoperatorioIds[post] })
  }

  // PDF mixto: todo vertical excepto Signos Vitales y Kardex (horizontal)
  let buffer = await funcionesSQL.generateBufferPDFMixedOrientation(pageContents);

  //**************** ANEXOS ***************************** */

  const anexos = await anexoController.getAnexosAllData({
    hcu
  });

  let anexoPaths = [];

  for (let an = 0; an < anexos.length; an++) {
    const anexo = anexos[an];
    anexoPaths.push(anexo.ruta_anexos);
  }

  const finalBuffer = await appendAnnexesToPdfBuffer(buffer, anexoPaths, {
    baseDir: process.cwd(),    // o la carpeta base donde están tus rutas relativas
    pageWidth: 595.28,         // A4
    pageHeight: 841.89,
    margin: 36
  });

  /************ FINAL CONFIGURACION DE REPORTE TOTAL ******* */
  const parts = [];
  parts.push(finalBuffer);

  return { hcu, finalBuffer };


}

const getPDFTotalDescarga = async (req, res) => {
  try {
    const { hcu, finalBuffer } = await buildPDFTotalFinalBuffer(req);
    const filename = `historia_${hcu}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', finalBuffer.length);
    return res.status(200).send(finalBuffer);
  } catch (error) {
    const status = error?.status || 500;
    return res.status(status).json({ ok: false, message: error?.message || 'Error generando PDF' });
  }
}

module.exports = {
  getIngresosXHcuVigente,
  getIngresosXAreaPiso,
  getIngresosXAreaTorrePisoSala,
  getCensoXId,
  getIngresosXHcu,
  getHcuHospitalizado,
  crudCicloHospitalizacion,
  getEgresosAll,
  getEgresosBusqueda,
  getEgresoXId,
  getReporteEgresosINEC,
  getCensoActualReporte,
  getPDFTotal,
  getPDFTotalDescarga
}