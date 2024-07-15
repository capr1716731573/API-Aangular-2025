function configurarRutas_Hospitalizacion(app) {
    app.use("/censo", require('../routes/hospitalizacion/censo.route'));
    app.use("/area", require('../routes/hospitalizacion/area.route'));
    app.use("/tip_ubi", require('../routes/hospitalizacion/tipo_ubicacion.route'));
    app.use("/ubi", require('../routes/hospitalizacion/ubicacion.route'));
    app.use("/evolucion", require('../routes/hospitalizacion/evolucion.route'));
        
}

module.exports = configurarRutas_Hospitalizacion;