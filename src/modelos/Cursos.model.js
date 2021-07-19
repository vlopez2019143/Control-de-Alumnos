"use strict"

var mongoose =require("mongoose");
var Schema = mongoose.Schema;

var CursosSchema = Schema({
    
    alumno: String,
    Profesor:String,
    Nombre : String,
    CursoMaestroid: String

});

module.exports =mongoose.model("Cursos", CursosSchema);