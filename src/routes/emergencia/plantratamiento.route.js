const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllTratamiento,
    getTratamientoID,
    crudTratamiento
}
=require("../../controllers/emergencia/plantratamiento.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/:id_008", authenticationJWT.verificarToken,getAllTratamiento);
router.get("/id/:id", authenticationJWT.verificarToken,getTratamientoID);
router.post("/:accion", authenticationJWT.verificarToken,crudTratamiento);

module.exports=router;