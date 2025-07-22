const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    crudCatalogosCabecera,
    getCatalogosCabecera,
    getCatalogosCabeceraBsq,
    getCatalogosDetalle,
    getCatalogosDetalleBsq,
    crudCatalogosDetalle,
    getCatalogosCabeceraID,
    getCatalogosDetalleID
}=require("../../controllers/administrador/catalogo_cab_det.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/cab", authenticationJWT.verificarToken,getCatalogosCabecera);
router.get("/cab/bsq/:valor", authenticationJWT.verificarToken,getCatalogosCabeceraBsq);
router.get("/cab/id/:id", authenticationJWT.verificarToken,getCatalogosCabeceraID);
router.post("/cab/:accion", authenticationJWT.verificarToken,crudCatalogosCabecera);
//Catalogo Detalle
router.get("/det/:padre/:estado", authenticationJWT.verificarToken,getCatalogosDetalle);
router.get("/det/bsq/:padre/:estado/:valor", authenticationJWT.verificarToken,getCatalogosDetalleBsq);
router.get("/detalle/id/:id", authenticationJWT.verificarToken,getCatalogosDetalleID);
router.post("/det/:accion", authenticationJWT.verificarToken,crudCatalogosDetalle);

module.exports=router;