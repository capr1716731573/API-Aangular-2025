const {sequelize} = require('../../config/database');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const variablesEntorno=process.env;

const login= async (req, res) => {
try {
    const body = req.body;

    console.log(body);

    const usuario = {
        user: body.user,
        password: body.password
    };

    //consulta si existen un registro del existente
    consulta = `select * from get_LoginUser('${usuario.user}','${usuario.password}')`;

    //consulta=`select * from profesion p `;
    const [results,metadata] = await sequelize.query(consulta);
    console.log(results)
    //Controla sino encuentra el usuario en la Base de Datos
    if ((metadata.rowCount === 0)||(results.length === 0) || (!results[0].mensaje) || (results[0].mensaje.datos == null)) {
        return res.status(200).json({
            status: 'error',
            mensaje: 'Credenciales incorrectas - email'
        });
    };

        //Si hay valores escojo el primero, ya que si busco uno es xq debe serv unico
    const usuarioDB = results[0].mensaje.datos;

    //Verificamos contrasena - compara un string con otro que ya utilizo el bcrypt
    if (!bcryptjs.compareSync(usuario.password, usuarioDB.password_usuario)) {
        return res.status(200).json({
            status: 'error',
            mensaje: 'Credenciales incorrectas - password'
        });
    }

    /********* creo el token***********
     1.-Instalamos jsonwebtoken --->  npm install jsonwebtoken --save
     var token = jwt.sign({ PAYLOD o cuerpo del token }, 'SEMILLA O PARABRA QUE SE ENCIPTA PARA GENERAL EL TOKEN', { expiresIn: FECHA DE EXPIRACION DEL TOKEN })*/
    /* -------------------------------- */
    const token = jwt.sign({ usuario: usuarioDB }, "apirestnodejssecretkey", { expiresIn: 14400 })

    res.status(200).json({
        status: 'ok',
        usuario: usuarioDB,
        token: token,
        id: usuarioDB._id,
    }); 

    } catch (error) {
        return res.status(500).json({ 
            status:'error',
            message: error.message 
        });
    }

}



module.exports={
    login
}