
const express= require('express');
const {login,verificarUsuarioPerfilModulo}=require("../../controllers/autenticacion/login.controller");


const router = express.Router();

// Routes
router.post("/login", login);
router.get("/login/verificar/:usuario/:perfil/:modulo", verificarUsuarioPerfilModulo);
module.exports=router;
