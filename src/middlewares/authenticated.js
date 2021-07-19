"use strict"
var jwt = require("jwt-simple");
var moment = require("moment");
var secret= ("clave_secreta_IN6aV");

exports.ensureauth = function(req, res, next){

    if(!req.headers.authorization){

        return res.status(400).send({mensaje: "La participacion no tiene la cabecera de autenticación"});

    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try{

        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment.unix() ){
            return res.status(401).send({mensaje: "El token ha vencido"});

        }

    }catch{

        return res.status(404).send({mensaje:"el token no es valido"});

    }
    
    req.user = payload;
    next();

}