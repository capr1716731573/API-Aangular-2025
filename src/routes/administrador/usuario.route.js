const express = require('express');
const path = require('path');
const fs = require('fs');
var authenticationJWT = require('../../middlewares/authentication');
const usuario = require("../../controllers/administrador/usuario.controller");
const { uploadFirma, uploadSello } = require('../../middlewares/uploadFile');

const router = express.Router();

// Routes
//Usuario
router.get("/", authenticationJWT.verificarToken, usuario.getUsuario);
router.get("/bsq/:valor", authenticationJWT.verificarToken, usuario.getUsuarioBsq);
router.get("/medicos", authenticationJWT.verificarToken, usuario.getUsuarioMedicos);
router.get("/id/:id", authenticationJWT.verificarToken, usuario.getUsuarioID);
router.post("/crud/:accion", authenticationJWT.verificarToken, usuario.crudUsuario);
router.post("/usu_password/:accion", authenticationJWT.verificarToken, usuario.crudUsuarioPassword);

//Usuario Perfil
router.get("/usu_per/:perfil", authenticationJWT.verificarToken, usuario.getUsuarioPerfil);
router.get("/usu_per2/:usuario", authenticationJWT.verificarToken, usuario.getPerfilUsuario);
router.get("/usu_per/bsq/:perfil/:valor", authenticationJWT.verificarToken, usuario.getUsuarioPerfilBsq);
router.post("/usu_per/:accion", authenticationJWT.verificarToken, usuario.crudUsuarioPerfil);

//Subir la firma y actulizar en la base de datos
router.post(
    '/upload/firma/U',
    //authenticationJWT.verificarToken,
    uploadFirma.single('archivo'), // upload genérico
    async (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ninguna firma.' });
        }

        let data;
        try {
            data = JSON.parse(req.body.data);
        } catch {
            return res.status(400).json({ error: 'El campo data debe ser un JSON válido.' });
        }

        const pk = data.pk_usuario;
        const ext = path.extname(req.file.filename);
        const nuevoNombre = `${pk}_firma_${Date.now()}${ext}`;
        const nuevaRuta = path.join(path.dirname(req.file.path), nuevoNombre);

        try {
            fs.renameSync(req.file.path, nuevaRuta);
        } catch (err) {
            console.error('Error renombrando archivo de firma:', err);
            return res.status(500).json({ error: 'Error interno al renombrar archivo.' });
        }

        data.pathfirma_usuario = path.join('src/uploads/firmas', nuevoNombre);
        req.body = data;
        req.params.accion = 'U';
        next();
    },
    usuario.crudUsuario
);

//Subir el sello y actulizar en la base de datos
router.post(
    '/upload/sello/U',
    //authenticationJWT.verificarToken,
    uploadSello.single('archivo'), // nombre genérico
    async (req, res, next) => {
        if (!req.file) return res.status(400).json({ error: 'No se recibió ningún sello.' });

        let data;
        try {
            data = JSON.parse(req.body.data);
        } catch {
            return res.status(400).json({ error: 'El campo data debe ser un JSON válido.' });
        }

        const pk = data.pk_usuario;
        const ext = path.extname(req.file.filename);
        const nuevoNombre = `${pk}_sello_${Date.now()}${ext}`; 
        const nuevaRuta = path.join(path.dirname(req.file.path), nuevoNombre);

        fs.renameSync(req.file.path, nuevaRuta);

        data.pathsello_usuario = path.join('src/uploads/sellos', nuevoNombre);
        req.body = data;
        req.params.accion = 'U';
        next();
    },
    usuario.crudUsuario
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

router.get('/ver/firma', (req, res) => {
    serveStoredPath(req, res, 'pathfirma');
});

router.get('/ver/sello', (req, res) => {
    serveStoredPath(req, res, 'pathsello');
});
module.exports = router;