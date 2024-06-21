const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getValidarIdentificacion
}=require("../../controllers/auxiliares/validar_cedula.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/:tipo/:num", authenticationJWT.verificarToken,getValidarIdentificacion);
module.exports=router;