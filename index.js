const mongoose = require("mongoose");
const app = require("./app");
var UsuarioControlador = require("./src/controladores/usuarios.controlador");;



mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/Alumnos", {useNewUrlParser: true, useUnifiedTopology:  true}).then(()=>{
    console.log("Se encuantra conectado a la base de datos");
    
    app.listen(3000, function()  {
        console.log("servidor corriendo puerto 3000");
        
        UsuarioControlador.Master();
    
    })

}).catch(err => console.log(err));