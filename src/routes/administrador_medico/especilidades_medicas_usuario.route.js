const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getEspecialidadesUsuario,
    getEspecialidadesUsuarioBsq,
    getEspecialidadesUsuarioID,
    crudEspecialidadesUsuario
}=require("../../controllers/administrador_medico/especilidades_medicas_usuario.controller");


const router = express.Router();

// Routes
router.get("/", authenticationJWT.verificarToken,getEspecialidadesUsuario);
router.get("/bsq/:valor", authenticationJWT.verificarToken,getEspecialidadesUsuarioBsq);
router.get("/id/:id", authenticationJWT.verificarToken,getEspecialidadesUsuarioID);
router.post("/:accion", authenticationJWT.verificarToken,crudEspecialidadesUsuario);

module.exports=router;