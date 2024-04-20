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

//Modulo Funciones Auxilaires
const rutasAuxliares = require('./modulos/auxiliares.modulo');
rutasAuxliares(app);

//Modulo Administrador
const rutasAdministrador = require('./modulos/administrador.modulo');
rutasAdministrador(app);

//Modulo Historia Clinica
const rutasHCU = require('./modulos/historia_clinica.modulo');
rutasHCU(app);


module.exports={
    app
}