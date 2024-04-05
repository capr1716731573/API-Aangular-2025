const{ validationResult }=require('express-validator');

const validarCampos= (req, res, next)=>{
    //Controlar los errores del middleware
    const errores= validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            errors:errores.mapped()
        });
    }

    next();
}

const errorMessage=(req, res, next)=>{
    //Controlar los errores del middleware
    const errores= validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            errors:errores.mapped()
        });
    }

    next();
}

const respuestaHttpError=(req,res,status,msg)=>{
    return res.status(status).json({
        status: 'error',
        mensaje: msg
    });
}

module.exports={
    validarCampos,
    errorMessage,
    respuestaHttpError
}