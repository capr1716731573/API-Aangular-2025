const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const usuario = require("../../controllers/administrador/usuario.controller");


const router = express.Router();

// Routes
//Usuario
router.get("/", authenticationJWT.verificarToken,usuario.getUsuario);
router.get("/bsq/:valor", authenticationJWT.verificarToken,usuario.getUsuarioBsq);
router.get("/id/:id", authenticationJWT.verificarToken,usuario.getUsuarioID);
router.post("/crud/:accion", authenticationJWT.verificarToken,usuario.crudUsuario);
router.post("/usu_password/:accion", authenticationJWT.verificarToken,usuario.crudUsuarioPassword);

//Usuario Perfil
router.get("/usu_per/:perfil", authenticationJWT.verificarToken,usuario.getUsuarioPerfil);
router.get("/usu_per2/:usuario", authenticationJWT.verificarToken,usuario.getPerfilUsuario);
router.get("/usu_per/bsq/:perfil/:valor", authenticationJWT.verificarToken,usuario.getUsuarioPerfilBsq);
router.post("/usu_per/:accion", authenticationJWT.verificarToken,usuario.crudUsuarioPerfil);


module.exports=router;