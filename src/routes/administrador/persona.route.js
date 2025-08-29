const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllPersona,
    getPersonaID,
    getPersonaBsq,
    getUVerificaPersonaUsuario,
    getVerificaPersonaHistoriaClinica,
    crudPersona
}=require("../../controllers/administrador/personas.controller");


const router = express.Router();

// Routes
router.get("/", authenticationJWT.verificarToken,getAllPersona);
router.get("/bsq/:valor", authenticationJWT.verificarToken,getPersonaBsq);
router.get("/id/:opcion/:id", authenticationJWT.verificarToken,getPersonaID);
router.get("/usupersona/:identificacion", authenticationJWT.verificarToken,getUVerificaPersonaUsuario);
router.get("/histopersona/:identificacion", authenticationJWT.verificarToken,getVerificaPersonaHistoriaClinica);
router.post("/:accion", authenticationJWT.verificarToken,crudPersona);

module.exports=router;