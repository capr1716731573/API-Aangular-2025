const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getCasaSalud,
    getCasaSaludBsq,
    getCasaSaludPrincipal,
    getCasaSaludID,
    crudCasaSalud
}=require("../../controllers/administrador_medico/casa_salud.controller");


const router = express.Router();

// Routes
router.get("/", authenticationJWT.verificarToken,getCasaSalud);
router.get("/principal", authenticationJWT.verificarToken,getCasaSaludPrincipal);
router.get("/bsq/:valor", authenticationJWT.verificarToken,getCasaSaludBsq);
router.get("/id/:id", authenticationJWT.verificarToken,getCasaSaludID);
router.post("/:accion", authenticationJWT.verificarToken,crudCasaSalud);

module.exports=router;