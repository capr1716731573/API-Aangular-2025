const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAll008,
    get008Bsq,
    get008Fechas,
    get008ID,
    crud008
}=require("../../controllers/emergencia/008.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/all/", authenticationJWT.verificarToken,getAll008);
router.get("/bsq/:valor", authenticationJWT.verificarToken,get008Bsq);
router.get("/fechas/:f1/:f2", authenticationJWT.verificarToken,get008Fechas);
router.get("/id/:opcion/:id", authenticationJWT.verificarToken,get008ID);
router.post("/:accion", authenticationJWT.verificarToken,crud008);

module.exports=router;