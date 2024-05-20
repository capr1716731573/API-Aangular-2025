const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getModulo,
    getModuloBsq,
    getModuloID,
    crudModulo
}=require("../../controllers/administrador/modulo.controller");


const router = express.Router();

// Routes
router.get("/", authenticationJWT.verificarToken,getModulo);
router.get("/bsq/:valor", authenticationJWT.verificarToken,getModuloBsq);
router.get("/id/:id", authenticationJWT.verificarToken,getModuloID);
router.post("/:accion", authenticationJWT.verificarToken,crudModulo);

module.exports=router;