function configurarRutas_Hospitalizacion(app) {
    app.use("/evolucion", require('../routes/hospitalizacion/evolucion.route'));
        
}

module.exports = configurarRutas_Hospitalizacion;