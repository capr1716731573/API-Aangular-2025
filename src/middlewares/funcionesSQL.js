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
//*****  MANEJO REPORTES                                     ****************************** */
//*********************************************** ******************************************/
const generateMultiplesPDF = async (pageContents, res) => {
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
      margin: { top: '2px', bottom: '0px' }
  
     /* COLOCAR ENCABEZADO Y PIE DE PAGINA 
      headerTemplate: headerTemplate,
      footerTemplate: footerTemplate, 
      */
  
    });
  
    await browser.close();
  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=multiple_pages.pdf');
    res.send(buffer);
};

const generateOnePdf= async (contenido) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1600, height: 1190 }
    });

    const page = await browser.newPage();

    if (contenido) {
      const template = handlebars.compile(html);
      html = template(contenido);
    }

    await page.setContent(html);

    const buffer = await page.pdf({
      printBackground: true,
      displayHeaderFooter: true,
      format: 'A4',
      margin: { top: '5px', bottom: '0px' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=receta.pdf');
    res.send(buffer);
  }

module.exports = {
    crud_StoreProcedure,
    getRows,
    getRowID,
    getAll_Rows_StoreProcedure,
    getID_Row_StoreProcedure,
    generateMultiplesPDF,
    generateOnePdf
};