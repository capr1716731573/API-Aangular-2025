// Define una función que recibe 'app' como parámetro
function configurarRutas_Autenticacion(app) {
    app.use("/auth", require('../routes/autenticacion/login.route'));    
}

module.exports = configurarRutas_Autenticacion;
  

