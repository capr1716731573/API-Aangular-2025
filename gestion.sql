CREATE OR REPLACE FUNCTION public.crud_anamnesis(opcion character varying, obj_json json, OUT mensaje json)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
  registro json;
BEGIN
  -- Valida que la opción ingresada sea correcta
  IF opcion IS NULL OR opcion NOT IN ('I', 'U', 'D') THEN
    mensaje := json_build_object(
      'status', 'error', 
      'funcion', 'crud_anamnesis',
      'message', 'Debe ingresar una opción válida'
    );
    RETURN;
  END IF;

  -- Valida que el json enviado sea un json bien armado
  IF NOT validar_formato_json(obj_json::text) THEN
    mensaje := json_build_object(
      'status', 'error', 
      'funcion', 'crud_anamnesis',
      'message', 'Formato JSON no válido!!'
    );
    RETURN;
  END IF;

  IF opcion = 'I' THEN
    INSERT INTO anamnesis(
        fecha_creacion_anam, 
        casalud_id_fk, 
        fk_hcu, 
        estado_anam, 
        motivo_consulta_anam,
        antec_personales_anam,
        antec_familiares_anam,
        enfermedad_problema_anam,
        revision_orgsis_anam,
        examen_fisico_anam,
        plan_tratamiento_anam,
        medico_usu_id_fk,
        fecha_inicio,
        hora_inicio
    ) VALUES (
      (json_build_object('usu_id_fk',(obj_json->'_k'->>'medico_usu_id_fk')::int8,'fecha',CURRENT_DATE,'hora',CURRENT_TIME)),
      (obj_json->'_a'->>'casalud_id_fk')::int8,
      (obj_json->'_a'->>'fk_hcu')::int8,
      (obj_json->'_a'->>'estado_anam')::bool,
      (obj_json->>'_b')::json,
      (obj_json->>'_c')::json,
      (obj_json->>'_d')::json,
      upper((obj_json->'_e'->>'observacion_e')::text),
      (obj_json->>'_g')::json,
      (obj_json->>'_h')::json,
      upper((obj_json->'_j'->>'observacion_j')::text),
      (obj_json->'_k'->>'medico_usu_id_fk')::int8,
      CURRENT_DATE,
      CURRENT_TIME
    ) RETURNING 
	json_build_object(
	  '_a', jsonb_build_object(
            'pk_anam', pk_anam,
            'casalud_id_fk', casalud_id_fk,
            'fk_hcu', fk_hcu,
            'estado_anam', estado_anam
        ),
	  '_b', motivo_consulta_anam,
	  '_c', antec_personales_anam,
	  '_d', antec_familiares_anam,
	  '_e', enfermedad_problema_anam,
      '_g', revision_orgsis_anam,
      '_h', examen_fisico_anam,
      '_j', plan_tratamiento_anam,
	  '_k',jsonb_build_object('medico_usu_id_fk', medico_usu_id_fk),
	  'fecha_inicio', fecha_inicio,
	  'hora_inicio', hora_inicio,
	  'fecha_fin', fecha_fin,
	  'hora_fin', hora_fin,
	  'fecha_creacion_anam',fecha_creacion_anam,
	  'fecha_modificacion_anam',fecha_modificacion_anam
	) INTO registro;

    mensaje := json_build_object(
      'status', 'ok',
      'funcion', 'crud_anamnesis',
      'message', 'Registro creado',
      'data', registro
    );
    RETURN;

  ELSIF opcion = 'U' THEN
    UPDATE anamnesis SET
      fecha_modificacion_008 = (json_build_object('usu_id_fk',(obj_json->'_k'->>'medico_usu_id_fk')::int8,'fecha',CURRENT_DATE,'hora',CURRENT_TIME)),
      casalud_id_fk = (obj_json->'_a'->>'casalud_id_fk')::int8,
      fk_hcu = (obj_json->'_a'->>'fk_hcu')::int8,
      estado_anam = (obj_json->'_a'->>'estado_anam')::bool,
      motivo_consulta_anam = (obj_json->>'_b')::json,
      antec_personales_anam= (obj_json->>'_c')::json,
      antec_familiares_anam= (obj_json->>'_d')::json, 
      enfermedad_problema_anam = upper((obj_json->'_e'->>'observacion_e')::text),
      revision_orgsis_anam = (obj_json->>'_g')::json,
      examen_fisico_anam =  (obj_json->>'_h')::json,
      plan_tratamiento_anam = upper((obj_json->'_j'->>'observacion_j')::text),
      medico_usu_id_fk = (obj_json->'_k'->>'medico_usu_id_fk')::int8,
      fecha_fin=current_date,
      hora_fin=current_time 
    WHERE pk_anam = (obj_json->'_a'->>'pk_anam')::int8
    RETURNING 
	json_build_object(
	  '_a', jsonb_build_object(
            'pk_anam', pk_anam,
            'casalud_id_fk', casalud_id_fk,
            'fk_hcu', fk_hcu,
            'estado_anam', estado_anam
        ),
	  '_b', motivo_consulta_anam,
	  '_c', antec_personales_anam,
	  '_d', antec_familiares_anam,
	  '_e', enfermedad_problema_anam,
      '_g', revision_orgsis_anam,
      '_h', examen_fisico_anam,
      '_j', plan_tratamiento_anam,
	  '_k',jsonb_build_object('medico_usu_id_fk', medico_usu_id_fk),
	  'fecha_inicio', fecha_inicio,
	  'hora_inicio', hora_inicio,
	  'fecha_fin', fecha_fin,
	  'hora_fin', hora_fin,
	  'fecha_creacion_anam',fecha_creacion_anam,
	  'fecha_modificacion_anam',fecha_modificacion_anam
	) INTO registro;

    mensaje := json_build_object(
      'status', 'ok',
      'funcion', 'crud_anamnesis',
      'message', 'Registro actualizado',
      'data', registro
    );
    RETURN;

  ELSIF opcion = 'D' THEN
    DELETE FROM anamnesis
    WHERE pk_anam = (obj_json->'_a'->>'pk_anam')::int8;

    mensaje := json_build_object(
      'status', 'ok',
      'funcion', 'crud_anamnesis',
      'message', 'Registro eliminado'
    );
    RETURN;
  END IF;

 --JSON DE ejemplo para ejecutar crud
 /*
{
    "_a":{
        "pk_anam":0,
        "casalud_id_fk":0,
        "fk_hcu":0,
        "fecha_inicio":null,
	    "hora_inicio":null,
        "estado_anam":false
    },
    "_b":{
        "tipoConsulta": "PRIMERA", 
        "descripcion":null
    },  
    "_c": {
        "cardiopatia": true,
        "hipertension": true,
        "enfermedadCerebrovascular": false,
        "endocrinoMetabolico": false,
        "cancer": false,
        "tuberculosis": false,
        "enfermedadMental": false,
        "enfermedadInfecciosa": true,
        "malformacion": false,
        "otro": false,
        "observacion_c":null
    },
    "_d": {
        "cardiopatia": false,
        "hipertension": false,
        "enfermedadCerebrovascular": true,
        "endocrinoMetabolico": false,
        "cancer": true,
        "tuberculosis": false,
        "enfermedadMental": false,
        "enfermedadInfecciosa": false,
        "malformacion": false,
        "otros": false,
        "observacion_d":null
    },
    "_e": {
        "observacion_e":null
    },
    "_g": {
        "piel_anexos": false,
        "organos_sentidos": false,
        "respiratorio": false,
        "cardio": false,
        "digestivo": false,
        "genito": false,
        "musculo":false,
        "endocrino": false,
        "hemo":false,
        "nervioso": false,
        "observacion_g":null
    },
    "_h":{
        "piel_faneras": false,
        "cabeza": false,
        "ojos": false,
        "oidos": false,
        "nariz": false,
        "boca": false,
        "oro_faringe":false,
        "cuello": false,
        "axilas_mamas":false,
        "torax": false,
        "abdomen": false,
        "columna_vertebral": false,
        "ingle_perine": false,
        "miembros_superiores": false,
        "miembros_inferiores": false,
        "observacion_h": null
    },
    "_j": {
        "observacion_j": null
      },
      "_k":{
        "medico_usu_id_fk":null,
        "fecha_fin":null,
	    "hora_fin":null
      },
      "auditoria":{
        "fecha_creacion_anam":null,
        "fecha_modificacion_anam":null
      }
}




  * */
 
EXCEPTION WHEN OTHERS THEN
  mensaje := json_build_object(
    'status', 'error',
    'funcion', 'crud_anamnesis',
    'message', SQLERRM
  );
  RETURN;
END;
$function$
;

