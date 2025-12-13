const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllTriage,
    getTriageBsq,
    getTriageFechas,
    getTriageID,
    crudTriage,
    reporteTriage_descarga,
    reporteTriage_frame
}=require("../../controllers/emergencia/triage.controller");


const router = express.Router();

// Routesa
router.get("/all/", authenticationJWT.verificarToken,getAllTriage);
router.get("/bsq/:valor", authenticationJWT.verificarToken,getTriageBsq);
router.get("/fechas/:f1/:f2", authenticationJWT.verificarToken,getTriageFechas);
router.get("/id/:opcion/:id", authenticationJWT.verificarToken,getTriageID);
router.post("/:accion", authenticationJWT.verificarToken,crudTriage);

/*Multiples Paginas*/
router.get("/rep_descarga/:id",reporteTriage_descarga);
router.get("/rep_frame/:id",reporteTriage_frame);

module.exports=router;