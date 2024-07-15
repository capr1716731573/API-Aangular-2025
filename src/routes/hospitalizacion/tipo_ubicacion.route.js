const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getTipoUbicacionAll,
    getTipoUbicacionXTipo,
    getTipoUbicacionXId,
    crudTipoUbicacion
}=require("../../controllers/hospitalizacion/tipo_ubicacion.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/all", authenticationJWT.verificarToken,getTipoUbicacionAll);
router.get("/tipo/:tipo", authenticationJWT.verificarToken,getTipoUbicacionXTipo);
router.get("/id/:id", authenticationJWT.verificarToken,getTipoUbicacionXId);
router.post("/:accion", authenticationJWT.verificarToken,crudTipoUbicacion);

module.exports=router;