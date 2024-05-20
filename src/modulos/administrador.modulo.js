function configurarRutas_Administrador(app) {
    app.use("/persona", require('../routes/administrador/persona.route'));
    app.use("/catalogo", require('../routes/administrador/catalogo.route'));
    app.use("/geografia", require('../routes/administrador/geografia.route'));
    app.use("/perfil", require('../routes/administrador/perfil.route'));
    app.use("/menu", require('../routes/administrador/menu_perfil.route'));
    app.use("/usuario", require('../routes/administrador/usuario.route'));
    app.use("/modulo", require('../routes/administrador/modulo.route'));
        
}

module.exports = configurarRutas_Administrador;