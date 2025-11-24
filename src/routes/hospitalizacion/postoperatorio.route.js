const express= require('express');
const path = require('path');
const fs = require('fs');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllPostoperatorio,
    getPostoperatorio_Fechas,
    getPostoperatorio_ID,
    crud_Postoperatorio,
    getAllDiagnosticoPostoperatorio,
    getDiagnosticoID_Postoperatorio,
    crudDiagnostico_Postoperatorio,    
    getAllMedicosPostoperatorio,
    getMedicosID_Postoperatorio,
    crudMedicos_Postoperatorio,
    reporte_descarga,
    reporte_frame,
    reporte008_descarga1,
    reporte008_frame1
}=require("../../controllers/hospitalizacion/postoperatorio.controller");
const { uploadProtocoloOperatorio} = require('../../middlewares/uploadFile');


const router = express.Router();

// Routes
//Postoperatorio
router.get("/ptope/all/:hcu", authenticationJWT.verificarToken,getAllPostoperatorio);
router.get("/ptope/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getPostoperatorio_Fechas);
router.get("/ptope/id/:opcion/:id", authenticationJWT.verificarToken,getPostoperatorio_ID);
router.post("/ptope/:accion", authenticationJWT.verificarToken,crud_Postoperatorio);
/*Multiples Paginas*/
router.get("/ptope/rep_descarga/:id",reporte_descarga);
router.get("/ptope/rep_frame/:id",reporte_frame);

//Diagnostico
router.get("/diag/:id_post", authenticationJWT.verificarToken,getAllDiagnosticoPostoperatorio);
router.get("/diag/id/:id", authenticationJWT.verificarToken,getDiagnosticoID_Postoperatorio);
router.post("/diag/:accion", authenticationJWT.verificarToken,crudDiagnostico_Postoperatorio);

//Medicos
router.get("/med/:id_post", authenticationJWT.verificarToken,getAllMedicosPostoperatorio);
router.get("/med/id/:id", authenticationJWT.verificarToken,getMedicosID_Postoperatorio);
router.post("/med/:accion", authenticationJWT.verificarToken,crudMedicos_Postoperatorio);

//Accion del Anexo del Diagrama seccion i
//Subir la firma y actulizar en la base de datos
router.post(
    '/upload/ptope/U',
    //authenticationJWT.verificarToken,
    uploadProtocoloOperatorio.single('archivo'), // upload genérico
    async (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ninguna diagrama.' });
        }

        let data;
        try {
            data = JSON.parse(req.body.data);
        } catch {
            return res.status(400).json({ error: 'El campo data debe ser un JSON válido.' });
        }

        const pk = data._a.pk_protope;
        console.log(data);
        const ext = path.extname(req.file.filename);
        const nuevoNombre = `${pk}_protocolo_${Date.now()}${ext}`;
        const nuevaRuta = path.join(path.dirname(req.file.path), nuevoNombre);

        try {
            fs.renameSync(req.file.path, nuevaRuta);
        } catch (err) {
            console.error('Error renombrando archivo de firma:', err);
            return res.status(500).json({ error: 'Error interno al renombrar archivo.' });
        }

        data._i.diagrama_protope = path.join('src/uploads/protocolo', nuevoNombre);
        req.body = data;
        req.params.accion = 'U';
        next();
    },
    crud_Postoperatorio
);

//Visualizar Firma y Sello
const PROYECTO_ROOT = path.resolve(__dirname, '..', '..','..'); // raíz del proyecto

function serveStoredPath(req, res, queryKey) {
    const rutaDB = req.query[queryKey];
    if (!rutaDB) return res.status(400).json({ error: `Parámetro "${queryKey}" es requerido.` });

    // Normaliza la ruta cambiando '\ ' por '/'
    const rutaNormalizada = rutaDB.replace(/\\/g, '/');

    // Construye ruta absoluta desde la base del proyecto
    const rutaAbs = path.resolve(PROYECTO_ROOT, rutaNormalizada);

    // Verifica que la ruta esté dentro del proyecto
    if (!rutaAbs.startsWith(PROYECTO_ROOT)) {
        return res.status(400).json({ error: 'Ruta inválida o fuera del directorio permitido.' });
    }
    if (!fs.existsSync(rutaAbs)) {
        return res.status(404).json({ error: 'Archivo no encontrado.' });
    }

    res.sendFile(rutaAbs);
}

router.get('/ver/protope', (req, res) => {
    serveStoredPath(req, res, 'pathprotope');
});

module.exports=router;