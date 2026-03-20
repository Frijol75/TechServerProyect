// este archivo se encarga de conectar la app con MongoDB
// mongoose es la libreria que nos ayuda a hablar con la base de datos

const mongoose = require("mongoose");

// esta funcion intenta conectarse a la base de datos
const connectDB = async () => {
  try {
    // process.env.MONGODB_URI lee la variable que pusiste en el archivo .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB conectado correctamente");
  } catch (error) {
    // si falla la conexion, muestra el error y detiene el servidor
    console.error("Error al conectar MongoDB:", error.message);
    process.exit(1);
  }
};

// exportamos la funcion para poder usarla en app.js
module.exports = connectDB;