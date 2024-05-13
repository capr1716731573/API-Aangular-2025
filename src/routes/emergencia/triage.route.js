const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllTriage,
    getTriageBsq,
    getTriageFechas,
    getTriageID,
    crudTriage
}=require("../../controllers/emergencia/triage.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/all/", authenticationJWT.verificarToken,getAllTriage);
router.get("/bsq/:valor", authenticationJWT.verificarToken,getTriageBsq);
router.get("/fechas/:f1/:f2", authenticationJWT.verificarToken,getTriageFechas);
router.get("/id/:opcion/:id", authenticationJWT.verificarToken,getTriageID);
router.post("/:accion", authenticationJWT.verificarToken,crudTriage);

module.exports=router;