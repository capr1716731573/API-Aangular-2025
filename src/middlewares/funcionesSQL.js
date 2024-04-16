/**
 * AQUI SE DEFINEN LAS FUNCIONES A LA BASE DE DATOS Y RETORNAR UN JSON DEL STORE PROCEDURE 
 *  O FORMARLO DESDE AQUI MISMO
 */
const { sequelize } = require('../config/database');

require('dotenv').config();

const variablesEntorno = process.env;

//*********************************************** ******************************************/
//*****  MANEJO DE CRUD PARA INGRESO ACTUALIZACION Y ELIMINACION DE REGISTROS  *********** */
//*********************************************** ******************************************/
const crud_StoreProcedure = async (sql, req, res) => {
    try {
        const consulta = sql;
        const [results] = await sequelize.query(consulta);
        res.status(200).json(results[0].mensaje);

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

//*********************************************** ******************************************/
//*****  MANEJO DE CONSULTAS Y TRANSFORMAR A JSON LOS RESULTADOS  *********** */
//*********************************************** ******************************************/
const getRows = async (sql, req, res) => {
    try {
        const consulta = sql;

        const [results, metadata] = await sequelize.query(consulta);
        res.status(200).json({
            status: 'ok',
            rows: results,
            count: metadata.rowCount
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}


const getRowID = async (sql, req, res) => {
    try {
        const consulta = sql;

        const [results] = await sequelize.query(consulta);
        // Verificar si results tiene elementos y si results[0] está definido
        if (results && results.length > 0 && results[0]) {
            res.status(200).json({
                status: 'ok',
                rows: results[0]
            });
        } else {
            // Retornar objeto vacío si no hay resultados o si results[0] no está definido
            res.status(200).json({
                status: 'ok',
                rows: {}
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}


//*********************************************** ******************************************/
//*****  MANEJO DE CONSULTAS YA VIENE TRANSFORMADAS A JSON  ****************************** */
//*********************************************** ******************************************/

const getAll_Rows_StoreProcedure = async (sql, req, res) => {
    try {
        const consulta = sql;
        const [results] = await sequelize.query(consulta);
        res.status(200).json(results[0].mensaje);

    } catch (error) {
        console.log(JSON.stringify(error));
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const getID_Row_StoreProcedure = async (sql, req, res) => {
    try {
        const consulta = sql;
        const [results] = await sequelize.query(consulta);
        res.status(200).json(results[0].mensaje);

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}



module.exports = {
    crud_StoreProcedure,
    getRows,
    getRowID,
    getAll_Rows_StoreProcedure,
    getID_Row_StoreProcedure
};