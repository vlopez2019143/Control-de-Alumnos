"use strict"
var Cursos= require("../modelos/Cursos.model.js");
var jwt = require("../servicios/jwt");

function ingresarCursos(req, res){
     var CursosModel = Cursos();
     var params = req.body;
     if(req.user.rol === "ROL_ALUMNO"  ){
          return res.status(500).send({mensaje:"Solo los profesores pueden crear cursos"})
     }else{
          if(params.Nombre ){
               CursosModel.Profesor = req.user.sub;
               CursosModel.Nombre = params.Nombre;
               Cursos.find({ Nombre: CursosModel.Nombre}).exec((err, CursosEncontrados)=>{
                    if(err) return res.status(500).send({mensaje: "Error en la busqueda del curso"});
                    if(CursosEncontrados && CursosEncontrados.length >= 1){
                    return res.status(500).send({mensaje: "El Curso ya existe"});
                    }else{
                         CursosModel.save((err, CursoGuardado) => {
                              if(err) return res.status(500).send({mensaje : "Error en la peticion"});
                              if(CursoGuardado){
                                   res.status(200).send({CursoGuardado});
                              }else{
                                   res.status(404).send({mensaje:"No se guarda el Usuario"});
                              }
                         })     
                    }
               
               })
          }
     }
}

function IngresarCurso(req, res) {
     var CursosModel = Cursos();
     var params = req.body;
     if(req.user.rol === "ROL_MAESTRO"){
          return res.status(500).send({mensaje:"Solo alumnos pueden unirse a los cursos"});
     }else{
          if(params.Nombre){
               CursosModel.Nombre = params.Nombre;
               CursosModel.alumno = req.user.sub;
               Cursos.find({alumno : CursosModel.alumno, Nombre:CursosModel.Nombre }).exec((err, CursosR)=>{
                    if(err) return res.status(500).send({mensaje:"Error al ingresar al curso"});
                    if(!CursosR)return res.status(500).send({mensaje:"No tienes datos"}); 
                    if(CursosR && CursosR.length >= 1){
                         return res.status(500).send({mensaje: "Ya estas en el curso"});
                    }else{
                         Cursos.find({alumno : CursosModel.alumno}).exec((err, CursosM)=>{
                              if(err) return res.status(500).send({mensaje:"Error al unirte"});
                              if(!CursosM)return res.status(500).send({mensaje:"No tienes datos"}); 
                              if(CursosM && CursosM.length >3){
                                   return res.status(500).send({mensaje:"Solo puedes tener 3 cursos"});
                              }else{
                                   Cursos.findOne(  {Nombre : CursosModel.Nombre  },`Profesor`).exec((err, CursosRel)=>{
                                        if(err)res.status(500).send({mensaje:"Error al unirte"});
                                        if(!CursosRel)return res.status(500).send({mensaje:"No tienes datos"}); 
                                        CursosModel.Profesor = CursosRel.Profesor;
                                        CursosModel.CursoMaestroid = CursosRel._id
                                        CursosModel.save((err, CursoGuardado) => {
                                             if(err) return res.status(500).send({mensaje : "Error en la peticion"});
                                             if(CursoGuardado){
                                                  res.status(200).send({CursoGuardado})
                                             }else{
                                                  res.status(404).send({mensaje:"No se guarda el usuario"}) 
                                             }                     
                                        })   
                                   })
                              }  
                         })
                    }
               })
          }else{
               return res.status(500).send({mensaje:"No envio los datos solicitados"});      
          }        
     }
}

function obtenerCursos(req, res){
    if(req.user.rol != "ROL_MAESTRO"  ){
         Cursos.find({alumno : req.user.sub}).exec((err, Cursos)=>{
              if(err)return res.status(500).send({mensaje:"Error al obtener el curso"});
              if(!Cursos)return res.status(500).send({mensaje:"Error en usuario o No tienes datos"});
              return res.status(200).send({Cursos});
          })
     }else{
          Cursos.find({alumno: null , Profesor: req.user.sub  }).exec((err, Cursos)=>{
               if(err)return res.status(500).send({mensaje:"Error en la peticion"});
               if(!Cursos)return res.status(500).send({mensaje:"Error en usuario o No tienes datos"}); 
               return res.status(200).send((Cursos));
          })
     }
}

function editarCurso(req, res){
     var idCurso= req.params.id;
     var params = req.body;
     delete params.password;
     if(req.user.rol != "ROL_MAESTRO")return res.status(500).send({mensaje :"Solo los profesores pueden modificar"});
     Cursos.findOne({ _id:idCurso,alumno:null  }).exec((err, CursosB)=>{
          if(err)return res.status(500).send({mensaje:"Error en la peticion"});
          if(!CursosB)return res.status(500).send({mensaje:"Error en usuario o No tienes datos"});
          if(CursosB.Profesor != req.user.sub)return res.status(500).send({mensaje:"No se puede Modificar el curso"});
          Cursos.update({CursoMaestroid:idCurso},{$set:{Nombre:params.Nombre}},{multi:true}).exec((err, Cursoactualizado)=>{
               if(err) return res.status(500).send({mensaje:"Error en la peticion"});
               if(!Cursoactualizado) return res.status(500).send({mensaje:"No se ha podido editar"});
               if(Cursoactualizado){
                    Cursos.findByIdAndUpdate(idCurso, params, {new:true},(err, Cursoactualizado)=>{
                         if(err) return res.status(500).send({mensaje:"Error en la peticion"});
                         if(!Cursoactualizado) return res.status(500).send({mensaje:"No se ha podido editatr"});
                         if(Cursoactualizado){
                              return res.status(200).send({Cursoactualizado});
                         }
                    })
               }
          })
     })
}

function EliminarCurso(req, res){
     var idCurso= req.params.id;
     if(req.user.rol != "ROL_MAESTRO")return res.status(500).send({mensaje :"Solo los profesores pueden Eliminar"});
     Cursos.findOne({ _id:idCurso,alumno:null  }).exec((err, CursosB)=>{
          if(err)return res.status(500).send({mensaje:"Error en la peticion borrar"});
          if(!CursosB)return res.status(500).send({mensaje:"Error al eliminar o no tienes datos"});
          if(CursosB.Profesor != req.user.sub )return res.status(500).send({mensaje:"No se puede eliminar el curso"});
          Cursos.update({CursoMaestroid:idCurso},{$set:{Nombre: "defult(Curso Maestro Eliminado)"}  },{multi:true}).exec((err, Cursoactualizado)=>{
               if(err) return res.status(500).send({mensaje:"Error en la peticion"});
               if(!Cursoactualizado) return res.status(500).send({mensaje:"No se ha eliminado el Curso"});
               if(Cursoactualizado){
                    Cursos.findByIdAndDelete(idCurso,(err, CursoEliminado)=>{
                         if(err) return res.status(500).send({mensaje:"Error en la peticion"});
                         if(!Cursoactualizado) return res.status(500).send({mensaje:"No se ha eliminado el Curso"});
                         if(Cursoactualizado){
                              return res.status(200).send({CursoEliminado});
                         }
                    })
               }
          })
     })
}

module.exports = {
     ingresarCursos, 
     editarCurso, 
     obtenerCursos,
     IngresarCurso,
     EliminarCurso
} 