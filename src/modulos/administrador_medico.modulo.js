function configurarRutas_AdministradorMedico(app) {
    app.use("/casalud", require('../routes/administrador_medico/casa_salud.route')); 
    app.use("/cie", require('../routes/administrador_medico/cie10.route')); 
    app.use("/institucion", require('../routes/administrador_medico/cie10.route')); 
}

module.exports = configurarRutas_AdministradorMedico;