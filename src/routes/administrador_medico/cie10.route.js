const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getCie10,
    getCie10Bsq,
    getCie10ID,
    getCie10Padres,
    getCie10Hijos,
    crudCie10
}=require("../../controllers/administrador_medico/cie10.controller");


const router = express.Router();

// Routes
router.get("/:estado", authenticationJWT.verificarToken,getCie10);
router.get("/padres/:estado", authenticationJWT.verificarToken,getCie10Padres);
router.get("/hijos/:estado", authenticationJWT.verificarToken,getCie10Hijos);
router.get("/bsq/:valor", authenticationJWT.verificarToken,getCie10Bsq);
router.get("/id/:id", authenticationJWT.verificarToken,getCie10ID);
router.post("/:accion", authenticationJWT.verificarToken,crudCie10);

module.exports=router;