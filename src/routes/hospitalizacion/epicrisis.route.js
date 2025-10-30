const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllEpicrisis,
    getEpicrisis_Fechas,
    getEpicrisis_ID,
    crud_Epicrisis,
    getAllDiagnosticoEpicrisis,
    getDiagnosticoID_Epicrisis,
    crudDiagnostico_Epicrisis,    
    getAllMedicosEpicrisis,
    getMedicosID_Epicrisis,
    crudMedicos_Epicrisis,
    reporte_descarga,
    reporte_frame,
}=require("../../controllers/hospitalizacion/epicrisis.controller");


const router = express.Router();

// Routes
//Anamnesis Hospitalizacion
router.get("/hosp/all/:hcu", authenticationJWT.verificarToken,getAllEpicrisis);
router.get("/hosp/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getEpicrisis_Fechas);
router.get("/hosp/id/:opcion/:id", authenticationJWT.verificarToken,getEpicrisis_ID);
router.post("/hosp/:accion", authenticationJWT.verificarToken,crud_Epicrisis);

//Reporte
/*Multiples Paginas*/
router.get("/hosp/rep_descarga/:id",reporte_descarga);
router.get("/hosp/rep_frame/:id",reporte_frame);

//Diagnostico
router.get("/diag/:id_epi", authenticationJWT.verificarToken,getAllDiagnosticoEpicrisis);
router.get("/diag/id/:id", authenticationJWT.verificarToken,getDiagnosticoID_Epicrisis);
router.post("/diag/:accion", authenticationJWT.verificarToken,crudDiagnostico_Epicrisis);

//Médicos Epicrisis
router.get("/med/:id_epi", authenticationJWT.verificarToken,getAllMedicosEpicrisis);
router.get("/med/id/:id", authenticationJWT.verificarToken,getMedicosID_Epicrisis);
router.post("/med/:accion", authenticationJWT.verificarToken,crudMedicos_Epicrisis);


module.exports=router;