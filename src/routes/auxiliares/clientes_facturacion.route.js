const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getPersonaFacturacion,
    getPersonaFacturacionID,
    getPersonaFacturacionBsq,
    crudPersonaFacturacion
}=require("../../controllers/auxiliares/clientes_facturacion.controller");


const router = express.Router();

// Routes
//Clientes Facturacion
router.get("/", authenticationJWT.verificarToken,getPersonaFacturacion);
router.get("/bsq/:valor", authenticationJWT.verificarToken,getPersonaFacturacionBsq);
router.get("/id/:id", authenticationJWT.verificarToken,getPersonaFacturacionID);
router.post("/:accion", authenticationJWT.verificarToken,crudPersonaFacturacion);

module.exports=router;