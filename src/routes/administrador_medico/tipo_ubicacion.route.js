const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getTipoUbicacion,
    getTipoUbicacionsBsq,
    getTipoUbicacionID,
    crudTipoUbicacion
}=require("../../controllers/administrador_medico/tipo_ubicacion.controller");


const router = express.Router();

// Routes
router.get("/todos/:estado/:tipo", authenticationJWT.verificarToken,getTipoUbicacion);
router.get("/bsq/:estado/:tipo/:valor", authenticationJWT.verificarToken,getTipoUbicacionsBsq);
router.get("/id/:id", authenticationJWT.verificarToken,getTipoUbicacionID);
router.post("/:accion", authenticationJWT.verificarToken,crudTipoUbicacion);

module.exports=router;