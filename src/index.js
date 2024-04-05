//import app from './app.js';
const {app} = require('./app');
//import sequelize from './config/database'
const {sequelize} = require('./config/database');
/*
    FUNCION PRINCIPAL PARA ARRANCAR LA APP
    1) Primero valida si hay conexion a la Base de datos
    2) Si hay conexion arranca el API-REST
*/

async function main(){
    try {
        await sequelize.authenticate();
        console.log('Conexion a la DB POSTGRES: \x1b[32m%s\x1b[0m',' Correcta');
        app.listen(3005, () => {
            console.log('Express Server corriendo en el puerto 3005: \x1b[32m%s\x1b[0m', 'online');
        });
    } catch (error) {
        console.error('Error al realizar conexion a Base de Datos',error);
    }
}

/* DESPLIEGO FUNCION PRINCIPAL */
main();
