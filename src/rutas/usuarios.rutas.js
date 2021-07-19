"use strict"

var express = require("express");
var UsuarioControlador = require("../controladores/usuarios.controlador");
var CursosControlador = require("../controladores/cursos.controlador");
var md_autorizacion = require("../middlewares/authenticated.js");
var api = express.Router()
api.post("/registrarAlumno", UsuarioControlador.registrarAlumno)
api.post("/registrarMaestro", UsuarioControlador.registrarMaestro)
api.post("/login", UsuarioControlador.login)
api.put("/editarUsuario/:id", md_autorizacion.ensureauth, UsuarioControlador.editarUsuario)
api.put("/EliminarUsuario/:id", md_autorizacion.ensureauth, UsuarioControlador.EliminarUsuario)
api.post("/ingresarCursos", md_autorizacion.ensureauth, CursosControlador.ingresarCursos );
api.post("/ingresarCurso", md_autorizacion.ensureauth, CursosControlador.IngresarCurso );
api.get("/obtenerCursos", md_autorizacion.ensureauth, CursosControlador.obtenerCursos);
api.put("/editarCurso/:id", md_autorizacion.ensureauth, CursosControlador.editarCurso)
api.put("/EliminarCurso/:id", md_autorizacion.ensureauth, CursosControlador.EliminarCurso)

module.exports = api;
