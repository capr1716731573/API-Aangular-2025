function configurarRutas_HistoriaClinica(app) {
    app.use("/hcu", require('../routes/historia_clinica/historia_clinica.route'));
        
}

module.exports = configurarRutas_HistoriaClinica;