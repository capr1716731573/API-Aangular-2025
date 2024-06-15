const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAllEvolucion,
    getBsqEvolucion,
    getIdEvolucion,
    crudEvoluciones,
    reporteEvolucion_descarga,
    reporteEvolucion_frame,
    reporteEvolucion_descarga1,
    reporteEvolucion_frame1
}=require("../../controllers/hospitalizacion/evolucion.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/all/:hcu", authenticationJWT.verificarToken,getAllEvolucion);
router.get("/bsq/:hcu/:valor", authenticationJWT.verificarToken,getBsqEvolucion);
router.get("/id/:id", authenticationJWT.verificarToken,getIdEvolucion);
router.post("/:accion", authenticationJWT.verificarToken,crudEvoluciones);
/*Multiples Paginas*/
router.get("/rep_descarga/:hcu",reporteEvolucion_descarga);
router.get("/rep_frame/:hcu",reporteEvolucion_frame);


module.exports=router;