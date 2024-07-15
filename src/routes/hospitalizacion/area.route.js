const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAreasAll,
    getAreasXCasadeSalud,
    getAreasXModulo,
    getAreaXId,
    crudArea
}=require("../../controllers/hospitalizacion/area.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/all", authenticationJWT.verificarToken,getAreasAll);
router.get("/casa/:casa", authenticationJWT.verificarToken,getAreasXCasadeSalud);
router.get("/modulo/:mod", authenticationJWT.verificarToken,getAreasXModulo);
router.get("/id/:id", authenticationJWT.verificarToken,getAreaXId);
router.post("/:accion", authenticationJWT.verificarToken,crudArea);

module.exports=router;