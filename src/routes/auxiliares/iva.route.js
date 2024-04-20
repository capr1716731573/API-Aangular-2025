const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getIvaParametros,
    getIvaParametrosID,
    crudIvaParametros
}=require("../../controllers/auxiliares/iva.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/", authenticationJWT.verificarToken,getIvaParametros);
router.get("/id/:id", authenticationJWT.verificarToken,getIvaParametrosID);
router.post("/:accion", authenticationJWT.verificarToken,crudIvaParametros);

module.exports=router;