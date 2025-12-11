const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();
const variablesEntorno = process.env;
const path = require('path');
const fs = require('fs');

const getAnexosAll = async (req, res) => {
    const isDefined = (v) =>
        v !== undefined &&
        v !== null &&
        v !== '' &&
        v !== 'null' &&
        v !== 'undefined';
    let { desde } = req.query;
    let hcu = req.params.hcu;
    let consulta = `select * from anexos a where a.fk_hcu =${hcu} `;
    // Validación correcta de paginación
    if (isDefined(desde) && !isNaN(Number(desde))) {
        desde = Number(desde);
        consulta = `${consulta} order by pk_anexos DESC LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    } else {
        consulta = `${consulta} order pk_anexos DESC`;
    }

    await funcionesSQL.getRows(consulta, req, res);
}


/* const crudAnexos = async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_anexos ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
} */


const crudAnexos = async (req, res) => {
  // Normalizo la acción: quito espacios y la paso a mayúsculas
  const accion = (req.params.accion || '').toString().trim().toUpperCase();
  const body_json = req.body || {};

  console.log('crudAnexos -> accion:', accion);
  console.log('crudAnexos -> body_json:', body_json);

  // Si es eliminación ('D'), intentamos borrar el archivo físico
  if (accion === 'D' && body_json.ruta_anexos) {
    const rutaRelativa = body_json.ruta_anexos; 
    console.log('Intentando eliminar archivo ruta_relativa:', rutaRelativa);

    // Seguridad básica
    if (!rutaRelativa.includes('..')) {
      const rutaAbsoluta = path.resolve(__dirname, '..', '..', '..', rutaRelativa);
      console.log('Ruta absoluta a eliminar:', rutaAbsoluta);

      try {
        if (fs.existsSync(rutaAbsoluta)) {
          await fs.promises.unlink(rutaAbsoluta);
          console.log('Anexo eliminado del servidor:', rutaAbsoluta);
        } else {
          console.warn('Archivo a eliminar no existe:', rutaAbsoluta);
        }
      } catch (err) {
        console.error('Error eliminando archivo de anexo:', err.message);
        // seguimos igual con el SP
      }
    } else {
      console.warn('ruta_anexos contiene "..", no se intenta eliminar archivo.');
    }
  } else {
    console.log('No se entra en eliminación de archivo. accion !== "D" o falta ruta_anexos.');
  }

  const consulta = `select * from crud_anexos ('${accion}','${JSON.stringify(body_json)}'::json)`;
  console.log('Ejecutando consulta:', consulta);

  await funcionesSQL.crud_StoreProcedure(consulta, req, res);
};

module.exports = {
  crudAnexos,
  // los demás exports...
};



module.exports = {
    getAnexosAll,
    crudAnexos,
}