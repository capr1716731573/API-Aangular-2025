const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllInterconsultas_Solicitudes,
    getAllInterconsultas_Fechas,
    getInterconsultas_Solicitudes_ID,
    getInterconsultas_Respuestas_ID,
    crud_Interconsultas_Solicitud,
    crud_Interconsultas_Respuestas,
    getAllDiagnosticoInterconsultas,
    getDiagnosticoID_Interconsultas,
    crudDiagnostico_Interconsultas,
    reporte_descarga,
    reporte_frame
}=require("../../controllers/hospitalizacion/interconsultas.controller");


const router = express.Router();

// Routes
//Interconsulta Solicitudes
router.get("/intersol/all/:hcu", authenticationJWT.verificarToken,getAllInterconsultas_Solicitudes);
router.get("/intersol/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getAllInterconsultas_Fechas);
router.get("/intersol/id/:opcion/:id", authenticationJWT.verificarToken,getInterconsultas_Solicitudes_ID);
router.post("/intersol/:accion", authenticationJWT.verificarToken,crud_Interconsultas_Solicitud);

//Interconsulta Respuestas
router.get("/interresp/id/:opcion/:id", authenticationJWT.verificarToken,getInterconsultas_Respuestas_ID);
router.post("/interresp/:accion", authenticationJWT.verificarToken,crud_Interconsultas_Respuestas);

//Reportes
router.get("/reporte_descarga/:id_sol/:id_resp", reporte_descarga);
router.get("/reporte_frame/:id_sol/:id_resp", reporte_frame);

//Diagnostico
router.get("/diag/:id_inter/:tipo_inter", authenticationJWT.verificarToken,getAllDiagnosticoInterconsultas);
router.get("/diag/id/:id", authenticationJWT.verificarToken,getDiagnosticoID_Interconsultas);
router.post("/diag/:accion", authenticationJWT.verificarToken,crudDiagnostico_Interconsultas);



module.exports=router;