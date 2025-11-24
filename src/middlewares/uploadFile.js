const multer = require('multer');
const path = require('path');
const fs = require('fs');

const crearMiddlewareUpload = (subcarpeta, sufijo) => {
  const carpeta = path.join(__dirname, '..', 'uploads', subcarpeta);
  if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, carpeta);
    },
    filename(req, file, cb) {
      let pk = 'unknown';
      try {
        // Solo funciona si data se envía antes del archivo
        const data = JSON.parse(req.body.data);
        pk = data.pk_usuario ?? 'unknown';
      } catch {
        console.warn('No se pudo leer pk_usuario en filename');
      }
      const ext = path.extname(file.originalname);
      const nombre = `${pk}_${sufijo}_${Date.now()}${ext}`;
      cb(null, nombre);
    }
  });

  return multer({ storage });
};

module.exports = {
  uploadFirma: crearMiddlewareUpload('firmas', 'firma'),
  uploadSello: crearMiddlewareUpload('sellos', 'sello'),
  uploadProtocoloOperatorio: crearMiddlewareUpload('protocolo', 'protocolo'),
};
