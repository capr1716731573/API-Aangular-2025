function configurarRutas_Emergencia(app) {
    app.use("/triage", require('../routes/emergencia/triage.route')); 
    app.use("/f_008", require('../routes/emergencia/008.route'));  
    app.use("/plan", require('../routes/emergencia/plantratamiento.route'));
    app.use("/diagnostico", require('../routes/emergencia/diagnostico.route'));   
}

module.exports = configurarRutas_Emergencia;