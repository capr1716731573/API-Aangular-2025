const jwt = require('jsonwebtoken');
require('dotenv').config();

//const SEED=process.env.JWT_SECRET;
const SEED="apirestnodejssecretkey";

// ==========================================
// Verificar token
// verifica que el token JWT de login sea valido y no haya expirado, si es asi me deja ejecutar el PUT, DELETE , CREATE 
////OJO EL TOKEN SE ENVIA POR URL
// ==========================================
exports.verificarToken = function(req, res, next) {
    //var token = req.query.token;
    //aqui va sin el bearer

    var token = req.headers.token;

    jwt.verify(token, SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token Incorrecto',
                errors: err
            });
        }

        req.usuario = decode.usuario;

        //este si esta bien el token me permite avanzar a la siguiente fase del codigo
        next();

    });

}; //