const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllDiagnostico,
    getDiagnosticoID,
    crudDiagnostico
}
=require("../../controllers/emergencia/diagnostico.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/:id_008", authenticationJWT.verificarToken,getAllDiagnostico);
router.get("/id/:id", authenticationJWT.verificarToken,getDiagnosticoID);
router.post("/:accion", authenticationJWT.verificarToken,crudDiagnostico);

module.exports=router;