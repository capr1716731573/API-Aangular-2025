const funcionesSQL = require('../../middlewares/funcionesSQL');
require('dotenv').config();

const variablesEntorno = process.env;

//* CODIGO DE LA TABLA DE CABECERA DE CATALOGO


const getCie10= async (req, res) => {

    let desde = req.query.desde;
    let estado = req.params.estado;
    let consulta = '';
    desde = Number(desde);
    consulta =`select c.*,concat(c.codigo_cie,' - ',c.desc_cie) as cie_completo ,c_padre.desc_cie as cie_padre_nombre, c_padre.codigo_cie as cie_padre_codigo  from cie c left join cie c_padre on c.padre_cie = c_padre.pk_cie`;

    if (estado === true){
        consulta = consulta + ` where c.estado_cie=true`; 
    }
    
    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = consulta + ` order by c.desc_cie LIMIT ${variablesEntorno.ROWS_X_PAGE} OFFSET ${desde}`;
    } 

    await funcionesSQL.getRows(consulta, req, res);

}

const getCie10Bsq = async (req, res) => {
    let busqueda = req.params.valor;
    const consulta = `select c.*,concat(c.codigo_cie,' - ',c.desc_cie) as cie_completo, c_padre.desc_cie as cie_padre_nombre, c_padre.codigo_cie as cie_padre_codigo  from cie c left join cie c_padre on c.padre_cie = c_padre.pk_cie WHERE c.desc_cie LIKE UPPER('%${busqueda}%')`;
    await funcionesSQL.getRows(consulta, req, res);
}

const getCie10ID = async (req, res) => {
    let id = req.params.id;
    const consulta = `select c.*,concat(c.codigo_cie,' - ',c.desc_cie) as cie_completo, c_padre.desc_cie as cie_padre_nombre, c_padre.codigo_cie as cie_padre_codigo  from cie c left join cie c_padre on c.padre_cie = c_padre.pk_cie WHERE c.pk_cie=${id}`;
    await funcionesSQL.getRowID(consulta, req, res);
}


const crudCie10= async (req, res) => {
    const accion = req.params.accion;
    const body_json = req.body;
    const consulta = `select * from crud_casasalud ('${accion}','${JSON.stringify(body_json)}'::json)`;
    await funcionesSQL.crud_StoreProcedure(consulta, req, res);
}



module.exports = {
    getCie10,
    getCie10Bsq,
    getCie10ID,
    crudCie10
}