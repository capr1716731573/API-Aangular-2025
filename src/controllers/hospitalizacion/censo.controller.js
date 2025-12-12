const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();
const ExcelJS = require('exceljs');
const dayjs2 = require("dayjs");

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
    let consulta_egreso='';
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
    let consulta_egreso='';
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





module.exports = {
    getIngresosXHcuVigente,
    getIngresosXAreaPiso,
    getIngresosXAreaTorrePisoSala,
    getCensoXId,
    getHcuHospitalizado,
    crudCicloHospitalizacion,
    getEgresosAll,
    getEgresosBusqueda,
    getEgresoXId,
    getReporteEgresosINEC,
    getCensoActualReporte
}