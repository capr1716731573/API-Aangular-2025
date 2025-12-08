const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAll_SignosVitales_b,
    getAll_SignosVitales_c,
    getAll_SignosVitales_d,
    getAll_SignosVitales_e,
    getAll_SignosVitales_f,
    getSignosVitales_Fechas_b,
    getSignosVitales_Fechas_c,
    getSignosVitales_Fechas_d,
    getSignosVitales_Fechas_e,
    getSignosVitales_Fechas_f,
    getSignosVitales_b_ID,
    getSignosVitales_c_ID,
    getSignosVitales_d_ID,
    getSignosVitales_e_ID,
    getSignosVitales_f_ID,
    crud_SignosVitales_b,
    crud_SignosVitales_c,
    crud_SignosVitales_d,
    crud_SignosVitales_e,
    crud_SignosVitales_f,
    reporteSignos_descarga,
    reporteSignos_frame
}=require("../../controllers/hospitalizacion/signos_vitales.controller");


const router = express.Router();

// Routes
//Signos Vitales Seccion A
router.get("/signos/b/all/:hcu", authenticationJWT.verificarToken,getAll_SignosVitales_b);
router.get("/signos/b/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getSignosVitales_Fechas_b);
router.get("/signos/b/id/:opcion/:id", authenticationJWT.verificarToken,getSignosVitales_b_ID);
router.post("/signos/b/:accion", authenticationJWT.verificarToken,crud_SignosVitales_b);

//Signos Vitales Seccion c
router.get("/signos/c/all/:hcu", authenticationJWT.verificarToken,getAll_SignosVitales_c);
router.get("/signos/c/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getSignosVitales_Fechas_c);
router.get("/signos/c/id/:opcion/:id", authenticationJWT.verificarToken,getSignosVitales_c_ID);
router.post("/signos/c/:accion", authenticationJWT.verificarToken,crud_SignosVitales_c);

//Signos Vitales Seccion D
router.get("/signos/d/all/:hcu", authenticationJWT.verificarToken,getAll_SignosVitales_d);
router.get("/signos/d/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getSignosVitales_Fechas_d);
router.get("/signos/d/id/:opcion/:id", authenticationJWT.verificarToken,getSignosVitales_d_ID);
router.post("/signos/d/:accion", authenticationJWT.verificarToken,crud_SignosVitales_d);

//Signos Vitales Seccion E
router.get("/signos/e/all/:hcu", authenticationJWT.verificarToken,getAll_SignosVitales_e);
router.get("/signos/e/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getSignosVitales_Fechas_e);
router.get("/signos/e/id/:opcion/:id", authenticationJWT.verificarToken,getSignosVitales_e_ID);
router.post("/signos/e/:accion", authenticationJWT.verificarToken,crud_SignosVitales_e);

//Signos Vitales Seccion F
router.get("/signos/f/all/:hcu", authenticationJWT.verificarToken,getAll_SignosVitales_f);
router.get("/signos/f/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getSignosVitales_Fechas_f);
router.get("/signos/f/id/:opcion/:id", authenticationJWT.verificarToken,getSignosVitales_f_ID);
router.post("/signos/f/:accion", authenticationJWT.verificarToken,crud_SignosVitales_f);

//Reportes
router.get("/signos/reporte_descarga/:hcu/:fecha1",reporteSignos_descarga);
router.get("/signos/reporte_frame/:hcu/:fecha1",reporteSignos_frame);



module.exports=router;