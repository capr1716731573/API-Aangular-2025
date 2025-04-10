function configurarRutas_Hospitalizacion(app) {
    app.use("/censo", require('../routes/hospitalizacion/censo.route'));
    app.use("/area", require('../routes/hospitalizacion/area.route'));
    app.use("/tip_ubi", require('../routes/hospitalizacion/tipo_ubicacion.route'));
    app.use("/ubi", require('../routes/hospitalizacion/ubicacion.route'));
    app.use("/evolucion", require('../routes/hospitalizacion/evolucion.route'));
    app.use("/anamnesis", require('../routes/hospitalizacion/anamnesis.route'));
    app.use("/interconsulta", require('../routes/hospitalizacion/interconsultas.route'));
    app.use("/epicrisis", require('../routes/hospitalizacion/epicrisis.route'));
    app.use("/sigvita", require('../routes/hospitalizacion/signos_vitales.route'));
    app.use("/kardex", require('../routes/hospitalizacion/kardex.route'));
    app.use("/postoperatorio", require('../routes/hospitalizacion/postoperatorio.route'));
        
}

module.exports = configurarRutas_Hospitalizacion;