const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    crudPersona
}=require("../../controllers/administrador/personas.controller");


const router = express.Router();

// Routes
router.post("/:accion", authenticationJWT.verificarToken,crudPersona);

module.exports=router;