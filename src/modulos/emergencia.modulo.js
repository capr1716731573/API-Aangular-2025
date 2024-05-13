function configurarRutas_Emergencia(app) {
    app.use("/triage", require('../routes/emergencia/triage.route')); 
        
}

module.exports = configurarRutas_Emergencia;