const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO
const getValidarIdentificacion = async (req, res) => {
    let tipo = req.params.tipo;
    let num = req.params.num;
    const consulta = `select * from aux_validar_cedruc('${tipo}', '${num}') `;
    await funcionesSQL.getRowID(consulta, req, res);
}

module.exports = {
    getValidarIdentificacion
}