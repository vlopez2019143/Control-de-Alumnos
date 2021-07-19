"use strict"

var jwt= require("jwt-simple");
var moment= require("moment");
var secret= ("clave_secreta_IN6aV");

exports.createToken = function(usuario){

    var payload = {
        
        sub: usuario._id,
        Usuario: usuario.Usuario,
        rol: usuario.rol,
        iat: moment().unix(),
        epx: moment().day(10, "days").unix()
    }
    return jwt.encode(payload, secret);
}