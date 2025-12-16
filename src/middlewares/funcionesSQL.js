const fs = require('fs');
var path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const { PDFDocument } = require('pdf-lib');

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

const getArray = async (sql) => {
    try {
        const [results] = await sequelize.query(sql);

        if (!results || results.length === 0) {
            return [];
        }

        return results; // <-- RETORNA TODO EL ARREGLO
    } catch (error) {
        console.error("Error ejecutando la consulta:", error.message);
        return [];
    }
};


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

handlebars.registerHelper("not", (v) => !v);

handlebars.registerHelper("or", function () {
    // Devuelve true si alguno es truthy
    return Array.from(arguments).slice(0, -1).some(Boolean);
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

//Funcion que se utiliza en PDF Total
const generateBufferPDF = async (pageContents) => {
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

    return buffer;
}

// Une buffers PDF en orden (preserva páginas y orientaciones/tamaños)
const mergePdfBuffers = async (buffers = []) => {
    const out = await PDFDocument.create();

    for (const buf of buffers) {
        if (!buf || !buf.length) continue;
        const src = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach(p => out.addPage(p));
    }

    const bytes = await out.save();
    return Buffer.from(bytes);
};

/**
 * Genera un PDF combinando múltiples templates, pero permitiendo orientación mixta por bloques.
 * Por defecto todo es vertical, excepto templates cuyo path contenga "/signos_vitales/" o "/kardex/".
 *
 * Importante: Puppeteer aplica `landscape` a TODO el PDF del `page.pdf()`;
 * por eso renderizamos por bloques y luego unimos con pdf-lib.
 */
const generateBufferPDFMixedOrientation = async (
    pageContents = [],
    isLandscapeForTemplate = (templatePath) => {
        const norm = (templatePath || '').toString().replace(/\\/g, '/');
        return norm.includes('/signos_vitales/') || norm.includes('/kardex/');
    }
) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1600, height: 1190 }
    });

    const page = await browser.newPage();

    const renderGroup = async (group, landscape) => {
        let html = '';
        group.forEach((content, index) => {
            const templateHtml = fs.readFileSync(content.templatePath).toString('utf8');
            const template = handlebars.compile(templateHtml);
            html += template(content.data);
            if (index < group.length - 1) {
                html += '<div style="page-break-before: always;"></div>';
            }
        });

        await page.setContent(html);
        return await page.pdf({
            printBackground: true,
            displayHeaderFooter: false,
            format: 'A4',
            landscape: !!landscape,
        });
    };

    // Agrupar consecutivos por orientación *y* por "sección" para evitar que el CSS de un template
    // afecte al siguiente (problema típico cuando concatenamos HTML completos con <style> globales).
    const buffers = [];
    let current = [];
    let currentLandscape = null;
    let currentGroupKey = null;

    const deriveGroupKey = (content) => {
        const templatePath = (content?.templatePath || '').toString().replace(/\\/g, '/');
        if (!templatePath) return '__no_template__';

        // Portadas: aislar cada una por su título (evita que su @page/body afecte a la sección siguiente)
        if (templatePath.includes('/reportes/shared/section_title.html')) {
            const t = (content?.data?.title || '').toString().trim();
            return `__title__:${t || 'untitled'}`;
        }

        const parts = templatePath.split('/').filter(Boolean);
        const base = (parts[parts.length - 1] || '').toLowerCase().replace(/\.html?$/, '');
        const folder = (parts[parts.length - 2] || '').toLowerCase();

        // En "emergencia" hay múltiples reportes (008_1/008_2, triage, etc.)
        // Agrupamos por prefijo del nombre (008, triage, etc.) para que 008_1+008_2 queden juntos,
        // pero no se mezclen con otros documentos.
        if (folder === 'emergencia') {
            const root = base.replace(/(_?\d+)$/, ''); // 008_1 -> 008, 008_2 -> 008
            return `${folder}:${root || base}`;
        }

        // En el resto de carpetas, el folder suele representar un "documento" (anamnesis, epicrisis, etc.)
        return folder || base;
    };

    for (const content of pageContents) {
        // Permite forzar orientación por item (útil para portadas de sección)
        const landscape = (content && typeof content.landscape === 'boolean')
            ? content.landscape
            : isLandscapeForTemplate(content?.templatePath, content);
        const groupKey = deriveGroupKey(content);
        if (currentLandscape === null) currentLandscape = landscape;
        if (currentGroupKey === null) currentGroupKey = groupKey;

        if ((landscape !== currentLandscape || groupKey !== currentGroupKey) && current.length) {
            buffers.push(await renderGroup(current, currentLandscape));
            current = [content];
            currentLandscape = landscape;
            currentGroupKey = groupKey;
        } else {
            current.push(content);
        }
    }
    if (current.length) {
        buffers.push(await renderGroup(current, currentLandscape));
    }

    await browser.close();
    return await mergePdfBuffers(buffers);
};


// NUEVO: para consumo interno (no usa res). Acepta bind params y options opcionales (tx, logging, etc.)
const getRowsRaw = async (sql, params = [], options = {}) => {
    // Si usas Postgres con placeholders $1, $2, ... usa `bind`.
    // Si prefieres ":nombre" o "?" puedes usar `replacements`.
    const queryOptions = {
        bind: params,       // Para SQL con $1, $2, ...
        logging: false,
        // type: QueryTypes.SELECT, // ← Si activas esto, sequelize devuelve solo `results` (sin metadata)
        ...options
    };

    // Para mantener compatibilidad con tu patrón actual, NO ponemos type: SELECT.
    const result = await sequelize.query(sql, queryOptions);

    // Dos formas posibles de retorno:
    // 1) Sin type:SELECT → [results, metadata]
    // 2) Con type:SELECT → results (array)
    let rows, metadata;

    if (Array.isArray(result) && result.length === 2) {
        [rows, metadata] = result;
    } else {
        rows = result;      // cuando uses type: SELECT
        metadata = null;
    }

    // En Postgres, metadata.rowCount suele venir en SELECT;
    // si no está, usamos rows.length como respaldo.
    const count = Array.isArray(rows)
        ? rows.length
        : (metadata && typeof metadata.rowCount === 'number' ? metadata.rowCount : 0);

    return { rows, count, metadata };
};

// NUEVO: ejecuta una función Postgres que recibe TEXT (nuestro JSON stringify)
const callTextFunctionRaw = async (fnName, opciones, options = {}) => {
    const sql = `select * from ${fnName}($1::text)`;           // $1 con bind
    const jsonText = JSON.stringify(opciones);
    const [results, metadata] = await sequelize.query(sql, {
        bind: [jsonText],
        logging: false,
        ...options,
    });
    const count = metadata?.rowCount ?? (Array.isArray(results) ? results.length : 0);
    return { rows: results, count, metadata };
};


module.exports = {
    crud_StoreProcedure,
    getRows,
    getRowID,
    getAll_Rows_StoreProcedure,
    getID_Row_StoreProcedure,
    getData,
    getArray,
    generateMultiplesPDF,
    generateMultiplesPDF_Frame,
    generateOnePdf_Frame,
    generateBufferPDF,
    generateBufferPDFMixedOrientation,
    callTextFunctionRaw,
    getRowsRaw
};