"use strict"
//const { find } = require("../modelos/usuarios.model");
var Usuario= require("../modelos/usuarios.model");
var Cursos= require("../modelos/Cursos.model.js");
var bcrypt= require("bcrypt-nodejs");
var jwt = require("../servicios/jwt");


function Master(req, res){

     var usuarioMode1 = Usuario();   
     usuarioMode1.Usuario= "Maestro"
     usuarioMode1.rol="ROL_MAESTRO"

     Usuario.find({ 
          Usuario: "Maestro"
     }).exec((err, adminoEncontrado )=>{
          if(err) return console.log({mensaje: "Error al crear maestro"});
          if(adminoEncontrado.length >= 1){
               return console.log("El maestro esta listo");
          }else{bcrypt.hash("123456", null, null, (err, passwordEncriptada)=>{
               usuarioMode1.password = passwordEncriptada;
               usuarioMode1.save((err, usuarioguardado)=>{
                    if(err) return console.log({mensaje : "Error en la peticion"});
                    if(usuarioguardado){console.log("Maestro preparado");
                    }else{
                    console.log({mensaje:"El maestro no esta listo"});
                    }      
               })     
          })
          }
     })
}

function registrarAlumno(req, res){

     var usuarioMode1 = Usuario();
     var params = req.body;

     if(params.Usuario && params.password){
          usuarioMode1.Usuario = params.Usuario;
          usuarioMode1.rol = "ROL_ALUMNO";
          Usuario.find({Usuario: usuarioMode1.Usuario}).exec((err, UsuarioEncontrados)=>{
               if(err) return res.status(500).send({mensaje: "error en la peticion"});
               if(UsuarioEncontrados && UsuarioEncontrados.length >= 1){
                    return res.status(500).send({mensaje: "El Alumno ya existe"});
               }else{
                    bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                         usuarioMode1.password = passwordEncriptada;
                         usuarioMode1.save((err, usuarioguardado) => {
                              if(err) return res.status(500).send({mensaje : "Error en la peticion"});
                              if(usuarioguardado){
                                   res.status(200).send({usuarioguardado})
                              }else{
                                   res.status(404).send({mensaje:"No se a podido guardar el Alumno"});
                              }
                         })     
                    })
                    
               }
                    
          })
     }

}

function registrarMaestro(req, res){

     var usuarioMode1 = Usuario();
     var params = req.body;
     
     if(params.Usuario && params.password){
          usuarioMode1.Usuario = params.Usuario;
          usuarioMode1.rol = "ROL_MAESTRO";
          bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
               usuarioMode1.password = passwordEncriptada;
               usuarioMode1.save((err, usuarioguardado)=>{
                    if(err) return res.status(500).send({mensaje : "Error en la peticion"});
                    if(usuarioguardado){
                         res.status(200).send({usuarioguardado});
                    }else{
                         res.status(404).send({mensaje:"No se a podido guardar el maestro"});
                    }          
               })     
          })
     }
               
}

function login(req,res){
     var params = req.body;
     Usuario.findOne({Usuario: params.Usuario}, (err, usuarioEncontrado)=>{
          if(err) return res.status(500).send({mensaje: "Error en la peticion"});
          if(usuarioEncontrado){
               bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada)=>{
                    if(passVerificada){
                         if(params.getToken == "true"){
                              return res.status(200).send({
                              token: jwt.createToken(usuarioEncontrado)});
                         }else{
                              usuarioEncontrado.password = undefined;
                              return res.status(200).send({usuarioEncontrado});
                         }
                    }else{
                         return res.status(500).send({mensaje:"el usuario no se a podido identificar"});
                    }
                })
          }else{
               return res.status(500).send({mensaje:"error al buscar usuario"});
          }
     })
}

function editarUsuario(req, res){
     var iDUsuario= req.params.id;
     var params = req.body;
     delete params.password;
     if(req.user.rol === "ROL_MAESTRO"){
          if(req.user.rol=== "ROL_MAESTRO" && iDUsuario != req.user.sub  ){
               return res.status(500).send({mensaje: "Un maestro no puede editar alumnos"});
          }
          if(req.user.rol=== "ROL_MAESTRO"){
               return res.status(500).send({mensaje: "Un maestro no puede editar su perfil, hable con el jefe"});
          }
     }
     if(iDUsuario != req.user.sub){
          return res.status(500).send({mensaje:"no se puede modificar otro usuario "});
     }
     Usuario.findByIdAndUpdate(iDUsuario, params, {new:true},(err, usuarioactualizado)=>{
          if(err) return res.status(500).send({mensaje:"Error en la peticion"});
          if(!usuarioactualizado) return res.status(500).send({mensaje:"No se ha podido editar"});
          return res.status(200).send({usuarioactualizado});
     })
}

function EliminarUsuario(req, res){
     var idUsuario= req.params.id;
     if(req.user.rol === "ROL_MAESTRO"){
          if(req.user.rol=== "ROL_MAESTRO" && idUsuario != req.user.sub  ){
               return res.status(500).send({mensaje: "Un maestro no puede Eliminar usuarios"});
          }
          if(req.user.rol=== "ROL_MAESTRO"){
               return res.status(500).send({mensaje: "Un maestro no puede Eliminar su usuario, hable con el administrador"});
          }
     }

     if(idUsuario != req.user.sub ){
          return res.status(500).send({mensaje:"no se puede Eliminar otro usuario "});
     }

     Cursos.deleteMany({alumno: req.user.sub}).exec((err, usuarioactualizado)=>{
          if(err) return res.status(500).send({mensaje:"Error en la peticion"});
          if(!usuarioactualizado) return res.status(500).send({mensaje:"No se ha podido Eliminar el usuario"});
          Usuario.findByIdAndDelete(idUsuario,(err, usuarioEliminado)=>{
               if(err) return res.status(500).send({mensaje:"Error en la peticion"});
               if(!usuarioactualizado) return res.status(500).send({mensaje:"No se ha podido Eliminar el usuario"});
               return res.status(200).send({usuarioEliminado});
          })
     })
}

module.exports = {
     registrarAlumno,
     registrarMaestro,
     editarUsuario,
     login,
     Master,
     EliminarUsuario
}
