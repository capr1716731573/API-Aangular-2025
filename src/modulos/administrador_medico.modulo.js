function configurarRutas_AdministradorMedico(app) {
    app.use("/casalud", require('../routes/administrador_medico/casa_salud.route')); 
    app.use("/cie", require('../routes/administrador_medico/cie10.route')); 
    app.use("/institucion", require('../routes/administrador_medico/instituciones.route')); 
    app.use("/inec_espemed", require('../routes/administrador_medico/inec_especialidades.route')); 
    app.use("/especilidades_medicos", require('../routes/administrador_medico/especilidades_medicas_usuario.route'));
    app.use("/tipo_ubicacion", require('../routes/administrador_medico/tipo_ubicacion.route'));
    app.use("/areas", require('../routes/administrador_medico/areas.route'));
    app.use("/ubicacion", require('../routes/administrador_medico/ubicacion.route'));
}

module.exports = configurarRutas_AdministradorMedico;