const express= require('express');
var authenticationJWT = require('../../middlewares/authentication');
const {
    getAll008,
    get008Bsq,
    get008Fechas,
    get008ID,
    crud008,
    reporte008_descarga,
    reporte008_frame,
    reporte008_descarga1,
    reporte008_frame1
}=require("../../controllers/emergencia/008.controller");


const router = express.Router();

// Routes
//Catalogo Cabecera
router.get("/all/", authenticationJWT.verificarToken,getAll008);
router.get("/bsq/:valor", authenticationJWT.verificarToken,get008Bsq);
router.get("/fechas/:f1/:f2", authenticationJWT.verificarToken,get008Fechas);
router.get("/id/:opcion/:id", authenticationJWT.verificarToken,get008ID);
router.post("/:accion", authenticationJWT.verificarToken,crud008);
/*Multiples Paginas*/
router.get("/rep_descarga/:id",reporte008_descarga);
router.get("/rep_frame/:id",reporte008_frame);
/**Una pagina */
router.get("/rep_descarga_1/:id", authenticationJWT.verificarToken,reporte008_descarga1);
router.get("/rep_frame_1/:id", authenticationJWT.verificarToken,reporte008_frame1);

module.exports=router;