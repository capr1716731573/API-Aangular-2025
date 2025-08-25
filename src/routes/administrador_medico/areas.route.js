const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAreas,
    getAreasBsq,
    getAreasID,
    crudAreas
}=require("../../controllers/administrador_medico/areas.controller");


const router = express.Router();

// Routes
router.get("/todos/:estado/:casa", authenticationJWT.verificarToken,getAreas);
router.get("/bsq/:estado/:casa/:valor", authenticationJWT.verificarToken,getAreasBsq);
router.get("/id/:id", authenticationJWT.verificarToken,getAreasID);
router.post("/:accion", authenticationJWT.verificarToken,crudAreas);

module.exports=router;