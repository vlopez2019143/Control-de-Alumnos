"use strict"

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
var usuario_rutas = require("./src/rutas/usuarios.rutas");
app.use(bodyParser.urlencoded({extended:false}));
app.use (bodyParser.json());
app.use("/api", usuario_rutas);


module.exports = app;
