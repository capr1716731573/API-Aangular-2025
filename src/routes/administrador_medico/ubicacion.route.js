const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getUbicacion,
    getUbicacionBsq,
    getUbicacionID,
    crudUbicacion
}=require("../../controllers/administrador_medico/ubicacion.controller");


const router = express.Router();

// Routes
router.get("/todos/:estado/:area", authenticationJWT.verificarToken,getUbicacion);
router.get("/bsq/:estado/:area/:valor", authenticationJWT.verificarToken,getUbicacionBsq);
router.get("/id/:id", authenticationJWT.verificarToken,getUbicacionID);
router.post("/:accion", authenticationJWT.verificarToken,crudUbicacion);

module.exports=router;