// utils/appendAnnexesToPdfBuffer.js
const fs = require('fs').promises;
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const A4 = { width: 595.28, height: 841.89 }; // puntos (72 dpi)

function looksLikePdf(buf) {
  return Buffer.isBuffer(buf) && buf.slice(0, 4).toString() === '%PDF';
}
function extType(p) {
  const ext = path.extname(p || '').toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.png') return 'png';
  if (ext === '.jpg' || ext === '.jpeg') return 'jpg';
  return 'unknown';
}

/**
 * Anexa anexos (PDF/PNG/JPG) al final de un PDF existente.
 * @param {Buffer} mainBuffer - PDF base (puede ser null/undefined para crear uno nuevo)
 * @param {string[]} annexPaths - rutas locales a anexos (relativas o absolutas)
 * @param {{baseDir?: string, pageWidth?: number, pageHeight?: number, margin?: number}} opts
 * @returns {Promise<Buffer>} PDF final como Buffer
 */
async function appendAnnexesToPdfBuffer(
  mainBuffer,
  annexPaths = [],
  { baseDir = '', pageWidth = A4.width, pageHeight = A4.height, margin = 36 } = {}
) {
  const out = (mainBuffer && mainBuffer.length)
    ? await PDFDocument.load(mainBuffer, { ignoreEncryption: true })
    : await PDFDocument.create();

  for (const rel of annexPaths) {
    const abs = baseDir ? path.resolve(baseDir, rel) : rel;

    let fileBuf;
    try { fileBuf = await fs.readFile(abs); }
    catch { continue; } // si no existe, saltar

    const type = extType(abs);
    if (type === 'pdf' || looksLikePdf(fileBuf)) {
      // Anexar todas las páginas del PDF, "acopladas" a A4:
      // Creamos una página A4 nueva por cada página origen y la dibujamos escalada con márgenes.
      try {
        const src = await PDFDocument.load(fileBuf, { ignoreEncryption: true });
        const pw = pageWidth, ph = pageHeight;
        const pageCount = src.getPageCount();

        for (let i = 0; i < pageCount; i++) {
          const [embedded] = await out.embedPdf(fileBuf, [i]);
          const { width: sw, height: sh } = embedded.size();
          const scale = Math.min((pw - 2 * margin) / sw, (ph - 2 * margin) / sh, 1);
          const w = sw * scale, h = sh * scale;
          const x = (pw - w) / 2, y = (ph - h) / 2;

          const page = out.addPage([pw, ph]);
          page.drawPage(embedded, { x, y, width: w, height: h });
        }
      } catch { /* saltar si está corrupto */ }
      continue;
    }

    if (type === 'png' || type === 'jpg') {
      // incrustar imagen en una página A4 ajustada con márgenes
      try {
        const img = type === 'png' ? await out.embedPng(fileBuf) : await out.embedJpg(fileBuf);
        const { width: iw, height: ih } = img.size();
        const pw = pageWidth, ph = pageHeight;
        const scale = Math.min((pw - 2 * margin) / iw, (ph - 2 * margin) / ih, 1);
        const w = iw * scale, h = ih * scale;
        const x = (pw - w) / 2, y = (ph - h) / 2;

        const page = out.addPage([pw, ph]);
        page.drawImage(img, { x, y, width: w, height: h });
      } catch { /* saltar si falla */ }
      continue;
    }

    // Otros formatos (webp/tiff) → convertir antes (ej. con sharp) y luego volver a intentar
  }

  const bytes = await out.save();
  return Buffer.from(bytes);
}

module.exports = { appendAnnexesToPdfBuffer };
