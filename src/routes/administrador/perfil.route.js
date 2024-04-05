const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const perfil = require("../../controllers/administrador/perfil.controller");


const router = express.Router();

// Routes
//Geografia
router.get("/", authenticationJWT.verificarToken,perfil.getPerfil);
router.get("/bsq/:valor", authenticationJWT.verificarToken,perfil.getPerfilBsq);
router.get("/id/:id", authenticationJWT.verificarToken,perfil.getPerfilID);
router.post("/:accion", authenticationJWT.verificarToken,perfil.crudPerfil);

module.exports=router;