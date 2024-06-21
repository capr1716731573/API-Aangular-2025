const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllHCU,
    getHCUBsq,
    getHCUID,
    crudHCU
}=require("../../controllers/historia_clinica/historia_clinica.controller");


const router = express.Router();

// Routes
// HCU
router.get("/", authenticationJWT.verificarToken,getAllHCU);
router.get("/bsq/:valor", authenticationJWT.verificarToken,getHCUBsq);
router.get("/id/:opcion/:id", authenticationJWT.verificarToken,getHCUID);
router.post("/:accion", authenticationJWT.verificarToken,crudHCU);


module.exports=router;