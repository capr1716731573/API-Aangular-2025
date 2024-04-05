const express = require('express');
const cors= require('cors');

const app=express();

//middleware CORS
app.use(cors());

//Lectura y Parseo del Body
app.use(express.json());

/********************************************* */
///////////// MODULOS DE RUTAS //////////////////
/********************************************* */

//Modulo Autenticacion
const rutasAutenticacion = require('./modulos/autenticacion.modulo');
rutasAutenticacion(app);

//Modulo Adminsitrador
const rutasAdministrador = require('./modulos/administrador.modulo');
rutasAdministrador(app);

module.exports={
    app
}