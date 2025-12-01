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
    reporte_descarga,
    reporte_frame
}=require("../../controllers/hospitalizacion/anamnesis.controller");


const router = express.Router();

// Routes
//Anamnesis Hospitalizacion
router.get("/hosp/all/:hcu", authenticationJWT.verificarToken,getAllAnamesis_Hosp);
router.get("/hosp/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getAnamesis_Hosp_Fechas);
router.get("/hosp/id/:opcion/:id", authenticationJWT.verificarToken,getAnamesis_Hosp_ID);
router.post("/hosp/:accion", authenticationJWT.verificarToken,crud_Anamesis_Hosp);
/*Multiples Paginas*/
router.get("/hosp/rep_descarga/:id",reporte_descarga);
router.get("/hosp/rep_frame/:id",reporte_frame);

//Diagnostico
router.get("/diag/:id_anam", authenticationJWT.verificarToken,getAllDiagnosticoAnamesis_Hosp);
router.get("/diag/id/:id", authenticationJWT.verificarToken,getDiagnosticoID_Anamesis_Hosp);
router.post("/diag/:accion", authenticationJWT.verificarToken,crudDiagnostico_Anamesis_Hosp);



module.exports=router;