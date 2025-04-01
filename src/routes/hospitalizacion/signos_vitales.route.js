const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAll_SignosVitales_a,
    getAll_SignosVitales_c,
    getAll_SignosVitales_d,
    getAll_SignosVitales_e,
    getSignosVitales_Fechas_a,
    getSignosVitales_Fechas_c,
    getSignosVitales_Fechas_d,
    getSignosVitales_Fechas_e,
    getSignosVitales_a_ID,
    getSignosVitales_c_ID,
    getSignosVitales_d_ID,
    getSignosVitales_e_ID,
    crud_SignosVitales_a,
    crud_SignosVitales_c,
    crud_SignosVitales_d,
    crud_SignosVitales_e
}=require("../../controllers/hospitalizacion/signos_vitales.controller");


const router = express.Router();

// Routes
//Signos Vitales Seccion A
router.get("/signos/a/all/:hcu", authenticationJWT.verificarToken,getAll_SignosVitales_a);
router.get("/signos/a/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getSignosVitales_Fechas_a);
router.get("/signos/a/id/:opcion/:id", authenticationJWT.verificarToken,getSignosVitales_a_ID);
router.post("/signos/a/:accion", authenticationJWT.verificarToken,crud_SignosVitales_a);

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



module.exports=router;