const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

//* CONSULTA MASTER DE CENSOS TANTO EN INGRESOS O EGRESOS
let consulta_master=`select 
                        ch.*, 
                        p.apellidopat_persona ,
                        p.apellidomat_persona ,
                        concat(p.nombre_primario_persona,' ',p.nombre_secundario_persona) as nombres_persona,
                        p.numidentificacion_persona,
                        a.area_descripcion as area,
                        torre.desc_tipoubi as torre,
                        piso.desc_tipoubi as piso,
                        sala.desc_tipoubi as sala,
                        torre.pk_tipoubi as torre_pk,
                        piso.pk_tipoubi as piso_pk,
                        sala.pk_tipoubi as sala_pk,
                        habitacion.desc_tipoubi as habitacion,
                        u.descripcion_ubicacion as ubicacion,
                        (SELECT row_to_json(ch2.*) 
                        FROM ciclo_hospitalizacion ch2 
                        WHERE ch2.pk_ciclohosp = ch.pk_ciclohosp) AS egreso
                        from ciclo_hospitalizacion ch 
                        inner join historia_clinica hc 
                        inner join persona p on hc.fk_persona =p.pk_persona 
                        on ch.fk_hcu = hc.pk_hcu 
                        inner join ubicacion u 
                        left join tipo_ubicacion torre on u.fk_torre = torre.pk_tipoubi
                        left join tipo_ubicacion piso on u.fk_piso = piso.pk_tipoubi
                        left join tipo_ubicacion sala on u.fk_sala = sala.pk_tipoubi 
                        left join tipo_ubicacion habitacion on u.fk_habitacion = habitacion.pk_tipoubi
                        inner join areas a on a.areas_id_pk = u.areas_id_fk 
                        on u.pk_ubi =ch.fk_ubi 
                        `;

//Consulta por HCU del ultimo ingreso activo es decir esta hospitalizado
const getIngresosXHcuVigente = async (req, res) => {
    let hcu = req.params.hcu;
    //tipo_censo puede ser INGRESO  o EGRESO
    let consulta = `${consulta_master} where ch.fk_hcu=${hcu} and tipo_ciclohosp='INGRESO' order by ch.fecha_ciclohosp desc, ch.hora_ciclohosp desc limit 1`; 
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
    let order =' order by torre.desc_tipoubi asc, piso.desc_tipoubi asc, u.descripcion_ubicacion ASC';

    if (torre != undefined || torre != null || torre != ''){
        consulta = `${consulta} and torre.pk_tipoubi=${torre} `;
    }  
    if (piso != undefined || piso != null || piso != ''){
        consulta = `${consulta} and piso.pk_tipoubi=${piso} `;
    } 
    if (sala != undefined || sala != null || sala != '') {
        consulta = `${consulta} and sala.pk_tipoubi=${sala} `;
    }
    
    consulta = `${consulta}${order}`;
    console.error(consulta);
    
    await funcionesSQL.getRows(consulta, req, res);
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


module.exports = {
    getIngresosXHcuVigente,
    getIngresosXAreaPiso,
    getIngresosXAreaTorrePisoSala,
    getCensoXId,
    crudCicloHospitalizacion
}