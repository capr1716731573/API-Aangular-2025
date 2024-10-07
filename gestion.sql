-- DROP FUNCTION public.interconsulta_crud_diagnosticos(in varchar, in json, out json);

CREATE OR REPLACE FUNCTION public.interconsulta_crud_diagnosticos(opcion character varying, obj_json json, OUT mensaje json)
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
      'funcion', 'interconsulta_crud_diagnosticos',
      'message', 'Debe ingresar una opción válida'
    );
    RETURN;
  END IF;

  -- Valida que el json enviado sea un json bien armado
  IF NOT validar_formato_json(obj_json::text) THEN
    mensaje := json_build_object(
      'status', 'error', 
      'funcion', 'interconsulta_crud_diagnosticos',
      'message', 'Formato JSON no válido!!'
    );
    RETURN;
  END IF;

  IF opcion = 'I' THEN
    INSERT INTO interconsulta_diagnosticos(
      fk_interconsulta, 
      tipo_interconsulta,
      fk_cie, 
      fecha_creacion_interdiag, 
      tipo_interdiag
    ) VALUES (
      (obj_json->>'fk_interconsulta')::int8,
      (obj_json->>'tipo_interconsulta')::text,
      (obj_json->>'fk_cie')::int8,
      (obj_json->>'fecha_creacion_interdiag')::json,
      (obj_json->>'tipo_interdiag')::text
    ) RETURNING 
    json_build_object(
      'pk_interdiag', pk_interdiag,
      'fk_interconsulta', fk_interconsulta,
      'tipo_interconsulta',tipo_interconsulta,
      'fk_cie', fk_cie,
      'fecha_creacion_interdiag', fecha_creacion_interdiag,
      'fecha_modificacion_interdiag', fecha_modificacion_interdiag,
      'tipo_interdiag', tipo_interdiag
    ) INTO registro;

    mensaje := json_build_object(
      'status', 'ok',
      'funcion', 'interconsulta_crud_diagnosticos',
      'message', 'Registro creado',
      'data', registro
    );
    RETURN;

  ELSIF opcion = 'U' THEN
    UPDATE interconsulta_diagnosticos SET
      fk_interconsulta = (obj_json->>'fk_interconsulta')::int8,
      tipo_interconsulta = (obj_json->>'tipo_interconsulta')::text,
      fk_cie = (obj_json->>'fk_cie')::int8,
      fecha_modificacion_interdiag = (obj_json->>'fecha_modificacion_interdiag')::json,
      tipo_interdiag = (obj_json->>'tipo_interdiag')::text
    WHERE pk_interdiag = (obj_json->>'pk_interdiag')::int4
   RETURNING 
    json_build_object(
      'pk_interdiag', pk_interdiag,
      'fk_interconsulta', fk_interconsulta,
      'tipo_interconsulta',tipo_interconsulta,
      'fk_cie', fk_cie,
      'fecha_creacion_interdiag', fecha_creacion_interdiag,
      'fecha_modificacion_interdiag', fecha_modificacion_interdiag,
      'tipo_interdiag', tipo_interdiag
    ) INTO registro;

    mensaje := json_build_object(
      'status', 'ok',
      'funcion', 'interconsulta_crud_diagnosticos',
      'message', 'Registro actualizado',
      'data', registro
    );
    RETURN;

  ELSIF opcion = 'D' THEN
    DELETE FROM interconsulta_diagnosticos
    WHERE pk_interdiag = (obj_json->>'pk_interdiag')::int4;

    mensaje := json_build_object(
      'status', 'ok',
      'funcion', 'interconsulta_crud_diagnosticos',
      'message', 'Registro eliminado'
    );
    RETURN;
  END IF;

 /*
  {
    "pk_interdiag": 0,
    "fk_interconsulta": 0,
    "tipo_interconsulta":null,
    "fk_cie": 0,
    "fecha_creacion_interdiag": null,
    "fecha_modificacion_interdiag": null,
    "tipo_interdiag": null,
}
  * */
 
EXCEPTION WHEN OTHERS THEN
  mensaje := json_build_object(
    'status', 'error',
    'funcion', 'interconsulta_crud_diagnosticos',
    'message', SQLERRM
  );
  RETURN;
END;
$function$
;
