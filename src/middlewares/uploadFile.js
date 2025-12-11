// middlewares/uploadFile.js
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
        if (req.body?.data) {
          const data = JSON.parse(req.body.data);
          pk = data.pk_usuario ?? 'unknown';
        }
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

/* 🔹 Storage ESPECÍFICO para ANEXOS: fk_hcu + nombre original */
const carpetaAnexos = path.join(__dirname, '..', 'uploads', 'anexos');
if (!fs.existsSync(carpetaAnexos)) fs.mkdirSync(carpetaAnexos, { recursive: true });

const storageAnexos = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, carpetaAnexos);
  },
  filename(req, file, cb) {
    // Sanitizar el nombre original para evitar caracteres raros
    const originalSanitizado = file.originalname.replace(/[^\w.\-áéíóúÁÉÍÓÚñÑ]/g, '_');
    cb(null, originalSanitizado);
  }
});

const uploadAnexos = multer({
  storage: storageAnexos,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

module.exports = {
  uploadFirma: crearMiddlewareUpload('firmas', 'firma'),
  uploadSello: crearMiddlewareUpload('sellos', 'sello'),
  uploadProtocoloOperatorio: crearMiddlewareUpload('protocolo', 'protocolo'),
  uploadAnexos, // 👈 este es el nuevo para anexos
};
