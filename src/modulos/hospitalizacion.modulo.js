function configurarRutas_Hospitalizacion(app) {
    app.use("/censo", require('../routes/hospitalizacion/censo.route'));
    app.use("/evolucion", require('../routes/hospitalizacion/evolucion.route'));
        
}

module.exports = configurarRutas_Hospitalizacion;