const fs = require('fs');
var path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

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

//*********************************************** ******************************************/
//*****  MANEJO DE CONSULTAS PARA ENVIAR SIN EL response  ****************************** */
//*********************************************** ******************************************/
const getData = async (sql) => {
    try {
        const consulta = sql;
        const [results] = await sequelize.query(consulta);

        if (!results || results.length === 0 || !results[0]) {
            return null;
        }

        return results[0];
    } catch (error) {
        console.error('Error ejecutando la consulta:', error.message);
        return null;
    }
}

//*********************************************** ******************************************/
//*****  MANEJO REPORTES                                     *******************************/
//*********************************************** ******************************************/
// Registrar un ayudante de comparación para Handlebars
handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

// Registrar un ayudante de comparación para Handlebars si es nulo o vacio
handlebars.registerHelper('isNullVacio', function (value) {
    if (value !== null && value !== undefined && value !== '') return true;
    else return false;
});


// Reportes en donde el pdf se descarga automaticamente 
const generateMultiplesPDF = async (nombre_archivo, pageContents, req, res) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1600, height: 1190 }
    });

    const page = await browser.newPage();
    let html = '';

    // Bucle para generar el contenido de cada página
    pageContents.forEach((content, index) => {
        const templateHtml = fs.readFileSync(content.templatePath).toString('utf8');
        const template = handlebars.compile(templateHtml);
        html += template(content.data);

        // Añadir salto de página sólo si no es la última página
        if (index < pageContents.length - 1) {
            html += '<div style="page-break-before: always;"></div>';
        }
    });

    await page.setContent(html);

    // Configurar el encabezado y pie de página
    const headerTemplate = '<span style="font-size: 10px;">Encabezado personalizado</span>';
    const footerTemplate = '<span style="font-size: 10px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>';


    const buffer = await page.pdf({
        printBackground: true,
        displayHeaderFooter: false,
        format: 'A4',

        /* COLOCAR ENCABEZADO Y PIE DE PAGINA 
         headerTemplate: headerTemplate,
         footerTemplate: footerTemplate, 
         */

    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${nombre_archivo}`);
    res.send(buffer);
}

const generateMultiplesPDF_Frame = async (pageContents, req, res) => {
    try {
        var waitUntil = 'load';
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1600, height: 1190 }
        });

        const page = await browser.newPage();
        let html = '';

        // Bucle para generar el contenido de cada página
        pageContents.forEach((content, index) => {
            const templateHtml = fs.readFileSync(content.templatePath).toString('utf8');
            const template = handlebars.compile(templateHtml);
            html += template(content.data);

            // Añadir salto de página sólo si no es la última página
            if (index < pageContents.length - 1) {
                html += '<div style="page-break-before: always;"></div>';
            }
        });

        await page.setContent(html);
        const element = await page.$('body');
        let screenShot = await element.screenshot();

        const buffer = await page.pdf({
            printBackground: true,
            displayHeaderFooter: false,
            format: 'A4',

        });

        await browser.close();

        //let base64data = screenShot.toString('base64');
        let pdfBase64 = buffer.toString('base64');
        //let exportar = handlebars.compile("<iframe src='data:application/pdf;base64," + pdfBase64 + "' height='90%' width='100%''></iframe>")
        let exportar = handlebars.compile(pdfBase64);
        let exportarTemplate = exportar({}, { waitUntil });
        //res.writeHead(200, { 'Content-Type': 'text/html' });
        //res.end(exportarTemplate);
        return res.status(200).json({
            status: 'ok',
            message: exportarTemplate
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

//Reporte  en donde se descangan por medio de un frame
const generateOnePdf_Frame = async (contenido, req, res) => {
    try {
        var waitUntil = 'load';
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1600, height: 1190 }
        });

        var html = fs.readFileSync(contenido.page1).toString('utf8');
        var data = contenido.data;

        const page = await browser.newPage();


        if (contenido) {
            const template = handlebars.compile(html);
            html = template(contenido, { waitUntil });
        }

        await page.setContent(html);

        const element = await page.$('body');
        let screenShot = await element.screenshot();

        var buffer;

        buffer = await page.pdf({
            //landscape: landscape,
            printBackground: true,
            displayHeaderFooter: true,
            format: 'A4',
        });

        await browser.close()

        //let base64data = screenShot.toString('base64');
        let pdfBase64 = buffer.toString('base64');
        //let exportar = handlebars.compile("<iframe src='data:application/pdf;base64," + pdfBase64 + "' height='90%' width='100%''></iframe>")
        let exportar = handlebars.compile(pdfBase64);
        let exportarTemplate = exportar({}, { waitUntil });
        //res.writeHead(200, { 'Content-Type': 'text/html' });
        //res.end(exportarTemplate);
        return res.status(200).json({
            status: 'ok',
            message: exportarTemplate
        });

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
    getID_Row_StoreProcedure,
    getData,
    generateMultiplesPDF,
    generateMultiplesPDF_Frame,
    generateOnePdf_Frame
};