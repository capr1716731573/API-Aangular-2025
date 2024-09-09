const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllAnamesis_Hosp,
    getAnamesis_Hosp_Fechas,
    getAnamesis_Hosp_ID,
    crud_Anamesis_Hosp,
    getAllDiagnosticoAnamesis_Hosp,
    getDiagnosticoID_Anamesis_Hosp,
    crudDiagnostico_Anamesis_Hosp, 
}=require("../../controllers/hospitalizacion/anamnesis.controller");


const router = express.Router();

// Routes
//Anamnesis Hospitalizacion
router.get("/hosp/all/:hcu", authenticationJWT.verificarToken,getAllAnamesis_Hosp);
router.get("/hosp/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getAnamesis_Hosp_Fechas);
router.get("/hosp/id/:id", authenticationJWT.verificarToken,getAnamesis_Hosp_ID);
router.post("/hosp/:accion", authenticationJWT.verificarToken,crud_Anamesis_Hosp);

//Diagnostico
router.get("/diag/:id_anam", authenticationJWT.verificarToken,getAllDiagnosticoAnamesis_Hosp);
router.get("/diag/id/:id", authenticationJWT.verificarToken,getDiagnosticoID_Anamesis_Hosp);
router.post("/diag/:accion", authenticationJWT.verificarToken,crudDiagnostico_Anamesis_Hosp);



module.exports=router;