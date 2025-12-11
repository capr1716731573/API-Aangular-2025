const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const upload = require('../../middlewares/uploadFile');

const {
    getAnexosAll,
    crudAnexos
}=require("../../controllers/hospitalizacion/anexos.controller");
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/hcu/:hcu", authenticationJWT.verificarToken,getAnexosAll);
router.post("/crud/:accion", authenticationJWT.verificarToken,crudAnexos);
// OJO: arriba tienes algo como:
// const upload = require('../../middlewares/uploadFile');

router.post(
  "/upload",
  //authenticationJWT.verificarToken,
  upload.uploadAnexos.single('archivo'),
  async (req, res) => {
    try {
      const archivo = req.file;

      if (!archivo) {
        return res.status(400).json({ error: 'No se recibió ningún archivo.' });
      }

      // El JSON viene como string desde form-data (campo 'data')
      const dataJSON = JSON.parse(req.body.data);

      // fk_hcu viene en el JSON
      const fk_hcu = dataJSON.fk_hcu;
      if (!fk_hcu) {
        return res.status(400).json({ error: 'fk_hcu es requerido en data.' });
      }

      // Carpeta relativa y absoluta donde Multer guardó el archivo
      const carpetaRelativa = 'src/uploads/anexos';
      const rutaCarpetaAbsoluta = path.resolve(__dirname, '..', '..', '..', carpetaRelativa);

      const nombreOriginal = archivo.filename; // ya viene sanitizado
      const nuevoNombre = `${fk_hcu}_${nombreOriginal}`;

      const rutaOriginalAbsoluta = path.join(rutaCarpetaAbsoluta, nombreOriginal);
      const rutaNuevaAbsoluta = path.join(rutaCarpetaAbsoluta, nuevoNombre);

      // Renombrar el archivo en disco: nombreOriginal -> fk_hcu_nombreOriginal
      await fs.promises.rename(rutaOriginalAbsoluta, rutaNuevaAbsoluta);

      // Guardar la ruta relativa final en el JSON que va al SP
      const rutaRelativa = `${carpetaRelativa}/${nuevoNombre}`;
      dataJSON.ruta_anexos = rutaRelativa;

      // Simular req.body y params para pasar a crudAnexos
      req.body = dataJSON;
      req.params.accion = 'I'; // Inserción

      await crudAnexos(req, res);

    } catch (error) {
      console.error("Error al subir archivo y procesar JSON:", error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);


router.get('/verruta', async (req, res) => {
  try {
    const ruta = req.query.path; // ej: "src/uploads/anexos/123_anexo_1733940000.png"
    console.log('Ruta solicitada:', ruta);

    if (!ruta) {
      return res.status(400).json({ error: 'Parámetro "path" es requerido.' });
    }

    // Seguridad básica: prevenir path traversal
    if (ruta.includes('..')) {
      return res.status(400).json({ error: 'Ruta no permitida.' });
    }

    // Ruta absoluta desde el root del proyecto
    const rutaAbsoluta = path.resolve(__dirname, '..', '..', '..', ruta);
    // __dirname = src/routes/hospitalizacion
    // ../../../ = PROJECT_ROOT
    // + ruta = PROJECT_ROOT/src/uploads/anexos/...

    if (!fs.existsSync(rutaAbsoluta)) {
      return res.status(404).json({ error: 'El archivo no existe.' });
    }

    // Mostrar el archivo en el navegador
    res.sendFile(rutaAbsoluta);

    // Si quisieras forzar descarga:
    // res.download(rutaAbsoluta);

  } catch (error) {
    console.error('Error al servir el archivo:', error);
    res.status(500).json({ error: 'Error interno al intentar visualizar el archivo.' });
  }
});


module.exports=router;