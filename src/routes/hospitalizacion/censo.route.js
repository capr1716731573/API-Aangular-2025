const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getIngresosXHcuVigente,
    getIngresosXAreaPiso,
    getCensoXId,
    getIngresosXAreaTorrePisoSala,
    crudCicloHospitalizacion
}=require("../../controllers/hospitalizacion/censo.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/hcu/:hcu", authenticationJWT.verificarToken,getIngresosXHcuVigente);
router.get("/area/:area", authenticationJWT.verificarToken,getIngresosXAreaPiso);
router.get("/total/:area/:torre/:piso/:sala", authenticationJWT.verificarToken,getIngresosXAreaTorrePisoSala);
router.get("/id/:id", authenticationJWT.verificarToken,getCensoXId);
router.post("/:accion", authenticationJWT.verificarToken,crudCicloHospitalizacion);

module.exports=router;