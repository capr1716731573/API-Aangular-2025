const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllPersona,
    getPersonaID,
    getPersonaBsq,
    crudPersona
}=require("../../controllers/administrador/personas.controller");


const router = express.Router();

// Routes
router.get("/", authenticationJWT.verificarToken,getAllPersona);
router.get("/bsq/:valor", authenticationJWT.verificarToken,getPersonaBsq);
router.get("/id/:opcion/:id", authenticationJWT.verificarToken,getPersonaID);
router.post("/:accion", authenticationJWT.verificarToken,crudPersona);

module.exports=router;