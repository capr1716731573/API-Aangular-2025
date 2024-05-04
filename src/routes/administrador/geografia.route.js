const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const geografia = require("../../controllers/administrador/geografia.controller");


const router = express.Router();

// Routes
//Geografia
router.get("/", authenticationJWT.verificarToken,geografia.getGeografia);
router.get("/bsq/:valor", authenticationJWT.verificarToken,geografia.getGeografiaBsq);
router.get("/ciudad/", authenticationJWT.verificarToken,geografia.getGeografiaCantonesPais);
router.get("/id/:id", authenticationJWT.verificarToken,geografia.getGeografiaID);
router.post("/:accion", authenticationJWT.verificarToken,geografia.crudGeografia);

module.exports=router;