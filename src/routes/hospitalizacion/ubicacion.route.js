const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getUbicacionAll,
    getUbicacionAllXEstado,
    getUbicacionXArea,
    getUbicacionXAreaEstado,
    getUbicacionXId,
    crudUbicacion
}=require("../../controllers/hospitalizacion/ubicacion.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/all", authenticationJWT.verificarToken,getUbicacionAll);
router.get("/est/:estado", authenticationJWT.verificarToken,getUbicacionAllXEstado);
router.get("/area/:area", authenticationJWT.verificarToken,getUbicacionXArea);
router.get("/est-area/:estado/:area", authenticationJWT.verificarToken,getUbicacionXAreaEstado);
router.get("/id/:id", authenticationJWT.verificarToken,getUbicacionXId);
router.post("/:accion", authenticationJWT.verificarToken,crudUbicacion);

module.exports=router;