const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
   getInecEspecialidadesMedicas,
    getInecEspecialidadesMedicasBsq,
    getInecEspecialidadesMedicasID,
    crudInecEspecialidadesMedicas
}=require("../../controllers/administrador_medico/inec_especialidades.controller");


const router = express.Router();

// Routes
router.get("/all/:estado", authenticationJWT.verificarToken,getInecEspecialidadesMedicas);
router.get("/bsq/:estado/:valor", authenticationJWT.verificarToken,getInecEspecialidadesMedicasBsq);
router.get("/id/:id", authenticationJWT.verificarToken,getInecEspecialidadesMedicasID);
router.post("/:accion", authenticationJWT.verificarToken,crudInecEspecialidadesMedicas);

module.exports=router;