function configurarRutas_Auxiliares(app) {
    app.use("/iva", require('../routes/auxiliares/iva.route'));
    app.use("/cli_fact", require('../routes/auxiliares/clientes_facturacion.route'));   
    app.use("/validar_identificacion", require('../routes/auxiliares/validar_cedula.route'));    
}

module.exports = configurarRutas_Auxiliares;