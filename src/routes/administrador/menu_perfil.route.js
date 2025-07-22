const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const menu_perfil = require("../../controllers/administrador/menu_perfil.controller");


const router = express.Router();

// Routes
//Geografia
router.get("/", authenticationJWT.verificarToken,menu_perfil.getMenuAll);
router.get("/m_perfil/:perfil/:estado", authenticationJWT.verificarToken,menu_perfil.getMenuAllByPerfil);
router.get("/menu_perfil/padres/:padre", authenticationJWT.verificarToken,menu_perfil.getMenuPadresHijos);
router.get("/m_perfil/:perfil", authenticationJWT.verificarToken,menu_perfil.getMenuAllByPerfil2);
router.get("/m_perfil2/todos/:perfil", authenticationJWT.verificarToken,menu_perfil.getMenuAllByPerfilTodos);
router.get("/m_perfil/:perfil/:modulo/:estado", authenticationJWT.verificarToken,menu_perfil.getMenuAllByPerfilModulo);
router.post("/:accion", authenticationJWT.verificarToken,menu_perfil.crudMenu);
router.post("/m_perfil2/:accion", authenticationJWT.verificarToken,menu_perfil.crudMenuPerfil);

module.exports=router;