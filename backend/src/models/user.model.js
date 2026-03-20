// este archivo define como se ve un usuario en la base de datos
// cada campo es una columna, como en una tabla de Excel

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // nombre del usuario
  name: String,

  // correo electronico
  email: String,

  // id que da Google cuando el usuario inicia sesion con Google
  // por ahora lo dejamos vacio hasta que implementemos el login
  googleId: String,

  // fecha en que se creo la cuenta
  // default: Date.now significa que se llena automatico con la fecha de hoy
  createdAt: { type: Date, default: Date.now }
});

// exportamos el modelo con el nombre "User"
// MongoDB va a crear una coleccion llamada "users" automaticamente
module.exports = mongoose.model("User", userSchema);