const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = 'America/Guayaquil';
dayjs.tz.setDefault(TZ);

// Parseo seguro de "YYYY-MM-DD HH:mm:ss" en tu huso horario
function parseLocal(dateStr, timeStr = '00:00:00') {
  // ejemplo de entrada: "2025-06-19", "14:51:00"
  return dayjs.tz(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm:ss', TZ);
}

function fmtDMY(d) {
  return d.tz(TZ).format('DD-MM-YYYY');
}


module.exports = { dayjs, TZ, parseLocal, fmtDMY };
