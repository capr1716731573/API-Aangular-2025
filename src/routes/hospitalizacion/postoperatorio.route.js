const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllPostoperatorio,
    getPostoperatorio_Fechas,
    getPostoperatorio_ID,
    crud_Postoperatorio,
    getAllDiagnosticoPostoperatorio,
    getDiagnosticoID_Postoperatorio,
    crudDiagnostico_Postoperatorio,    
    getAllMedicosPostoperatorio,
    getMedicosID_Postoperatorio,
    crudMedicos_Postoperatorio,
    reporte008_descarga,
    reporte008_frame,
    reporte008_descarga1,
    reporte008_frame1
}=require("../../controllers/hospitalizacion/postoperatorio.controller");


const router = express.Router();

// Routes
//Postoperatorio
router.get("/ptope/all/:hcu", authenticationJWT.verificarToken,getAllPostoperatorio);
router.get("/ptope/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getPostoperatorio_Fechas);
router.get("/ptope/id/:opcion/:id", authenticationJWT.verificarToken,getPostoperatorio_ID);
router.post("/ptope/:accion", authenticationJWT.verificarToken,crud_Postoperatorio);

//Diagnostico
router.get("/diag/:id_post", authenticationJWT.verificarToken,getAllDiagnosticoPostoperatorio);
router.get("/diag/id/:id", authenticationJWT.verificarToken,getDiagnosticoID_Postoperatorio);
router.post("/diag/:accion", authenticationJWT.verificarToken,crudDiagnostico_Postoperatorio);

//Medicos
router.get("/med/:id_post", authenticationJWT.verificarToken,getAllMedicosPostoperatorio);
router.get("/med/id/:id", authenticationJWT.verificarToken,getMedicosID_Postoperatorio);
router.post("/med/:accion", authenticationJWT.verificarToken,crudMedicos_Postoperatorio);


module.exports=router;