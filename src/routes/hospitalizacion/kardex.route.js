const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllKardex,
    getKardex_Fechas,
    getKardex_ID,
    getKardexDet_ID,
    crud_KardexCab,
    crud_KardexDet, 
    getKardex_Busqueda,
    reporteKardex_descarga,
    reporteKardex_frame
}=require("../../controllers/hospitalizacion/kardex.controller");


const router = express.Router();

// Routes
//Kardex Cabecera y Detalle
router.get("/cab/all/:hcu", authenticationJWT.verificarToken,getAllKardex);
router.get("/cab/fechas/:hcu/:f1/:f2", authenticationJWT.verificarToken,getKardex_Fechas);
router.get("/cab/id/:opcion/:id", authenticationJWT.verificarToken,getKardex_ID);
router.get("/cab/bsq/:hcu/:bsq", authenticationJWT.verificarToken,getKardex_Busqueda);
router.post("/cab/:accion", authenticationJWT.verificarToken,crud_KardexCab);
router.get("/det/id/:opcion/:id", authenticationJWT.verificarToken,getKardexDet_ID);
router.post("/det/:accion", authenticationJWT.verificarToken,crud_KardexDet);

//Reportes
router.get("/cab/reporte_descarga/:hcu/:fecha1/:fecha2",reporteKardex_descarga);
router.get("/cab/reporte_frame/:hcu/:fecha1/:fecha2",reporteKardex_frame);



module.exports=router;