const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const menu_perfil = require("../../controllers/administrador/menu_perfil.controller");


const router = express.Router();

// Routes
//Geografia
router.get("/", authenticationJWT.verificarToken,menu_perfil.getMenuAll);
router.get("/m_perfil/:perfil/:estado", authenticationJWT.verificarToken,menu_perfil.getMenuAllByPerfil);
router.get("/m_perfil/:perfil/:modulo/:estado", authenticationJWT.verificarToken,menu_perfil.getMenuAllByPerfilModulo);
router.post("/:accion", authenticationJWT.verificarToken,menu_perfil.crudMenu);
router.post("/m_perfil/:accion", authenticationJWT.verificarToken,menu_perfil.crudMenuPerfil);

module.exports=router;