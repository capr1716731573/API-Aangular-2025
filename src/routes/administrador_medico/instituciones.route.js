const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getInstituciones,
    getInstitucionesBsq,
    getInstitucionesID,
    crudInstituciones
}=require("../../controllers/administrador_medico/instituciones.controller");


const router = express.Router();

// Routes
router.get("/", authenticationJWT.verificarToken,getInstituciones);
router.get("/bsq/:valor", authenticationJWT.verificarToken,getInstitucionesBsq);
router.get("/id/:id", authenticationJWT.verificarToken,getInstitucionesID);
router.post("/:accion", authenticationJWT.verificarToken,crudInstituciones);

module.exports=router;