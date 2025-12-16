const express = require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getIngresosXHcuVigente,
    getIngresosXAreaPiso,
    getCensoXId,
    getHcuHospitalizado,
    getIngresosXAreaTorrePisoSala,
    crudCicloHospitalizacion,
    getEgresosAll,
    getEgresosBusqueda,
    getEgresoXId,
    getReporteEgresosINEC,
    getCensoActualReporte,
    getPDFTotal,
    getPDFTotalDescarga
} = require("../../controllers/hospitalizacion/censo.controller");


const router = express.Router();

// Routes

router.get("/hcu/:hcu", authenticationJWT.verificarToken, getIngresosXHcuVigente);
router.get("/area/:area", authenticationJWT.verificarToken, getIngresosXAreaPiso);
router.get("/paciente_ingresado/:identificacion", authenticationJWT.verificarToken, getHcuHospitalizado);
router.get("/total/:area/:torre/:piso/:sala", authenticationJWT.verificarToken, getIngresosXAreaTorrePisoSala);
router.get("/id/:id", authenticationJWT.verificarToken, getCensoXId);
router.post("/:accion", authenticationJWT.verificarToken, crudCicloHospitalizacion);

//Reportes
router.get("/reporte/inec/:mes/:anio", getReporteEgresosINEC);
router.get("/reporte/actual_censo", getCensoActualReporte);
router.get("/hcucomplete/:hcu", authenticationJWT.verificarToken,getPDFTotal);
router.get("/hcucomplete/descarga/:hcu", authenticationJWT.verificarToken,getPDFTotalDescarga);

//Egresos
router.get("/egresos/all", authenticationJWT.verificarToken, getEgresosAll);
router.get("/egresos/bsq/:bsq", authenticationJWT.verificarToken, getEgresosBusqueda);
router.get("/egresos/id/:id", authenticationJWT.verificarToken, getEgresoXId);

module.exports = router;